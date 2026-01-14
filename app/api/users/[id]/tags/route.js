import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

/**
 * Verarbeitet das Hinzufügen oder Entfernen von Tags bei einem Benutzer.
 */
export async function PATCH(req, { params }) {
  try {
    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.id, 10);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Ungültige ID" }, { status: 400 });
    }

    const { tag, action } = await req.json();

    // Benutzer anhand der ID suchen
    const user = await prisma.user.findUnique({ 
      where: { id: userId } 
    });

    if (!user) {
      return NextResponse.json({ error: "User nicht gefunden" }, { status: 404 });
    }

    // Update-Logik: Tag hinzufügen (einmalig via Set) oder aus dem Array filtern
    const tags = action === "add"
      ? Array.from(new Set([...(user.tags ?? []), tag]))
      : (user.tags ?? []).filter((t) => t !== tag);

    // User mit der neuen Tag-Liste aktualisieren
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { tags },
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Unbekannter Fehler" },
      { status: 500 }
    );
  }
}