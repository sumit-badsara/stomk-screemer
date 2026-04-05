import { NextRequest, NextResponse } from "next/server";
import { getFundamentals } from "@/lib/yahoo";
import { getCached, setCache } from "@/lib/cache";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  if (!symbol) {
    return NextResponse.json({ error: "symbol required" }, { status: 400 });
  }

  const cacheKey = `fundamentals:${symbol}`;
  const cached = getCached(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    const data = await getFundamentals(symbol);
    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    setCache(cacheKey, data, 6 * 60 * 60 * 1000); // 6 hours
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch fundamentals" }, { status: 500 });
  }
}
