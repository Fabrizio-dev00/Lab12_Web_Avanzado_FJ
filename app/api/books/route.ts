import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const genre = request.nextUrl.searchParams.get("genre")?.trim();
  const books = await prisma.book.findMany({
    where: genre ? { genre } : {},
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(books);
}

export async function POST(request: Request) {
  const body = await request.json();
  const book = await prisma.book.create({
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
  return NextResponse.json(book, { status: 201 });
}
