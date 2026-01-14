import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

/**
 * Löscht eine Keyword-Gruppe und entfernt alle zugehörigen Verknüpfungen.
 */
export async function DELETE(req, { params }) {
  try {
    const resolvedParams = await params;
    const groupId = parseInt(resolvedParams.id, 10);

    if (isNaN(groupId)) {
      return NextResponse.json({ error: "Ungültige Group ID" }, { status: 400 });
    }

    /** 
     * Löscht zuerst alle Abhängigkeiten in den Join-Tabellen,
     * um Foreign-Key-Constraints nicht zu verletzen.
     * Entfernt Verknüpfungen zwischen Usern und dieser Gruppe
    */
    await prisma.userKeywordGroup.deleteMany({ 
      where: { groupId: groupId } 
    });
    
    // Entfernt Verknüpfungen zwischen CFPs und dieser Gruppe
    await prisma.cFPKeywordGroup.deleteMany({ 
      where: { groupId: groupId } 
    });

    // Eigentliche Gruppe aus der Haupttabelle löschen
    await prisma.keywordGroup.delete({ 
      where: { id: groupId } 
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete Group Error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unbekannter Fehler" },
      { status: 500 }
    );
  }
}