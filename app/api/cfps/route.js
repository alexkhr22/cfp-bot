import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

/**
 * Erstellt einen neuen CFP-Eintrag.
 * Verknüpft den CFP mit einem User und optionalen Keyword-Gruppen.
 */
export async function POST(req) {
  try {
    const body = await req.json();
    if (!body?.userId) {
      return NextResponse.json({ error: "userId fehlt" }, { status: 400 });
    }
    const userId = parseInt(body.userId, 10);

    if (!body?.title) {
      return NextResponse.json({ error: "title fehlt" }, { status: 400 });
    }

    // Erstellung des CFPs inklusive Datumskonvertierung und Relationen
    const cfp = await prisma.cFP.create({
      data: {
        title: body.title,
        deadline: new Date(body.deadline),
        location: body.location ?? null,
        conferenceDate: new Date(body.conferenceDate),
        url: body.url,
        callback: new Date(body.callback),
        submissionForm: body.submissionForm,
        wordCharacterLimit: body.wordCharacterLimit ?? null,
        tag: body.tag ?? null,
        userId: userId, // Verknüpfung mit dem Ersteller

        // Join-Tabelle: Erstellt Einträge für jede übergebene groupId (als Zahl)
        groups: {
          create: (body.groupIds ?? []).map((groupId) => ({ 
            groupId: parseInt(groupId, 10) 
          })),
        },
      },
      include: { groups: true },
    });

    return NextResponse.json(cfp, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Unbekannter Fehler" },
      { status: 500 }
    );
  }
}

/**
 * Ruft alle CFPs ab, die einem bestimmten Benutzer gehören.
 * Filterung erfolgt über den Query-Parameter ?userId=...
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const rawUserId = searchParams.get("userId");

    if (!rawUserId) {
      return NextResponse.json({ error: "userId fehlt" }, { status: 400 });
    }
    const userId = parseInt(rawUserId, 10);

    const cfps = await prisma.cFP.findMany({
      where: { userId: userId },
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