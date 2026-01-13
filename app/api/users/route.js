import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

// GET all users
export async function GET() {
  const users = await prisma.user.findMany({
    include: { groups: true },
  });
  return NextResponse.json(users);
}

// POST create user
export async function POST(req) {
  const body = await req.json();

  const user = await prisma.user.create({
    data: {
      name: body.name,
      tags: [],
    },
  });

  return NextResponse.json(user);
}
