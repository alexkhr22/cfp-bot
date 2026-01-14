/**
 * Group Service
 *
 * Endpoints:
 * - GET    /api/groups
 * - POST   /api/groups
 * - DELETE /api/groups/:id
 * - POST   /api/groups/join
 * - POST   /api/groups/leave
 * - GET    /api/groups/:id/cfps
 */

import { apiFetch } from "./_apiFetch.js";

export async function getAllGroups() {
  return apiFetch("/api/groups");
}

export async function createGroup({ name, keywords }) {
  return apiFetch("/api/groups", { method: "POST", body: { name, keywords } });
}

export async function deleteGroup(groupId) {
  return apiFetch(`/api/groups/${groupId}`, { method: "DELETE" });
}

export async function userJoinGroup(userId, groupId) {
  return apiFetch("/api/groups/join", {
    method: "POST",
    body: { userId, groupId },
  });
}

export async function userLeaveGroup(userId, groupId) {
  return apiFetch("/api/groups/leave", {
    method: "POST",
    body: { userId, groupId },
  });
}

export async function getAllGroupConnectedCfP(groupId) {
  return apiFetch(`/api/groups/${groupId}/cfps`);
}