import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

/**
 * Ruft alle Benutzer ab, sortiert nach Name.
 * Inkludiert die Gruppenmitgliedschaften des Benutzers.
 */
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: { groups: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Unbekannter Fehler" },
      { status: 500 }
    );
  }
}

/**
 * Erstellt einen neuen Benutzer.
 * Erwartet ein 'name' Feld im Body und initialisiert die Tags leer.
 */
export async function POST(req) {
  try {
    const body = await req.json();

    if (!body?.name) {
      return NextResponse.json({ error: "name fehlt" }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: { name: body.name, tags: [] },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Unbekannter Fehler" },
      { status: 500 }
    );
  }
}