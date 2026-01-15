import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

/**
 * Ruft alle Keyword-Gruppen ab, alphabetisch sortiert nach Name.
 */
export async function GET() {
  try {
    const groups = await prisma.keywordGroup.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(groups);
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Unbekannter Fehler" },
      { status: 500 }
    );
  }
}

/**
 * Erstellt eine neue Keyword-Gruppe.
 * Validiert den Namen und stellt sicher, dass Keywords als Array gespeichert werden.
 */
export async function POST(req) {
  try {
    const { name, keywords } = await req.json();

    // Validierung: Name der Gruppe zwingend erforderlich
    if (!name) {
      return NextResponse.json({ error: "name fehlt" }, { status: 400 });
    }

    const group = await prisma.keywordGroup.create({
      data: { 
        name, 
        // Falls keywords ein String-Array im Schema ist, 
        // wird hier sichergestellt, dass immer ein Array übergeben wird.
        keywords: Array.isArray(keywords) ? keywords : [] 
      },
    });

    return NextResponse.json(group, { status: 201 });
  } catch (err) {
    console.error("Create Group Error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unbekannter Fehler" },
      { status: 500 }
    );
  }
}