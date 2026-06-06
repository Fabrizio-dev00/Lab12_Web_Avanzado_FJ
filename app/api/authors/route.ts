import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const authors = await prisma.author.findMany({
    include: { _count: { select: { books: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(authors);
}

export async function POST(request: Request) {
  const body = await request.json();
  const author = await prisma.author.create({
    data: {
      name: body.name,
      email: body.email || null,
      nationality: body.nationality || null,
      birthYear: body.birthYear ? Number(body.birthYear) : null,
      bio: body.bio || null,
    },
  });
  return NextResponse.json(author, { status: 201 });
}
