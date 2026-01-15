/**
 * Hilfsfunktion zur Ermittlung der Basis-URL.
 * Unterscheidet zwischen Client (Browser) und Server (Node/Scripts).
 */
function getBaseUrl() {
  // Client (Browser): relative URLs funktionieren
  if (typeof window !== "undefined") return "";

  // Node / Server-Script: absolute URL notwendig (aus Env oder Fallback)
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    "http://localhost:3000";

  return base.replace(/\/$/, "");
}

/**
 * Universeller Fetch-Wrapper für API-Requests.
 * Übernimmt URL-Zusammensetzung, JSON-Header und Fehlerbehandlung.
 */
export async function apiFetch(path, { method = "GET", body } = {}) {
  const baseUrl = getBaseUrl();
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Versucht Fehlermeldungen aus dem JSON-Body zu extrahieren
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const err = await res.json();
      msg = err?.error || err?.message || msg;
    } catch (_) {}
    throw new Error(msg);
  }

  return res.json();
}