import { describe, expect, it } from "vitest";
import { memoryStore } from "@/lib/store/memory";

describe("memoryStore conversation messages", () => {
  it("stores and lists messages for a session in insertion order", async () => {
    const sessionId = `s_${crypto.randomUUID()}`;
    await memoryStore.addConversationMessage({ sessionId, turnIndex: 1, role: "agent", textHe: "מה עשית?" });
    await memoryStore.addConversationMessage({ sessionId, turnIndex: 1, role: "candidate", textHe: "בדקתי מלאי" });

    const all = await memoryStore.listConversationMessages(sessionId);
    expect(all.map((m) => m.textHe)).toEqual(["מה עשית?", "בדקתי מלאי"]);
    expect(all[0].role).toBe("agent");
    expect(all[1].role).toBe("candidate");
  });

  it("filters by turnIndex when provided", async () => {
    const sessionId = `s_${crypto.randomUUID()}`;
    await memoryStore.addConversationMessage({ sessionId, turnIndex: 1, role: "agent", textHe: "תור 1" });
    await memoryStore.addConversationMessage({ sessionId, turnIndex: 2, role: "agent", textHe: "תור 2" });

    const turnOne = await memoryStore.listConversationMessages(sessionId, 1);
    expect(turnOne).toHaveLength(1);
    expect(turnOne[0].textHe).toBe("תור 1");
  });

  it("does not leak messages across sessions", async () => {
    const sessionA = `s_${crypto.randomUUID()}`;
    const sessionB = `s_${crypto.randomUUID()}`;
    await memoryStore.addConversationMessage({ sessionId: sessionA, turnIndex: 1, role: "agent", textHe: "A" });
    await memoryStore.addConversationMessage({ sessionId: sessionB, turnIndex: 1, role: "agent", textHe: "B" });

    const forA = await memoryStore.listConversationMessages(sessionA);
    expect(forA.map((m) => m.textHe)).toEqual(["A"]);
  });
});

describe("reviewFlagCounts", () => {
  it("counts only flagged decisions, grouped by session", async () => {
    const store = new (memoryStore.constructor as new () => typeof memoryStore)();
    await store.addDecision({ id: "d1", sessionId: "s1", turnIndex: 1, rawText: "a", matchedOptionKeys: [], confidence: null, needsHumanReview: true });
    await store.addDecision({ id: "d2", sessionId: "s1", turnIndex: 2, rawText: "b", matchedOptionKeys: [], confidence: null, needsHumanReview: true });
    await store.addDecision({ id: "d3", sessionId: "s1", turnIndex: 3, rawText: "c", matchedOptionKeys: [], confidence: null, needsHumanReview: false });
    await store.addDecision({ id: "d4", sessionId: "s2", turnIndex: 1, rawText: "d", matchedOptionKeys: [], confidence: null, needsHumanReview: true });

    expect(await store.reviewFlagCounts()).toEqual({ s1: 2, s2: 1 });
  });

  it("returns an empty map when nothing is flagged", async () => {
    const store = new (memoryStore.constructor as new () => typeof memoryStore)();
    await store.addDecision({ id: "d1", sessionId: "s1", turnIndex: 1, rawText: "a", matchedOptionKeys: [], confidence: null, needsHumanReview: false });
    expect(await store.reviewFlagCounts()).toEqual({});
  });
});
