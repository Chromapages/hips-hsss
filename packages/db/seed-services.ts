import type { ServiceCategory } from "@hips/types";

type SeedService = {
  slug: string;
  name: string;
  category: ServiceCategory;
  priceCents: number;
  scholarshipMinCents: number;
  scholarshipMaxCents: number;
};

export const seedServices: SeedService[] = [
  {
    slug: "individual-peer-support",
    name: "Individual peer support",
    category: "INDIVIDUAL_SUPPORT",
    priceCents: 6500,
    scholarshipMinCents: 0,
    scholarshipMaxCents: 6500,
  },
  {
    slug: "small-group-circle",
    name: "Small group circle",
    category: "GROUP_SUPPORT",
    priceCents: 3500,
    scholarshipMinCents: 0,
    scholarshipMaxCents: 3500,
  },
  {
    slug: "care-navigation",
    name: "Care navigation",
    category: "CARE_NAVIGATION",
    priceCents: 5000,
    scholarshipMinCents: 0,
    scholarshipMaxCents: 5000,
  },
  {
    slug: "crisis-planning",
    name: "Crisis planning",
    category: "CRISIS_PLANNING",
    priceCents: 4500,
    scholarshipMinCents: 0,
    scholarshipMaxCents: 4500,
  },
  {
    slug: "family-support",
    name: "Family support",
    category: "FAMILY_SUPPORT",
    priceCents: 7500,
    scholarshipMinCents: 0,
    scholarshipMaxCents: 7500,
  },
  {
    slug: "organization-training",
    name: "Organization training",
    category: "ORGANIZATION_TRAINING",
    priceCents: 25000,
    scholarshipMinCents: 0,
    scholarshipMaxCents: 0,
  },
];
