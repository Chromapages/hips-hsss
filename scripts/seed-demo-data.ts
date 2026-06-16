import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient as CommerceClient } from '../packages/db/generated/commerce';
import { PrismaClient as SafetyClient } from '../packages/db/generated/safety';
import { PrismaClient as SessionClient } from '../packages/db/generated/session';
import { seedServices } from '../packages/db/seed-services';

// 1. Initialize Firebase Admin SDK
const serviceAccountPath = process.env.FIREBASE_ADMIN_SDK_KEY || './firebase-admin.json';
const absoluteKeyPath = path.resolve(serviceAccountPath);

let isFirebaseReady = false;
let serviceAccount: any = null;

if (fs.existsSync(absoluteKeyPath)) {
  try {
    serviceAccount = JSON.parse(fs.readFileSync(absoluteKeyPath, 'utf8'));
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
  } catch (err) {
    console.warn('⚠️ Failed to parse firebase-admin.json file:', err.message);
  }
} else {
  console.warn(`⚠️ Firebase admin SDK key file not found at ${absoluteKeyPath}`);
}

const apps = admin.apps || [];

if (apps.length === 0 && serviceAccount) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    isFirebaseReady = true;
    console.log('✅ Firebase Admin SDK successfully initialized.');
  } catch (err) {
    console.warn('⚠️ Firebase Admin SDK failed to initialize. Firestore and Auth operations will be bypassed.', err.message);
  }
} else if (apps.length > 0) {
  isFirebaseReady = true;
}

const auth = isFirebaseReady ? admin.auth() : null;
const db = isFirebaseReady ? admin.firestore() : null;
const commerce = new CommerceClient();
const safety = new SafetyClient();
const sessionDb = new SessionClient();

async function main() {
  console.log('🚀 Starting H.I.P.S. Board Demo Seeding Script...');

  const demoUsers = [
    { email: 'board-participant@hips-demo.dev', password: 'HIPSDemo2025!', role: 'PARTICIPANT' },
    { email: 'board-facilitator@hips-demo.dev', password: 'HIPSDemo2025!', role: 'FACILITATOR' },
    { email: 'board-host@hips-demo.dev', password: 'HIPSDemo2025!', role: 'FACILITATOR' },
    { email: 'board-admin@hips-demo.dev', password: 'HIPSDemo2025!', role: 'ADMIN' },
  ];

  // --- Clean Up Phase ---
  console.log('🧹 Cleaning up old demo accounts and records...');

  if (isFirebaseReady && auth) {
    for (const u of demoUsers) {
      try {
        const userRecord = await auth.getUserByEmail(u.email);
        console.log(`- Deleting Firebase Auth user: ${u.email}`);
        await auth.deleteUser(userRecord.uid);
      } catch {
        // User doesn't exist, skip
      }
    }
  }

  // Delete from PostgreSQL
  await commerce.user.deleteMany({
    where: { email: { endsWith: '@hips-demo.dev' } },
  });
  console.log('- Cleaned demo users from Commerce database.');

  // Clean Firestore collections
  if (isFirebaseReady && db) {
    const collections = ['sessions', 'packages', 'scholarships', 'contact_inquiries', 'users'];
    for (const colName of collections) {
      const colRef = db.collection(colName);
      const snapshot = await colRef.get();
      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      console.log(`- Cleaned Firestore collection: ${colName}`);
    }
  }

  // Clean PostgreSQL Safety Alerts and Session Records
  await safety.safetyAlert.deleteMany({});
  await safety.escalationQueue.deleteMany({});
  await sessionDb.sessionRecord.deleteMany({});
  console.log('- Cleaned old safety alerts and live session records from Postgres.');

  // --- Seeding Phase ---
  console.log('🌱 Seeding services...');
  const serviceIdsBySlug: Record<string, string> = {};

  for (const s of seedServices) {
    const pgService = await commerce.service.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        category: s.category as any,
        priceCents: s.priceCents,
        scholarshipMinCents: s.scholarshipMinCents,
        scholarshipMaxCents: s.scholarshipMaxCents,
        active: true,
      },
      create: {
        slug: s.slug,
        name: s.name,
        category: s.category as any,
        priceCents: s.priceCents,
        scholarshipMinCents: s.scholarshipMinCents,
        scholarshipMaxCents: s.scholarshipMaxCents,
        active: true,
      },
    });

    serviceIdsBySlug[s.slug] = pgService.id;

    // Sync to Firestore
    if (isFirebaseReady && db) {
      await db.collection('services').doc(pgService.id).set({
        id: pgService.id,
        slug: s.slug,
        name: s.name,
        category: s.category,
        priceCents: s.priceCents,
        scholarshipMinCents: s.scholarshipMinCents,
        scholarshipMaxCents: s.scholarshipMaxCents,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }
  console.log('✅ Services synchronized.');

  // Create accounts
  const createdUsers: Record<string, { uid: string; dbId: string }> = {};

  for (const u of demoUsers) {
    console.log(`👤 Creating user: ${u.email}`);
    let firebaseUid = `mock-uid-${u.role.toLowerCase()}-${u.email.split('@')[0]}`;
    if (isFirebaseReady && auth && db) {
      try {
        const firebaseUser = await auth.createUser({
          email: u.email,
          password: u.password,
          emailVerified: true,
        });

        await auth.setCustomUserClaims(firebaseUser.uid, { role: u.role });
        firebaseUid = firebaseUser.uid;

        await db.collection('users').doc(firebaseUser.uid).set({
          uid: firebaseUser.uid,
          email: u.email,
          role: u.role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error(`❌ Failed to create Firebase user for ${u.email}:`, err.message);
      }
    }

    const pgUser = await commerce.user.create({
      data: {
        firebaseUid,
        email: u.email,
        role: u.role as any,
      },
    });

    createdUsers[u.email] = {
      uid: firebaseUid,
      dbId: pgUser.id,
    };
  }
  console.log('✅ Demo users created.');

  const participantUid = createdUsers['board-participant@hips-demo.dev'].uid;
  const participantDbId = createdUsers['board-participant@hips-demo.dev'].dbId;

  // --- Seed Packages ---
  console.log('📦 Seeding packages...');
  if (isFirebaseReady && db) {
    const packageRef = db.collection('packages').doc('demo-package-essential');
    await packageRef.set({
      id: 'demo-package-essential',
      userId: participantUid,
      serviceName: 'Essential Pack (5)',
      totalSessions: 5,
      usedSessions: 1,
      status: 'ACTIVE',
      stripePaymentId: 'demo_pm_package_essential',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  // --- Seed Scholarships ---
  console.log('🎓 Seeding scholarships...');
  const scholarships = [
    {
      id: 'demo-scholarship-pending',
      userId: participantUid,
      status: 'PENDING',
      requestedCents: 5000,
      note: 'I am currently between jobs and seeking support to manage stress during my job hunt.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-scholarship-approved',
      userId: participantUid,
      status: 'APPROVED',
      requestedCents: 3500,
      approvedCents: 3500,
      note: 'Requesting support for small group circles to connect with others.',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-scholarship-denied',
      userId: participantUid,
      status: 'DENIED',
      requestedCents: 25000,
      note: 'Requesting support for organization training.',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  for (const s of scholarships) {
    // Save to PostgreSQL
    const pgScholarship = await commerce.scholarship.create({
      data: {
        userId: participantDbId,
        status: s.status as any,
        requestedCents: s.requestedCents,
        approvedCents: s.approvedCents ?? null,
        note: s.note,
        createdAt: new Date(s.createdAt),
      },
    });

    // Save to Firestore using PG ID
    if (isFirebaseReady && db) {
      await db.collection('scholarships').doc(pgScholarship.id).set({
        id: pgScholarship.id,
        userId: s.userId,
        status: s.status,
        requestedCents: s.requestedCents,
        approvedCents: s.approvedCents ?? null,
        note: s.note,
        createdAt: s.createdAt,
        updatedAt: s.createdAt,
      });
    }
  }

  // --- Seed Inquiry Queue ---
  console.log('✉️ Seeding contact inquiries...');
  const contacts = [
    {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      subject: 'Question about anonymous accounts',
      message: 'How do you ensure my IP address is not logged when accessing the chat?',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      name: 'John Smith',
      email: 'john.smith@example.com',
      subject: 'Partnership Inquiry',
      message: 'Our organization would like to sponsor 50 scholarship seats for our employees.',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      name: 'Alice Johnson',
      email: 'alice.j@example.com',
      subject: 'Facilitator training application',
      message: 'When is the next intake for certified peer facilitators starting?',
      createdAt: new Date().toISOString(),
    },
  ];

  if (isFirebaseReady && db) {
    for (const c of contacts) {
      await db.collection('contact_inquiries').add({
        name: c.name,
        email: c.email,
        subject: c.subject,
        message: c.message,
        status: 'NEW',
        createdAt: c.createdAt,
        updatedAt: c.createdAt,
      });
    }
  }

  // --- Seed Sessions & Growth Data (30 Days) ---
  console.log('📅 Seeding 30 days of sessions to build growth chart...');
  
  const now = new Date();
  const serviceId = serviceIdsBySlug['individual-peer-support'];

  // Seed 1 session per day for the last 30 days
  for (let i = 29; i >= 0; i--) {
    const sessionDate = new Date();
    sessionDate.setDate(now.getDate() - i);
    sessionDate.setHours(14, 0, 0, 0);

    const sessionId = `demo-session-day-${30 - i}`;
    const tokenRef = `demo-token-day-${30 - i}`;

    // Write to Firestore
    if (isFirebaseReady && db) {
      await db.collection('sessions').doc(sessionId).set({
        id: sessionId,
        userId: participantUid,
        serviceId,
        serviceName: 'Individual peer support',
        startsAt: sessionDate.toISOString(),
        endsAt: new Date(sessionDate.getTime() + 60 * 60 * 1000).toISOString(),
        status: i === 0 ? 'ACTIVE' : 'COMPLETED',
        sessionTokenRef: tokenRef,
        createdAt: new Date(sessionDate.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    // Write to PostgreSQL session_db
    await sessionDb.sessionRecord.create({
      data: {
        sessionId,
        anonymousParticipantId: `anon-${30 - i}`,
        status: i === 0 ? 'ACTIVE' : 'ENDED',
        startsAt: sessionDate,
        endsAt: new Date(sessionDate.getTime() + 60 * 60 * 1000),
      },
    });
  }

  // --- Seed Safety Alerts & Escalations ---
  console.log('🛡️ Seeding safety alerts...');
  const alerts = [
    {
      sessionId: 'demo-session-day-30',
      severity: 'CRITICAL',
      category: 'SELF_HARM',
      anonymizedReason: 'Self-harm trigger keywords matched in transcript stream.',
      transcriptChunk: '[Participant] I don\'t see any way out, I feel like ending it tonight.',
      isResolved: false,
    },
    {
      sessionId: 'demo-session-day-29',
      severity: 'HIGH',
      category: 'HARASSMENT',
      anonymizedReason: 'Highly aggressive behavior flagged by AI classifier.',
      transcriptChunk: '[Participant] You are completely useless, shut up and stop talking to me.',
      isResolved: false,
    },
    {
      sessionId: 'demo-session-day-28',
      severity: 'MEDIUM',
      category: 'DISCLOSURE',
      anonymizedReason: 'Potential PII disclosure (phone number).',
      transcriptChunk: '[Participant] Call me at 555-0144 if you need anything.',
      isResolved: true,
    },
  ];

  for (const a of alerts) {
    const pgAlert = await safety.safetyAlert.create({
      data: {
        sessionId: a.sessionId,
        severity: a.severity as any,
        category: a.category as any,
        anonymizedReason: a.anonymizedReason,
        transcriptChunk: a.transcriptChunk,
        isResolved: a.isResolved,
      },
    });

    if (a.severity === 'CRITICAL' || a.severity === 'HIGH') {
      await safety.escalationQueue.create({
        data: {
          sessionRef: `anon-${a.sessionId}`,
          level: a.severity === 'CRITICAL' ? 'crisis' : 'urgent',
          source: 'keyword',
          summary: a.anonymizedReason,
          status: 'open',
          alertId: pgAlert.id,
        },
      });
    }
  }

  console.log('🎉 Seeding successfully completed!');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seeding failed with error:', err);
  process.exit(1);
});
