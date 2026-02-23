import { apiFetch } from "./_apiFetch.js";

/**
 * Get all URLs from sites.json
 */
export function getSites() {
  return apiFetch("/api/sites");
}

/**
 * Add a new URL to sites.json
 */
export function addSite(url) {
  return apiFetch("/api/sites", {
    method: "POST",
    body: { url },
  });
}

/**
 * DELETE a URL from sites.json
 */
export function deleteSite(url) {
  return apiFetch("/api/sites", {
    method: "DELETE",
    body: { url },
  });
}