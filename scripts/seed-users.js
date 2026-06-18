const fs = require("fs");
const path = require("path");

// 1. Parse .env
const envPath = path.join(__dirname, "../.env");
if (!fs.existsSync(envPath)) {
  console.error(".env file not found!");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf8");
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || "";
    value = value.trim().replace(/^"|"$/g, "").replace(/^'|'$/g, "");
    process.env[key] = value;
  }
});

// Set DATABASE_URL specifically for the prisma commerce client
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("DATABASE_URL is not set in .env!");
  process.exit(1);
}

console.log("Using database URL:", dbUrl);

// 2. Require dependencies
const admin = require(path.join(__dirname, "../apps/web/node_modules/firebase-admin"));
const { PrismaClient } = require(path.join(__dirname, "../packages/db/generated/commerce"));

// 3. Initialize Firebase Admin
const sdkKeyPath = process.env.FIREBASE_ADMIN_SDK_KEY;
if (!sdkKeyPath || !fs.existsSync(sdkKeyPath)) {
  console.error("FIREBASE_ADMIN_SDK_KEY file not found:", sdkKeyPath);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(sdkKeyPath, "utf8"));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});

const TEST_USERS = [
  {
    email: "participant@hips.foundation",
    password: "Password123!",
    displayName: "Test Participant",
    role: "PARTICIPANT",
  },
  {
    email: "facilitator@hips.foundation",
    password: "Password123!",
    displayName: "Test Facilitator",
    role: "FACILITATOR",
  },
  {
    email: "admin@hips.foundation",
    password: "Password123!",
    displayName: "Test Admin",
    role: "ADMIN",
  },
  {
    email: "superadmin@hips.foundation",
    password: "Password123!",
    displayName: "Test Super Admin",
    role: "SUPER_ADMIN",
  },
];

async function seed() {
  for (const user of TEST_USERS) {
    let uid = "";
    try {
      try {
        const userRecord = await auth.createUser({
          email: user.email,
          password: user.password,
          emailVerified: true,
          displayName: user.displayName,
        });
        uid = userRecord.uid;
        console.log(`Created Firebase user ${user.email} with UID ${uid}`);
      } catch (err) {
        if (err.code === "auth/email-already-exists" || err.code === "auth/email-already-in-use") {
          const userRecord = await auth.getUserByEmail(user.email);
          uid = userRecord.uid;
          console.log(`Firebase user ${user.email} already exists with UID ${uid}`);
        } else {
          throw err;
        }
      }

      // Upsert in database
      const dbUser = await prisma.user.upsert({
        where: { firebaseUid: uid },
        update: { role: user.role, deletedAt: null },
        create: {
          firebaseUid: uid,
          email: user.email,
          role: user.role,
        },
      });
      console.log(`Synced DB user ${user.email} with role ${dbUser.role}`);
    } catch (err) {
      console.error(`Failed to seed user ${user.email}:`, err.message);
    }
  }
  await prisma.$disconnect();
  console.log("Seeding completed successfully!");
}

seed().catch((err) => {
  console.error("Seeding crashed:", err);
  process.exit(1);
});
