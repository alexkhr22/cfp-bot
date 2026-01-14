/**
 * CFP Service (API-based)
 *
 * Spricht ausschließlich über Next.js API Endpoints (fetch),
 * KEINE direkten Prisma-Queries mehr.
 *
 * Endpoints:
 * - POST   /api/cfps            -> createCFP
 * - GET    /api/cfps?userId=...  -> getUserCfPs
 * - PATCH  /api/cfps/:id         -> updateCfPTag
 */

import { apiFetch } from "./_apiFetch.js";

export async function createCFP(payload) {
  return apiFetch("/api/cfps", { method: "POST", body: payload });
}

export async function updateCfPTag(cfpId, tag) {
  return apiFetch(`/api/cfps/${cfpId}`, {
    method: "PATCH",
    body: { tag: tag ?? null },
  });
}

export async function getUserCfPs(userId) {
  const qs = new URLSearchParams({ userId }).toString();
  return apiFetch(`/api/cfps?${qs}`);
}