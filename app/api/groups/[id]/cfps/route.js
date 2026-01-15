import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

/**
 * Ruft alle CFPs ab, die einer bestimmten Gruppe zugeordnet sind.
 */
export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    const groupId = parseInt(resolvedParams.id, 10);

    if (isNaN(groupId)) {
      return NextResponse.json({ error: "Ungültige Group ID" }, { status: 400 });
    }

    // Datenbank-Abfrage: Findet alle CFPs, die einen Eintrag in der 
    // Join-Tabelle für die angegebene groupId besitzen.
    const cfps = await prisma.cFP.findMany({
      where: {
        groups: { 
          some: { 
            groupId: groupId 
          } 
        },
      },
      // Inkludiert die Gruppen-Details und sortiert nach der nächsten Deadline
      include: { groups: true },
      orderBy: { deadline: "asc" },
    });

    return NextResponse.json(cfps);
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Unbekannter Fehler" },
      { status: 500 }
    );
  }
}