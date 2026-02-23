// scripts/testSitesApi.js

import { getSites, addSite, deleteSite } from "../services/site-service.js";

const TEST_URL = "https://test-endpoint-check.com/";

async function run() {
  try {
    console.log("1️⃣ GET – aktuelle URLs:");
    let sites = await getSites();
    console.log(sites);

    console.log("\n2️⃣ POST – neue URL hinzufügen:");
    await addSite(TEST_URL);
    console.log("✅ hinzugefügt");

    console.log("\n3️⃣ GET – prüfen:");
    sites = await getSites();
    console.log(sites.includes(TEST_URL) ? "✅ URL vorhanden" : "❌ URL fehlt");

    console.log("\n4️⃣ DELETE – URL entfernen:");
    await deleteSite(TEST_URL);
    console.log("✅ gelöscht");

    console.log("\n5️⃣ GET – prüfen:");
    sites = await getSites();
    console.log(sites.includes(TEST_URL) ? "❌ URL noch da" : "✅ URL entfernt");

    console.log("\n🎯 Test abgeschlossen.");
  } catch (err) {
    console.error("❌ Fehler:", err.message);
  }
}

run();