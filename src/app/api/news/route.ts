import { NextRequest, NextResponse } from "next/server";
import { getNews } from "@/lib/yahoo";
import { getCached, setCache } from "@/lib/cache";

export async function GET(req: NextRequest) {
  const company = req.nextUrl.searchParams.get("company");
  if (!company) {
    return NextResponse.json({ error: "company required" }, { status: 400 });
  }

  const cacheKey = `news:${company.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    const articles = await getNews(company);
    setCache(cacheKey, articles, 15 * 60 * 1000); // 15 minutes
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
