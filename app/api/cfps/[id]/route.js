import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

/**
* Updates a specific CFP entry (e.g., the tag).
 */
export async function PATCH(req, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const body = await req.json();


    if (!("tag" in body)) {
      return NextResponse.json({ error: "tag missing" }, { status: 400 });
    }

    const updated = await prisma.cFP.update({
      where: { id: id },
      data: { tag: body.tag },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error during CFP update:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}