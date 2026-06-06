import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const author = await prisma.author.findUnique({ where: { id }, include: { books: true } });
  if (!author) return NextResponse.json({ error: "Author not found" }, { status: 404 });

  const books = author.books;
  const withYear = books.filter((book) => book.publishedYear !== null);
  const withPages = books.filter((book) => book.pages !== null);
  const byYear = [...withYear].sort((a, b) => (a.publishedYear ?? 0) - (b.publishedYear ?? 0));
  const byPages = [...withPages].sort((a, b) => (a.pages ?? 0) - (b.pages ?? 0));
  const averagePages =
    withPages.length === 0
      ? 0
      : Math.round(withPages.reduce((sum, book) => sum + (book.pages ?? 0), 0) / withPages.length);

  return NextResponse.json({
    authorId: author.id,
    authorName: author.name,
    totalBooks: books.length,
    firstBook: byYear[0] ? { title: byYear[0].title, year: byYear[0].publishedYear } : null,
    latestBook: byYear.at(-1) ? { title: byYear.at(-1)?.title, year: byYear.at(-1)?.publishedYear } : null,
    averagePages,
    genres: [...new Set(books.map((book) => book.genre).filter(Boolean))],
    longestBook: byPages.at(-1) ? { title: byPages.at(-1)?.title, pages: byPages.at(-1)?.pages } : null,
    shortestBook: byPages[0] ? { title: byPages[0].title, pages: byPages[0].pages } : null,
  });
}
