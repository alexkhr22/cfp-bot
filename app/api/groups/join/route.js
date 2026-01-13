export async function POST(req) {
  const { userId, groupId } = await req.json();

  await prisma.userKeywordGroup.create({
    data: { userId, groupId },
  });

  return NextResponse.json({ ok: true });
}
