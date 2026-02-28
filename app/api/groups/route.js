import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

/**
* Retrieves all keyword groups, sorted alphabetically by name.
 */
export async function GET() {
  try {
    const groups = await prisma.keywordGroup.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(groups);
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { name, keywords } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "name missing" }, { status: 400 });
    }

    const group = await prisma.keywordGroup.create({
      data: { 
        name, 
 
        keywords: Array.isArray(keywords) ? keywords : [] 
      },
    });

    return NextResponse.json(group, { status: 201 });
  } catch (err) {
    console.error("Create Group Error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}