import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

/**
 * Aktualisiert einen spezifischen CFP-Eintrag (z.B. den Tag).
 */
export async function PATCH(req, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);

    // Validierung: Sicherstellen, dass die ID eine gültige Zahl ist
    if (isNaN(id)) {
      return NextResponse.json({ error: "Ungültige ID-Format" }, { status: 400 });
    }

    const body = await req.json();

    // Überprüfung, ob'tag' im Request-Body enthalten ist
    if (!("tag" in body)) {
      return NextResponse.json({ error: "tag fehlt" }, { status: 400 });
    }

    // Prisma Aufruf: Update des CFPs mit der konvertierten Integer-ID
    const updated = await prisma.cFP.update({
      where: { id: id },
      data: { tag: body.tag },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Fehler beim CFP Update:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unbekannter Fehler" },
      { status: 500 }
    );
  }
}