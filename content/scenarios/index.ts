import type { Scenario } from "@/lib/scenario-schema";
import supplyChain from "@/content/scenarios/supply-chain";
import finance from "@/content/scenarios/finance";
import productRd from "@/content/scenarios/product-rd";
import sales from "@/content/scenarios/sales";
import healthcare from "@/content/scenarios/healthcare";
import semiconductors from "@/content/scenarios/semiconductors";
import aviationDefense from "@/content/scenarios/aviation-defense";
import retail from "@/content/scenarios/retail";
import people from "@/content/scenarios/people";
import cybersecurity from "@/content/scenarios/cybersecurity";

const ALL_SCENARIOS: Scenario[] = [
  ...supplyChain,
  ...finance,
  ...productRd,
  ...sales,
  ...healthcare,
  ...semiconductors,
  ...aviationDefense,
  ...retail,
  ...people,
  ...cybersecurity,
];

export function listScenarios(): Scenario[] {
  return ALL_SCENARIOS;
}

export function getScenario(id: string): Scenario | undefined {
  return ALL_SCENARIOS.find((s) => s.id === id);
}

export function listScenariosByDomain(domainKey: string): Scenario[] {
  return ALL_SCENARIOS.filter((s) => s.domainKey === domainKey);
}
