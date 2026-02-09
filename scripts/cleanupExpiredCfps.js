import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupExpiredCfps() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().slice(0, 10);

  console.log("🧹 CFP Cleanup gestartet:", todayStr);

  const expiredCfps = await prisma.cFP.findMany({
    where: {
      AND: [
        { deadline: { not: null } },
        { deadline: { not: "n/a" } },
        { deadline: { lt: todayStr } }
      ]
    },
    select: { id: true }
  });

  if (expiredCfps.length === 0) {
    console.log("✅ Keine abgelaufenen CFPs gefunden");
    return;
  }

  const ids = expiredCfps.map(cfp => cfp.id);

  const result = await prisma.cFP.deleteMany({
    where: {
      id: { in: ids }
    }
  });

  console.log(`🗑️ ${result.count} abgelaufene CFPs gelöscht`);
}

cleanupExpiredCfps()
  .catch(err => {
    console.error("❌ Cleanup fehlgeschlagen:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
