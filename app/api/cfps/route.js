import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

const SYSTEM_USER_ID = Number(process.env.SYSTEM_USER_ID);

/**
 * Creates a new CFP entry.
 * Links the CFP to a user and optional keyword groups.
 */
export async function POST(req) {
  try {
    const body = await req.json();

    if (!body?.title) {
      return NextResponse.json({ error: "title missing" }, { status: 400 });
    }
    if (!body?.url || !body?.conferenceDate) {
      return NextResponse.json(
        { error: "url or conferenceDate missing" },
        { status: 400 }
      );
    }

    const userId = body.userId
      ? parseInt(body.userId, 10)
      : SYSTEM_USER_ID;

    const cfp = await prisma.cFP.upsert({
      where: {
        url_title_conferenceDate: {
          url: body.url,
          title: body.title,
          conferenceDate: body.conferenceDate,
        },
      },
      update: {
        deadline: body.deadline,
        location: body.location ?? null,
        submissionForm: body.submissionForm,
        wordCharacterLimit: body.wordCharacterLimit ?? null,
        tags: body.tags ?? [],
        note: body.note ?? null,
      },
      create: {
        title: body.title,
        deadline: body.deadline,
        location: body.location ?? null,
        conferenceDate: body.conferenceDate,
        url: body.url,
        submissionForm: body.submissionForm,
        wordCharacterLimit: body.wordCharacterLimit ?? null,
        tags: body.tags ?? [],
        note: body.note ?? null,
        userId: userId,

        groups: {
          create: (body.groupIds ?? []).map((groupId) => ({
            groupId: parseInt(groupId, 10),
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
 * Retrieves all CFPs belonging to a specific user.
* Filtering is performed using the query parameter ?userId=...
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const rawUserId = searchParams.get("userId");

    if (!rawUserId) {
      return NextResponse.json({ error: "userId missing" }, { status: 400 });
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
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}