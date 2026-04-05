import { NextRequest, NextResponse } from "next/server";
import { searchStocks } from "@/lib/yahoo";
import { getCached, setCache } from "@/lib/cache";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 1) {
    return NextResponse.json([]);
  }

  const cacheKey = `search:${q.toLowerCase()}`;
  const cached = getCached<Awaited<ReturnType<typeof searchStocks>>>(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    const results = await searchStocks(q);
    setCache(cacheKey, results, 24 * 60 * 60 * 1000); // 24h
    return NextResponse.json(results);
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
