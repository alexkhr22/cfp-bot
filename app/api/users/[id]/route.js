import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

/**
 * Löscht einen Benutzer und alle damit verknüpften Daten.
 * Führt einen manuellen Cleanup durch, um Foreign-Key-Konflikte zu vermeiden.
 */
export async function DELETE(req, { params }) {
  try {
    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.id, 10);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Ungültige User ID" }, { status: 400 });
    }

    // Entfernt Einträge in der User-Gruppen-Join-Tabelle
    await prisma.userKeywordGroup.deleteMany({ where: { userId } });

    // CFPs vom User finden: IDs sammeln für den nächsten Cleanup-Schritt
    const cfps = await prisma.cFP.findMany({
      where: { userId },
      select: { id: true },
    });
    const cfpIds = cfps.map((c) => c.id);

    // Entfernt Gruppenverknüpfungen der CFPs und danach die CFPs selbst
    if (cfpIds.length > 0) {
      await prisma.cFPKeywordGroup.deleteMany({
        where: { cfpId: { in: cfpIds } },
      });
      await prisma.cFP.deleteMany({ where: { id: { in: cfpIds } } });
    }

    // User löschen aus Haupttabelle
    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Fehler beim User-Cleanup:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unbekannter Fehler" },
      { status: 500 }
    );
  }
}