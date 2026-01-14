/**
 * User Service
 *
 * Endpoints:
 * - GET    /api/users
 * - POST   /api/users
 * - DELETE /api/users/:id
 * - PATCH  /api/users/:id/tags   { action: "add"|"remove", tag: "..." }
 */

import { apiFetch } from "./_apiFetch.js";

export async function getAllUsers() {
  return apiFetch("/api/users");
}

export async function createUser({ name }) {
  return apiFetch("/api/users", { method: "POST", body: { name } });
}

export async function deleteUser(userId) {
  return apiFetch(`/api/users/${userId}`, { method: "DELETE" });
}

export async function addUserTag(userId, tag) {
  return apiFetch(`/api/users/${userId}/tags`, {
    method: "PATCH",
    body: { action: "add", tag },
  });
}

export async function removeUserTag(userId, tag) {
  return apiFetch(`/api/users/${userId}/tags`, {
    method: "PATCH",
    body: { action: "remove", tag },
  });
}