import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const validSortFields = ["title", "publishedYear", "createdAt"] as const;
const validOrders = ["asc", "desc"] as const;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim();
  const genre = searchParams.get("genre")?.trim();
  const authorName = searchParams.get("authorName")?.trim();
  const page = Math.max(Number(searchParams.get("page") ?? "1"), 1);
  const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? "10"), 1), 50);
  const sortByParam = searchParams.get("sortBy") ?? "createdAt";
  const orderParam = searchParams.get("order") ?? "desc";
  const sortBy = validSortFields.includes(sortByParam as any) ? sortByParam : "createdAt";
  const order = validOrders.includes(orderParam as any) ? orderParam : "desc";
  const skip = (page - 1) * limit;

  const where = {
    ...(search && { title: { contains: search, mode: "insensitive" as const } }),
    ...(genre && { genre }),
    ...(authorName && { author: { name: { contains: authorName, mode: "insensitive" as const } } }),
  };

  const [data, total] = await Promise.all([
    prisma.book.findMany({ where, include: { author: true }, orderBy: { [sortBy]: order }, skip, take: limit }),
    prisma.book.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);
  return NextResponse.json({
    data,
    pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
  });
}
