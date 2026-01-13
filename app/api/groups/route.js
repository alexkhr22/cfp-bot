export async function GET() {
  return NextResponse.json(
    await prisma.keywordGroup.findMany()
  );
}

export async function POST(req) {
  const { name, keywords } = await req.json();

  return NextResponse.json(
    await prisma.keywordGroup.create({
      data: { name, keywords },
    })
  );
}
