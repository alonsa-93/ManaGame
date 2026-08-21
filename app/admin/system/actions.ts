"use server";

import { pingAgent } from "@/lib/engine/conversational-agent";

export async function pingAgentAction() {
  return pingAgent();
}
