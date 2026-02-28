import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

/**
 * Retrieves all users, sorted by name.
 * Includes the user's group memberships.
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
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * Creates a new user.
 * Expects a ‘name’ field in the body and initializes the tags as empty.
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
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}