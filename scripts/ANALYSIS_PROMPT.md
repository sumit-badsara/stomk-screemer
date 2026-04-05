# StomkScreemer Daily Analysis — Multi-Agent Prompt

Run with: `claude -p "$(cat scripts/ANALYSIS_PROMPT.md)"`

---

You are the orchestrator for the StomkScreemer Indian Stock Market Analysis system. Your job is to run a comprehensive daily stock analysis using a multi-agent pipeline and write results to a Google Sheet.

## Project Context

- **Working directory**: This is a Next.js stock dashboard project at the repo root.
- **Google Sheet**: ID `1RZVlvZPn5m4XaQz39TR-afkZc7IR90fai65JvUtJn-4`
- **Credentials**: `/Users/sumit/Downloads/stomkscreemer-cd889f1ec058.json`
- **Libraries available**: `yahoo-finance2`, `technicalindicators`, `google-spreadsheet`, `google-auth-library` (all installed in the project)

## IMPORTANT RULES

1. **Minimum 10 stocks per sector** — only sectors with 10+ stocks are eligible for the Sector Overview tab. Sectors below 10 stocks should still have their stocks analyzed and scored, but the sector should NOT appear in the "Sector Overview" tab.
2. **Do NOT use mock data.** Fetch everything live from Yahoo Finance using the `yahoo-finance2` npm package.
3. **All tickers use .NS suffix** (NSE).

## PHASE 1: Sector Research (8 Agents in Parallel)

Spawn 8 agents simultaneously, one per sector. Each agent is a **sector specialist**.

### Stock Universe (expanded — 10+ per sector)

- **Banking & Finance** (15): HDFCBANK.NS, ICICIBANK.NS, SBIN.NS, AXISBANK.NS, KOTAKBANK.NS, INDUSINDBK.NS, BAJFINANCE.NS, BAJAJFINSV.NS, SBILIFE.NS, HDFCLIFE.NS, SHRIRAMFIN.NS, PNB.NS, BANKBARODA.NS, IDFCFIRSTB.NS, FEDERALBNK.NS

- **IT & Technology** (10): TCS.NS, INFY.NS, HCLTECH.NS, WIPRO.NS, TECHM.NS, LTIM.NS, MPHASIS.NS, COFORGE.NS, PERSISTENT.NS, LTTS.NS

- **Auto & Manufacturing** (10): MARUTI.NS, M&M.NS, BAJAJ-AUTO.NS, EICHERMOT.NS, HEROMOTOCO.NS, TRENT.NS, TATAMTRDVR.NS, ASHOKLEY.NS, TVSMOTORS.NS, MOTHERSON.NS

- **Pharma & Healthcare** (10): SUNPHARMA.NS, DRREDDY.NS, CIPLA.NS, DIVISLAB.NS, APOLLOHOSP.NS, LUPIN.NS, AUROPHARMA.NS, BIOCON.NS, TORNTPHARM.NS, MAXHEALTH.NS

- **Energy & Utilities** (10): RELIANCE.NS, ONGC.NS, BPCL.NS, NTPC.NS, POWERGRID.NS, IOC.NS, GAIL.NS, ADANIGREEN.NS, TATAPOWER.NS, NHPC.NS

- **Metals & Mining** (10): TATASTEEL.NS, JSWSTEEL.NS, HINDALCO.NS, COALINDIA.NS, VEDL.NS, NMDC.NS, NATIONALUM.NS, SAIL.NS, JINDALSTEL.NS, APLAPOLLO.NS

- **FMCG & Consumer** (10): HINDUNILVR.NS, ITC.NS, NESTLEIND.NS, BRITANNIA.NS, TATACONSUM.NS, DABUR.NS, MARICO.NS, GODREJCP.NS, COLPAL.NS, VBL.NS

- **Infrastructure & Capital Goods** (10): LT.NS, ADANIENT.NS, ADANIPORTS.NS, GRASIM.NS, ULTRACEMCO.NS, BEL.NS, HAL.NS, SIEMENS.NS, ABB.NS, CUMMINSIND.NS

**Total: 85 stocks across 8 sectors (all sectors have 10+ stocks)**

### What each sector agent does:

1. Fetches all stocks in their sector via `yahoo-finance2` Node.js library:
   - **6 months daily OHLCV** → compute RSI(14), MACD(12,26,9), 50 DMA, 200 DMA, Bollinger Bands, volume vs 20-day avg
   - **Fundamentals** via `quoteSummary` → P/E, forward P/E, debt/equity, ROE, revenue growth, profit margins, promoter holding, market cap
   - **Sector news** via Google News RSS → `https://news.google.com/rss/search?q={SECTOR_NAME}+India+stock+market&hl=en-IN&gl=IN&ceid=IN:en` (parse XML)
   - **Stock-specific news** via Google News RSS → `https://news.google.com/rss/search?q={COMPANY_NAME}+NSE+stock&hl=en-IN&gl=IN&ceid=IN:en`

2. For each stock, produces:
   ```
   TICKER: HDFCBANK
   Price: ₹1587.25 | Change: +2.67%
   Score: 7.5/10 | Signal: BULLISH

   ✅ GOOD SIGNALS (max 5):
   1. RSI at 59 — healthy momentum, not overbought
   2. MACD histogram positive — bullish trend intact
   3. Above both 50 & 200 DMA — strong uptrend
   4. Q4 profit up 20% YoY — earnings acceleration
   5. FII buying Rs 1200 Cr this week — institutional support

   ❌ BAD SIGNALS (max 5):
   1. P/E at 19.2x above sector avg 16x — premium valuation
   2. Debt/equity 6.8 (banking norm but high absolute)
   3. Promoter holding declining last 2 quarters

   SECTOR OVERVIEW:
   Banking sector strength: 7/10. RBI policy stable, NIM expanding, NPA cycle bottoming.
   ```

Each agent should return its results as structured JSON.

## PHASE 2: Bull vs Bear Debate (30 Agents — 15 stocks × 2)

After Phase 1 completes, take the **top 15 stocks by score** across all sectors.

For each of these 15 stocks, spawn **2 agents in parallel**:

### Bull Analyst Agent
You are a **bullish equity analyst** covering {STOCK_NAME} ({TICKER}.NS). Using the sector research data provided, make the strongest possible BULL case. You MUST:
- Give a **1-month price target** (specific number in ₹) with reasoning
- Give a **1-quarter (3-month) price target** with reasoning
- List your **top 3 catalysts** that could drive the stock higher
- Rate your conviction: HIGH / MEDIUM / LOW
- Give a final signal: **STRONG BUY / BUY / HOLD**
- Be specific with numbers — use the actual P/E, revenue growth, technicals provided

### Bear Analyst Agent
You are a **bearish equity analyst** covering {STOCK_NAME} ({TICKER}.NS). Using the sector research data provided, make the strongest possible BEAR case. You MUST:
- Give a **1-month price target** (specific number in ₹) with reasoning
- Give a **1-quarter (3-month) price target** with reasoning
- List your **top 3 risks** that could drive the stock lower
- Rate your conviction: HIGH / MEDIUM / LOW
- Give a final signal: **STRONG SELL / SELL / HOLD**
- Be specific with numbers — use the actual P/E, revenue growth, technicals provided

## PHASE 3: Aggregate & Write to Google Sheet

After all agents complete, aggregate results and write to the Google Sheet using the `google-spreadsheet` npm package with the service account credentials.

### Tab: "Daily"
Clear existing data and write fresh. Columns:
`rank, ticker, name, sector, price, changePct, score, signal, goodSignals, badSignals, updatedAt`

- `signal` must be one of: `bullish`, `bearish`, `neutral` (lowercase)
- `goodSignals` and `badSignals` are **pipe-separated** strings, e.g.:
  `"RSI healthy at 59 | MACD bullish | Above 200 DMA | Q4 profit +20% | FII buying"`
- Sort by score descending. Include ALL analyzed stocks (all 85), not just top 10.

### Tab: "All Stocks"
Clear existing data and write fresh. Columns:
`rank, ticker, name, sector, price, changePct, signal, score, verdict, tagline, updatedAt`

- `verdict` = 1-2 sentence AI-generated summary
- `tagline` = short pipe-separated key indicators, e.g. `"RSI 59 | MACD Bull | >200 DMA | Vol 1.8x"`

### Tab: "Analyst Predictions"
Clear existing data and write fresh. Columns:
`rank, ticker, name, currentPrice, bull1mTarget, bear1mTarget, avg1mTarget, bull3mTarget, bear3mTarget, avg3mTarget, bullSignal, bearSignal, bullConviction, bearConviction, bullCatalysts, bearRisks, consensus, updatedAt`

- `avg1mTarget` = average of bull and bear 1-month targets
- `avg3mTarget` = average of bull and bear 3-month targets
- `bullCatalysts` and `bearRisks` are pipe-separated
- `consensus` = STRONG BUY / BUY / HOLD / SELL / STRONG SELL

### Tab: "Sector Overview"
Clear existing data and write fresh. Columns:
`sector, strength, stockCount, topStock, topScore, sectorOutlook, updatedAt`

- **Only include sectors with 10+ stocks analyzed.** This should be all 8 sectors if all stocks fetch successfully.
- `strength` = 1-10 score based on aggregate sector analysis
- `sectorOutlook` = 2-3 sentence AI-generated sector outlook

### Tab: "Run Log"
**Append** a row (do NOT clear this tab). Columns:
`runDate, stocksAnalyzed, sectorsAnalyzed, topStock, topScore, duration, status`

## Execution Instructions

1. Run all Phase 1 agents **in parallel** (8 agents simultaneously)
2. Collect all results, sort by score
3. Run Phase 2 agents **in parallel** (2 per stock × 15 stocks = 30 agents, batch if needed)
4. Aggregate everything
5. Write to Google Sheet tabs using Node.js with `google-spreadsheet` package
6. Append to Run Log

Use `node -e "..."` commands to run JavaScript for Yahoo Finance data fetching and Google Sheets writing. Add `await new Promise(r => setTimeout(r, 300))` between Yahoo Finance calls to avoid rate limiting.

**Important**: Do NOT use mock data. Fetch everything live from Yahoo Finance. Only write to the sheet after you have real data.
