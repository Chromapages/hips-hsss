export type PackageDefinition = {
  priceCents: number;
  credits: number;
  name: string;
};

export const PACKAGES: Record<"SINGLE" | "ESSENTIAL" | "SANCTUARY", PackageDefinition> = {
  SINGLE: { priceCents: 5000, credits: 1, name: 'Single Session' },
  ESSENTIAL: { priceCents: 22500, credits: 5, name: 'Essential Pack (5)' },
  SANCTUARY: { priceCents: 40000, credits: 10, name: 'Sanctuary Pack (10)' },
};
