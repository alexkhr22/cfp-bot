import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

/**
 * Retrieves all CFPs assigned to a specific group.
 */
export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    const groupId = parseInt(resolvedParams.id, 10);

    if (isNaN(groupId)) {
      return NextResponse.json({ error: "Invalid Group ID" }, { status: 400 });
    }

    const cfps = await prisma.cFP.findMany({
      where: {
        groups: { 
          some: { 
            groupId: groupId 
          } 
        },
      },

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