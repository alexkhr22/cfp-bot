import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

/**
 * Removes the link between a user and a group.
 */
export async function POST(req) {
  try {
    const body = await req.json();
    
    const userId = parseInt(body.userId, 10);
    const groupId = parseInt(body.groupId, 10);

    if (isNaN(userId) || isNaN(groupId)) {
      return NextResponse.json(
        { error: "userId or groupId missing or invalid" },
        { status: 400 }
      );
    }

    await prisma.userKeywordGroup.delete({
      where: { 
        userId_groupId: { 
          userId: userId, 
          groupId: groupId 
        } 
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {

    if (err.code === 'P2025') {
      return NextResponse.json(
        { error: "Relationship does not exist" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}