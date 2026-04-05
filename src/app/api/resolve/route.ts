import { NextRequest, NextResponse } from "next/server";
import { resolveSymbol } from "@/lib/yahoo";
import { getCached, setCache } from "@/lib/cache";

export async function GET(req: NextRequest) {
  const ticker = req.nextUrl.searchParams.get("ticker");
  if (!ticker) {
    return NextResponse.json({ error: "ticker required" }, { status: 400 });
  }

  const cacheKey = `resolve:${ticker.toUpperCase()}`;
  const cached = getCached<string>(cacheKey);
  if (cached) return NextResponse.json({ symbol: cached });

  try {
    const symbol = await resolveSymbol(ticker.toUpperCase());
    setCache(cacheKey, symbol, 24 * 60 * 60 * 1000); // 24h
    return NextResponse.json({ symbol });
  } catch {
    return NextResponse.json({ symbol: `${ticker.toUpperCase()}.NS` });
  }
}
