export async function POST(req) {
  const body = await req.json();

  const cfp = await prisma.cFP.create({
    data: {
      title: body.title,
      deadline: new Date(body.deadline),
      conferenceDate: new Date(body.conferenceDate),
      callback: new Date(body.callback),
      url: body.url,
      submissionForm: body.submissionForm,
      userId: body.userId,
      groups: {
        create: body.groupIds.map(id => ({
          group: { connect: { id } }
        }))
      }
    },
  });

  return NextResponse.json(cfp);
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = Number(searchParams.get("userId"));

  return NextResponse.json(
    await prisma.cFP.findMany({
      where: { userId },
      include: { groups: true },
    })
  );
}
