const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();
const SYSTEM_USER_ID = Number(process.env.SYSTEM_USER_ID || 1);

// __dirname existiert automatisch in CommonJS
const DATA_PATH = path.join(
  __dirname,
  "..",
  "scraper",
  "outputs",
  "active_cfps.json"
);

// ─────────────────────────────────────────────
// Main Import
// ─────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(DATA_PATH)) {
    throw new Error(`❌ JSON-Datei nicht gefunden: ${DATA_PATH}`);
  }

  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  const cfps = JSON.parse(raw);

  console.log(`🚀 Starte Import von ${cfps.length} CFPs\n`);

  let createdOrUpdated = 0;
  let failed = 0;

  for (const cfp of cfps) {
    try {
      const url = toStringOrNull(cfp.url) ?? "";   // falls du url NOT NULL brauchst
      const title = toStringOrNull(cfp.title) ?? "";

      const conferenceDate = toDateOrNull(cfp.conferenceDate);
      const deadline = toDateOrNull(cfp.deadline);

      await prisma.cFP.upsert({
        where: {
          url_title_conferenceDate: {
            url,
            title,
            conferenceDate, // Date | null (je nach Schema)
          },
        },
        update: {
          deadline,
          conferenceDate,
          location: toStringOrNull(cfp.location),
          submissionForm: toStringOrNull(cfp.submissionForm),
          wordCharacterLimit: cfp.wordCharacterLimit ?? null,
          note: toStringOrNull(cfp.notes),
          tags: Array.isArray(cfp.tags) ? cfp.tags : [],
        },
        create: {
          title,
          url,
          deadline,
          conferenceDate,
          location: toStringOrNull(cfp.location),
          submissionForm: toStringOrNull(cfp.submissionForm),
          wordCharacterLimit: cfp.wordCharacterLimit ?? null,
          note: toStringOrNull(cfp.notes),
          tags: Array.isArray(cfp.tags) ? cfp.tags : [],
          userId: SYSTEM_USER_ID,
        },
      });

      createdOrUpdated++;
      console.log("✅ importiert:", cfp.title);
    } catch (err) {
      failed++;
      console.error("❌ Fehler bei:", cfp.title);
      console.error(err);
    }
  }

  console.log("\n🏁 Import abgeschlossen");
  console.log(`✅ Erfolgreich: ${createdOrUpdated}`);
  console.log(`❌ Fehlgeschlagen: ${failed}`);
}

const toDateOrNull = (v) => {
  // akzeptiert ISO-Strings, Date-Objekte, null/undefined/""
  if (v === null || v === undefined) return null;
  if (typeof v === "string" && v.trim() === "") return null;

  const d = v instanceof Date ? v : new Date(v);

  // Invalid Date -> null (oder throw, wenn du streng sein willst)
  if (Number.isNaN(d.getTime())) return null;
  return d;
};

const toStringOrNull = (v) => {
  if (v === null || v === undefined) return null;
  if (typeof v === "string" && v.trim() === "") return null;
  return String(v);
};

// ─────────────────────────────────────────────
// Run
// ─────────────────────────────────────────────
main()
  .catch((err) => {
    console.error("💥 Fataler Fehler:", err.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
