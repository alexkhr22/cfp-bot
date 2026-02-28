import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

/**
 * Deletes a keyword group and removes all associated links.
 */
export async function DELETE(req, { params }) {
  try {
    const resolvedParams = await params;
    const groupId = parseInt(resolvedParams.id, 10);

    if (isNaN(groupId)) {
      return NextResponse.json({ error: "Invalid Group ID" }, { status: 400 });
    }

    await prisma.userKeywordGroup.deleteMany({ 
      where: { groupId: groupId } 
    });

    await prisma.cFPKeywordGroup.deleteMany({ 
      where: { groupId: groupId } 
    });

    await prisma.keywordGroup.delete({ 
      where: { id: groupId } 
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete Group Error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}