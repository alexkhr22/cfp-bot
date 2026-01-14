import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

/**
 * Entfernt die Verknüpfung zwischen einem Benutzer und einer Gruppe.
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

    // Löschen über den zusammengesetzten Unique-Index (userId_groupId)
    await prisma.userKeywordGroup.delete({
      where: { 
        userId_groupId: { 
          userId: userId, 
          groupId: groupId 
        } 
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Fehlerbehandlung: Check, falls die Beziehung gar nicht existierte
    if (err.code === 'P2025') {
      return NextResponse.json(
        { error: "Beziehung existiert nicht" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: err?.message ?? "Unbekannter Fehler" },
      { status: 500 }
    );
  }
}