import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding commerce database...");

  // Services catalog — matches HIPS_Pricing_Spec_v1.md
  const services = [
    {
      slug: "30-min-intro",
      name: "30-Minute Intro Session",
      description:
        "A free orientation session to explore your needs and determine the right path forward.",
      category: "CARE_SESSION" as const,
      standardPrice: 0,
      scholarshipMin: 0,
      scholarshipMax: 0,
      durationMins: 30,
    },
    {
      slug: "60-min-support",
      name: "60-Minute Support Session",
      description:
        "A focused one-on-one peer support session to help you navigate a specific challenge or crisis.",
      category: "CARE_SESSION" as const,
      standardPrice: 7500,
      scholarshipMin: 0,
      scholarshipMax: 5000,
      durationMins: 60,
    },
    {
      slug: "4-session-package",
      name: "4-Session Package",
      description:
        "Four consecutive support sessions at a reduced rate. Valid for 90 days from purchase.",
      category: "CARE_SESSION" as const,
      standardPrice: 25000,
      scholarshipMin: 0,
      scholarshipMax: 15000,
    },
    {
      slug: "8-session-package",
      name: "8-Session Package",
      description:
        "Eight sessions for deeper work. Valid for 90 days from purchase. Best value for ongoing support.",
      category: "CARE_SESSION" as const,
      standardPrice: 47500,
      scholarshipMin: 0,
      scholarshipMax: 25000,
    },
    {
      slug: "leadership-intro",
      name: "Leadership Intro Session",
      description:
        "A 60-minute session for leaders experiencing burnout or navigating organizational challenges.",
      category: "COACHING" as const,
      standardPrice: 15000,
      scholarshipMin: 0,
      scholarshipMax: 7500,
      durationMins: 60,
    },
    {
      slug: "leadership-track",
      name: "Leadership Track (4 Sessions)",
      description:
        "Four 60-minute coaching sessions focused on leadership resilience, decision-making, and team dynamics.",
      category: "COACHING" as const,
      standardPrice: 50000,
      scholarshipMin: 0,
      scholarshipMax: 25000,
    },
    {
      slug: "org-workshop",
      name: "Organizational Workshop",
      description:
        "A custom workshop for your organization. Topics include team resilience, crisis response, and confidential restoration.",
      category: "WORKSHOP" as const,
      standardPrice: 250000,
      scholarshipMin: null,
      scholarshipMax: null,
    },
    {
      slug: "org-retreat",
      name: "Organizational Retreat",
      description:
        "A full-day or multi-day retreat experience for teams. Custom agenda, confidential setting.",
      category: "RETREAT" as const,
      standardPrice: 750000,
      scholarshipMin: null,
      scholarshipMax: null,
    },
    {
      slug: "cohort-pilot",
      name: "Cohort — Pilot Program",
      description:
        "A small group experience (max 12) meeting weekly for 8 weeks. Peer support for leaders in similar roles.",
      category: "COHORT" as const,
      standardPrice: 35000,
      scholarshipMin: 0,
      scholarshipMax: 17500,
      cohortMax: 12,
    },
    {
      slug: "digital-download",
      name: "Digital Resource — Restoration Guide",
      description:
        "A downloadable guide with practical tools for navigating emotional distress and building resilience.",
      category: "DIGITAL_PRODUCT" as const,
      standardPrice: 1500,
      scholarshipMin: null,
      scholarshipMax: null,
    },
    {
      slug: "membership",
      name: "Monthly Membership",
      description:
        "Unlimited access to cohort sessions, digital resources, and community support. Billed monthly.",
      category: "MEMBERSHIP" as const,
      standardPrice: 1500,
      scholarshipMin: null,
      scholarshipMax: null,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
    console.log(`  ✓ ${service.slug}`);
  }

  console.log("  ✓ services catalog")

  console.log("\n✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
