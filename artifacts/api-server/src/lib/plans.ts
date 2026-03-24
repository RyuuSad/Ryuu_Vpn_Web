export type PlanId = "starter" | "premium" | "ultra";

export interface Plan {
  id: PlanId;
  name: string;
  dataGb: number;
  validityDays: number;
  priceKs: number;
  trafficLimitBytes: number;
  features: string[];
  badge?: "most_popular" | "best_value";
  pricePerGb: number;
  savingsPercent?: number;
}

export const PLANS: Record<PlanId, Plan> = {
  starter: {
    id: "starter",
    name: "STARTER PLAN",
    dataGb: 50,
    validityDays: 20,
    priceKs: 3000,
    trafficLimitBytes: 50 * 1024 * 1024 * 1024,
    features: [
      "50 GB High-Speed Data",
      "20 Days Validity",
      "Unlimited Devices",
      "Basic Support",
    ],
    pricePerGb: 60,
  },
  premium: {
    id: "premium",
    name: "PREMIUM VALUE",
    dataGb: 120,
    validityDays: 30,
    priceKs: 5000,
    trafficLimitBytes: 120 * 1024 * 1024 * 1024,
    features: [
      "120 GB High-Speed Data",
      "30 Days Validity",
      "Unlimited Devices",
      "Priority Support",
      "No Speed Throttling",
    ],
    badge: "most_popular",
    pricePerGb: 42,
    savingsPercent: 30,
  },
  ultra: {
    id: "ultra",
    name: "ULTRA PRO",
    dataGb: 250,
    validityDays: 30,
    priceKs: 10000,
    trafficLimitBytes: 250 * 1024 * 1024 * 1024,
    features: [
      "250 GB High-Speed Data",
      "30 Days Validity",
      "Unlimited Devices",
      "24/7 Premium Support",
      "Maximum Speed",
      "Best Value",
    ],
    badge: "best_value",
    pricePerGb: 40,
    savingsPercent: 33,
  },
};

export function getPlan(id: string): Plan | null {
  return PLANS[id as PlanId] ?? null;
}
