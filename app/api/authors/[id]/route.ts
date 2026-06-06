import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const author = await prisma.author.findUnique({
    where: { id },
    include: { books: true },
  });
  if (!author) return NextResponse.json({ error: "Author not found" }, { status: 404 });
  return NextResponse.json(author);
}

export async function PUT(request: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await request.json();
  const author = await prisma.author.update({
    where: { id },
    data: {
      name: body.name,
      email: body.email || null,
      nationality: body.nationality || null,
      birthYear: body.birthYear ? Number(body.birthYear) : null,
      bio: body.bio || null,
    },
  });
  return NextResponse.json(author);
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const { id } = await params;
  await prisma.author.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
