import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

/**
 * Links a user to a keyword group.
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

    await prisma.userKeywordGroup.create({
      data: { 
        userId: userId, 
        groupId: groupId 
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    if (err.code === 'P2002') {
      return NextResponse.json(
        { error: "User is already a member of this group" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}