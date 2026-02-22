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
      await prisma.cFP.upsert({
        where: {
            url_title_conferenceDate: {
            url: cfp.url,
            title: cfp.title,
            conferenceDate: cfp.conferenceDate,
            },
        },
        update: {
            deadline: cfp.deadline ?? null,
            conferenceDate: cfp.conferenceDate ?? null,
            location: cfp.location ?? null,
            submissionForm: cfp.submissionForm ?? null,
            wordCharacterLimit: cfp.wordCharacterLimit ?? null,
            note: cfp.notes ?? null,
            tags: Array.isArray(cfp.tags) ? cfp.tags : [],
        },
        create: {
            title: cfp.title,
            url: cfp.url,
            deadline: cfp.deadline ?? null,
            conferenceDate: cfp.conferenceDate ?? null,
            location: cfp.location ?? null,
            submissionForm: cfp.submissionForm ?? null,
            wordCharacterLimit: cfp.wordCharacterLimit ?? null,
            note: cfp.notes ?? null,
            tags: Array.isArray(cfp.tags) ? cfp.tags : [],
            userId: SYSTEM_USER_ID,
        },
        });


      createdOrUpdated++;
      console.log("✅ importiert:", cfp.title);
    } catch (err) {
      failed++;
      console.error("❌ Fehler bei:", cfp.title);
      console.error(err.message);
    }
  }

  console.log("\n🏁 Import abgeschlossen");
  console.log(`✅ Erfolgreich: ${createdOrUpdated}`);
  console.log(`❌ Fehlgeschlagen: ${failed}`);
}

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
