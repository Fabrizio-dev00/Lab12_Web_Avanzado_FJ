import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const books = await prisma.book.findMany({
    where: { authorId: id },
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(books);
}
