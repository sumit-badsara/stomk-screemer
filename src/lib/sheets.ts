import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import path from "node:path";
import fs from "node:fs";

const SHEET_ID = process.env.GOOGLE_SHEET_ID ?? "1RZVlvZPn5m4XaQz39TR-afkZc7IR90fai65JvUtJn-4";
const CREDS_PATH = path.join(process.cwd(), "service-account.json");
const FALLBACK_CREDS_PATH = "/Users/sumit/Downloads/stomkscreemer-cd889f1ec058.json";

function loadCreds(): { client_email: string; private_key: string } {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  }
  const p = fs.existsSync(CREDS_PATH) ? CREDS_PATH : FALLBACK_CREDS_PATH;
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function getAuth() {
  const creds = loadCreds();
  return new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

async function getDoc(): Promise<GoogleSpreadsheet> {
  const doc = new GoogleSpreadsheet(SHEET_ID, getAuth());
  await doc.loadInfo();
  return doc;
}

async function getOrCreateSheet(
  doc: GoogleSpreadsheet,
  title: string,
  headers: string[]
): Promise<GoogleSpreadsheetWorksheet> {
  let sheet = doc.sheetsByTitle[title];
  if (!sheet) {
    sheet = await doc.addSheet({ title, headerValues: headers });
  }
  return sheet;
}

// --- Stock data types for the sheet ---

export type SheetStock = {
  rank: number;
  ticker: string;
  name: string;
  sector: string;
  price: number;
  changePct: number;
  signal: "bullish" | "bearish" | "neutral";
  score: number;
  verdict: string;
  tagline: string;
  updatedAt: string;
};

const STOCK_HEADERS = [
  "rank",
  "ticker",
  "name",
  "sector",
  "price",
  "changePct",
  "signal",
  "score",
  "verdict",
  "tagline",
  "updatedAt",
];

// --- Write stocks to a sheet tab ---

export async function writeStocks(
  tabName: string,
  stocks: SheetStock[]
): Promise<void> {
  const doc = await getDoc();
  const sheet = await getOrCreateSheet(doc, tabName, STOCK_HEADERS);

  // Clear existing data rows (keep header)
  const rows = await sheet.getRows();
  for (const row of rows) {
    await row.delete();
  }

  // Write new rows
  for (const stock of stocks) {
    await sheet.addRow({
      rank: stock.rank,
      ticker: stock.ticker,
      name: stock.name,
      sector: stock.sector,
      price: stock.price,
      changePct: stock.changePct,
      signal: stock.signal,
      score: stock.score,
      verdict: stock.verdict,
      tagline: stock.tagline,
      updatedAt: stock.updatedAt,
    });
  }
}

// --- Read stocks from a sheet tab ---

export async function readStocks(tabName: string): Promise<SheetStock[]> {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle[tabName];
  if (!sheet) return [];

  const rows = await sheet.getRows();
  return rows.map((row) => ({
    rank: Number(row.get("rank")) || 0,
    ticker: row.get("ticker") ?? "",
    name: row.get("name") ?? "",
    sector: row.get("sector") ?? "",
    price: Number(row.get("price")) || 0,
    changePct: Number(row.get("changePct")) || 0,
    signal: (row.get("signal") as SheetStock["signal"]) ?? "neutral",
    score: Number(row.get("score")) || 0,
    verdict: row.get("verdict") ?? "",
    tagline: row.get("tagline") ?? "",
    updatedAt: row.get("updatedAt") ?? "",
  }));
}

// --- Test connection ---

export async function testConnection(): Promise<string> {
  const doc = await getDoc();
  return `Connected to: "${doc.title}" (${doc.sheetCount} sheets)`;
}
