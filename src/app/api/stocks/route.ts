import { NextRequest, NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import fs from "node:fs";
import { getCached, setCache } from "@/lib/cache";

const SHEET_ID = "1RZVlvZPn5m4XaQz39TR-afkZc7IR90fai65JvUtJn-4";
const CREDS_PATH = "/Users/sumit/Downloads/stomkscreemer-cd889f1ec058.json";

function getAuth() {
  const creds = JSON.parse(fs.readFileSync(CREDS_PATH, "utf-8"));
  return new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function readTab(doc: GoogleSpreadsheet, tabName: string): Promise<Record<string, any>[]> {
  const sheet = doc.sheetsByTitle[tabName];
  if (!sheet) return [];
  const rows = await sheet.getRows();
  return rows.map((row) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj: Record<string, any> = {};
    for (const key of sheet.headerValues) {
      obj[key] = row.get(key) ?? "";
    }
    return obj;
  });
}

export async function GET(req: NextRequest) {
  const tab = req.nextUrl.searchParams.get("tab") ?? "Daily Top 10";

  const cacheKey = `sheet:${tab}`;
  const cached = getCached(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    const doc = new GoogleSpreadsheet(SHEET_ID, getAuth());
    await doc.loadInfo();

    const data = await readTab(doc, tab);
    const result = { tab, data, sheetTitle: doc.title };

    setCache(cacheKey, result, 5 * 60 * 1000); // 5 min cache
    return NextResponse.json(result);
  } catch (err) {
    console.error("Sheet read error:", err);
    return NextResponse.json({ tab, data: [], error: "Failed to read sheet" }, { status: 500 });
  }
}
