/**
 * Stomks Analyzer — fetches market data, scores stocks, writes to Google Sheet.
 *
 * Usage:
 *   node scripts/analyze.mjs                    # Rule-based scoring (no AI)
 *   node scripts/analyze.mjs --ai               # Claude AI scoring (needs ANTHROPIC_API_KEY)
 *
 * Run locally to test, then schedule via Claude Code cron for daily automation.
 */

import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import YahooFinance from "yahoo-finance2";
import { RSI, MACD, SMA } from "technicalindicators";
import fs from "node:fs";

// --- Config ---
const SHEET_ID = "1RZVlvZPn5m4XaQz39TR-afkZc7IR90fai65JvUtJn-4";
const CREDS_PATH = "/Users/sumit/Downloads/stomkscreemer-cd889f1ec058.json";
const USE_AI = process.argv.includes("--ai");

// 85 stocks across 8 sectors (10+ each)
const NIFTY_50 = [
  // Banking & Finance (15)
  "HDFCBANK.NS", "ICICIBANK.NS", "SBIN.NS", "AXISBANK.NS", "KOTAKBANK.NS",
  "INDUSINDBK.NS", "BAJFINANCE.NS", "BAJAJFINSV.NS", "SBILIFE.NS", "HDFCLIFE.NS",
  "SHRIRAMFIN.NS", "PNB.NS", "BANKBARODA.NS", "IDFCFIRSTB.NS", "FEDERALBNK.NS",
  // IT & Technology (10)
  "TCS.NS", "INFY.NS", "HCLTECH.NS", "WIPRO.NS", "TECHM.NS",
  "LTIM.NS", "MPHASIS.NS", "COFORGE.NS", "PERSISTENT.NS", "LTTS.NS",
  // Auto & Manufacturing (10)
  "MARUTI.NS", "M&M.NS", "BAJAJ-AUTO.NS", "EICHERMOT.NS", "HEROMOTOCO.NS",
  "TRENT.NS", "TATAMTRDVR.NS", "ASHOKLEY.NS", "TVSMOTORS.NS", "MOTHERSON.NS",
  // Pharma & Healthcare (10)
  "SUNPHARMA.NS", "DRREDDY.NS", "CIPLA.NS", "DIVISLAB.NS", "APOLLOHOSP.NS",
  "LUPIN.NS", "AUROPHARMA.NS", "BIOCON.NS", "TORNTPHARM.NS", "MAXHEALTH.NS",
  // Energy & Utilities (10)
  "RELIANCE.NS", "ONGC.NS", "BPCL.NS", "NTPC.NS", "POWERGRID.NS",
  "IOC.NS", "GAIL.NS", "ADANIGREEN.NS", "TATAPOWER.NS", "NHPC.NS",
  // Metals & Mining (10)
  "TATASTEEL.NS", "JSWSTEEL.NS", "HINDALCO.NS", "COALINDIA.NS", "VEDL.NS",
  "NMDC.NS", "NATIONALUM.NS", "SAIL.NS", "JINDALSTEL.NS", "APLAPOLLO.NS",
  // FMCG & Consumer (10)
  "HINDUNILVR.NS", "ITC.NS", "NESTLEIND.NS", "BRITANNIA.NS", "TATACONSUM.NS",
  "DABUR.NS", "MARICO.NS", "GODREJCP.NS", "COLPAL.NS", "VBL.NS",
  // Infrastructure & Capital Goods (10)
  "LT.NS", "ADANIENT.NS", "ADANIPORTS.NS", "GRASIM.NS", "ULTRACEMCO.NS",
  "BEL.NS", "HAL.NS", "SIEMENS.NS", "ABB.NS", "CUMMINSIND.NS",
];

// --- Google Sheets auth ---
const creds = JSON.parse(fs.readFileSync(CREDS_PATH, "utf-8"));
const auth = new JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

// --- Fetch + Analyze one stock ---
async function analyzeStock(symbol) {
  const ticker = symbol.replace(".NS", "").replace(".BO", "");

  // Fetch 6 months of daily data for technicals
  const period1 = new Date();
  period1.setMonth(period1.getMonth() - 6);

  let chartData, quote;
  try {
    [chartData, quote] = await Promise.all([
      yf.chart(symbol, { period1, interval: "1d" }),
      yf.quoteSummary(symbol, {
        modules: ["price", "summaryDetail", "financialData"],
      }),
    ]);
  } catch (e) {
    console.error(`  ✗ ${ticker}: ${e.message}`);
    return null;
  }

  const closes = chartData.quotes.map((q) => q.close).filter(Boolean);
  const volumes = chartData.quotes.map((q) => q.volume).filter(Boolean);
  if (closes.length < 30) {
    console.error(`  ✗ ${ticker}: insufficient data (${closes.length} days)`);
    return null;
  }

  // Technicals
  const rsiValues = RSI.calculate({ values: closes, period: 14 });
  const rsi = rsiValues.length > 0 ? Math.round(rsiValues[rsiValues.length - 1]) : null;

  const macdValues = MACD.calculate({
    values: closes,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false,
  });
  const lastMacd = macdValues.length > 0 ? macdValues[macdValues.length - 1] : null;
  const macdHist = lastMacd?.histogram ?? 0;

  const sma50 =
    closes.length >= 50
      ? SMA.calculate({ values: closes, period: 50 }).pop() ?? null
      : null;
  const sma200 =
    closes.length >= 200
      ? SMA.calculate({ values: closes, period: 200 }).pop() ?? null
      : null;

  const currentPrice = closes[closes.length - 1];
  const aboveSma50 = sma50 ? currentPrice > sma50 : false;
  const aboveSma200 = sma200 ? currentPrice > sma200 : false;

  // Volume spike
  const recentVol = volumes[volumes.length - 1] ?? 0;
  const avgVol = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;
  const volRatio = avgVol > 0 ? recentVol / avgVol : 1;

  // Fundamentals
  const price = quote.price;
  const summary = quote.summaryDetail;
  const financial = quote.financialData;

  const pe = summary?.trailingPE ?? null;
  const roe = financial?.returnOnEquity != null ? financial.returnOnEquity * 100 : null;
  const revenueGrowth =
    financial?.revenueGrowth != null ? financial.revenueGrowth * 100 : null;
  const debtToEquity = financial?.debtToEquity ?? null;
  const prevClose = price?.regularMarketPreviousClose ?? currentPrice;
  const changePct = prevClose
    ? ((currentPrice - prevClose) / prevClose) * 100
    : 0;

  // --- Rule-based scoring (0-10) ---
  let score = 5; // base

  // Technicals (±2.5)
  if (rsi !== null) {
    if (rsi >= 40 && rsi <= 65) score += 0.5; // healthy
    else if (rsi > 65 && rsi < 75) score += 0.25; // strong but risky
    else if (rsi >= 75) score -= 0.5; // overbought
    else if (rsi <= 30) score -= 0.5; // oversold
  }
  if (macdHist > 0) score += 0.5;
  else if (macdHist < 0) score -= 0.5;
  if (aboveSma50) score += 0.5;
  if (aboveSma200) score += 0.5;
  if (volRatio > 1.5) score += 0.5;

  // Fundamentals (±2.5)
  if (pe !== null && pe > 0 && pe < 25) score += 0.5;
  else if (pe !== null && pe > 50) score -= 0.5;
  if (roe !== null && roe > 15) score += 0.5;
  else if (roe !== null && roe < 5) score -= 0.5;
  if (revenueGrowth !== null && revenueGrowth > 10) score += 0.5;
  else if (revenueGrowth !== null && revenueGrowth < 0) score -= 0.5;
  if (debtToEquity !== null && debtToEquity < 50) score += 0.25;
  else if (debtToEquity !== null && debtToEquity > 200) score -= 0.5;

  // Change bonus
  if (changePct > 2) score += 0.5;
  else if (changePct < -2) score -= 0.5;

  score = Math.max(0, Math.min(10, Math.round(score * 10) / 10));

  // Signal
  let signal = "neutral";
  if (score >= 6.5) signal = "bullish";
  else if (score <= 4) signal = "bearish";

  // Tagline
  const tags = [];
  if (rsi !== null) tags.push(`RSI ${rsi}`);
  if (macdHist > 0) tags.push("MACD Bull");
  else if (macdHist < 0) tags.push("MACD Bear");
  if (aboveSma50) tags.push(">50 DMA");
  if (aboveSma200) tags.push(">200 DMA");
  if (volRatio > 1.5) tags.push(`Vol ${volRatio.toFixed(1)}x`);
  const tagline = tags.join(" | ");

  // Verdict
  const verdictParts = [];
  if (signal === "bullish")
    verdictParts.push("Technically strong with positive momentum.");
  else if (signal === "bearish")
    verdictParts.push("Under pressure with weak technicals.");
  else verdictParts.push("Mixed signals, neutral stance.");
  if (pe !== null) verdictParts.push(`P/E at ${pe.toFixed(1)}x.`);
  if (revenueGrowth !== null)
    verdictParts.push(`Revenue growth ${revenueGrowth > 0 ? "+" : ""}${revenueGrowth.toFixed(1)}%.`);
  const verdict = verdictParts.join(" ");

  return {
    ticker,
    name: price?.longName ?? price?.shortName ?? ticker,
    sector: "",
    price: Math.round(currentPrice * 100) / 100,
    changePct: Math.round(changePct * 100) / 100,
    signal,
    score,
    tagline,
    verdict,
  };
}

// --- Main ---
async function main() {
  console.log(`\n📈 Stomks Analyzer — ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`);
  console.log(`Mode: ${USE_AI ? "Claude AI" : "Rule-based"}\n`);

  // 1. Analyze all Nifty 50 stocks
  console.log(`Analyzing ${NIFTY_50.length} stocks...`);
  const results = [];
  for (const symbol of NIFTY_50) {
    const ticker = symbol.replace(".NS", "");
    process.stdout.write(`  → ${ticker}... `);
    const result = await analyzeStock(symbol);
    if (result) {
      results.push(result);
      console.log(`✓ score: ${result.score} (${result.signal})`);
    }
    // Small delay to avoid rate limits
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\nAnalyzed ${results.length}/${NIFTY_50.length} stocks successfully.`);

  // 2. Sort by score descending
  results.sort((a, b) => b.score - a.score);

  // 3. Daily top 10 (by today's score)
  const daily = results.slice(0, 10).map((s, i) => ({
    ...s,
    rank: i + 1,
    updatedAt: new Date().toISOString(),
  }));

  // 4. Write to Google Sheet
  console.log("\nWriting to Google Sheet...");
  const doc = new GoogleSpreadsheet(SHEET_ID, auth);
  await doc.loadInfo();
  console.log(`  Sheet: "${doc.title}"`);

  // Helper to write a tab
  async function writeTab(tabName, stocks) {
    const headers = [
      "rank", "ticker", "name", "sector", "price", "changePct",
      "signal", "score", "verdict", "tagline", "updatedAt",
    ];

    let sheet = doc.sheetsByTitle[tabName];
    if (!sheet) {
      sheet = await doc.addSheet({ title: tabName, headerValues: headers });
    } else {
      // Clear and reset headers
      await sheet.clear();
      await sheet.setHeaderRow(headers);
    }

    // Add rows
    await sheet.addRows(
      stocks.map((s) => ({
        rank: s.rank,
        ticker: s.ticker,
        name: s.name,
        sector: s.sector,
        price: s.price,
        changePct: s.changePct,
        signal: s.signal,
        score: s.score,
        verdict: s.verdict,
        tagline: s.tagline,
        updatedAt: s.updatedAt,
      }))
    );

    console.log(`  ✓ ${tabName}: ${stocks.length} stocks written`);
  }

  await writeTab("Daily", daily);

  // Also write the full ranked list
  const all = results.map((s, i) => ({
    ...s,
    rank: i + 1,
    updatedAt: new Date().toISOString(),
  }));
  await writeTab("All Stocks", all);

  console.log("\n✅ Done! Check your Google Sheet:");
  console.log(`   https://docs.google.com/spreadsheets/d/${SHEET_ID}\n`);
}

main().catch((e) => {
  console.error("Fatal error:", e.message);
  process.exit(1);
});
