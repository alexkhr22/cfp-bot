import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

/**
 * Verknüpft einen Benutzer mit einer Keyword-Gruppe.
 */
export async function POST(req) {
  try {
    const body = await req.json();
    
    const userId = parseInt(body.userId, 10);
    const groupId = parseInt(body.groupId, 10);

    if (isNaN(userId) || isNaN(groupId)) {
      return NextResponse.json(
        { error: "userId oder groupId fehlt oder ist ungültig" },
        { status: 400 }
      );
    }

    // Eintrag in der Join-Tabelle (UserKeywordGroup) erstellen
    await prisma.userKeywordGroup.create({
      data: { 
        userId: userId, 
        groupId: groupId 
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    // Fehlerbehandlung: Prisma-Error P2002 (Unique Constraint) abfangen,
    // falls die Verbindung zwischen User und Gruppe bereits existiert.
    if (err.code === 'P2002') {
      return NextResponse.json(
        { error: "User ist bereits Mitglied dieser Gruppe" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: err?.message ?? "Unbekannter Fehler" },
      { status: 500 }
    );
  }
}