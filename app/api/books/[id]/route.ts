import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id }, include: { author: true } });
  if (!book) return NextResponse.json({ error: "Book not found" }, { status: 404 });
  return NextResponse.json(book);
}

export async function PUT(request: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await request.json();
  const book = await prisma.book.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description || null,
      isbn: body.isbn || null,
      publishedYear: body.publishedYear ? Number(body.publishedYear) : null,
      genre: body.genre || null,
      pages: body.pages ? Number(body.pages) : null,
      authorId: body.authorId,
    },
    include: { author: true },
  });
  return NextResponse.json(book);
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const { id } = await params;
  await prisma.book.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
