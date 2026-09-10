import type { Partner, SmmPlan } from "@/types/home";

// TZ 8.1–8.3. Replace this data source with the CMS in its approved stage.
export const smmPlans: readonly SmmPlan[] = [
  { months: 1, monthlyAmount: 1500 },
  { months: 3, monthlyAmount: 1350 },
  { months: 6, monthlyAmount: 1200 },
  { months: 12, monthlyAmount: 1000 },
];
export const marketingStartingAmount = 2000;
export const pricingCurrency = "USD";

// No partner identities were supplied. These records are explicitly placeholders.
export const partners: readonly Partner[] = Array.from({ length: 6 }, (_, index) => ({
  id: `placeholder-${index + 1}`,
}));
