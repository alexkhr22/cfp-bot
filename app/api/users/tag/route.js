export async function PATCH(req) {
  const { userId, tag, action } = await req.json();

  const user = await prisma.user.findUnique({ where: { id: userId } });

  const tags =
    action === "add"
      ? [...new Set([...user.tags, tag])]
      : user.tags.filter(t => t !== tag);

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { tags },
  });

  return NextResponse.json(updated);
}
