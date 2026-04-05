export type Signal = {
  date: string;
  text: string;
};

export type NewsItem = {
  title: string;
  source: string;
  time: string;
  sentiment: "bullish" | "bearish" | "neutral";
};

export type Stock = {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePct: number;
  signal: "bullish" | "bearish" | "neutral";
  score: number;
  tagline: string;
  verdict: string;
  technicals: {
    rsi: number;
    macd: "Bullish" | "Bearish" | "Neutral";
    dma50: "Above" | "Below";
    dma200: "Above" | "Below";
    volumeVsAvg: number;
    supertrend: "Buy" | "Sell";
    bollingerBand: "Upper" | "Middle" | "Lower";
  };
  fundamentals: {
    pe: number;
    debtToEquity: number;
    marketCap: string;
    promoterHolding: number;
    qoqRevenue: number;
    roe: number;
    sectorPE: number;
  };
  news: NewsItem[];
  signals: Signal[];
};

export type StockData = {
  daily: Stock[];
  weekly: Stock[];
  monthly: Stock[];
};

export const mockData: StockData = {
  daily: [
    {
      ticker: "TATAMOTORS",
      name: "Tata Motors",
      sector: "Auto",
      price: 847.3,
      change: 34.1,
      changePct: 4.2,
      signal: "bullish",
      score: 8.2,
      tagline: "RSI 62 | Vol Spike | MACD Cross",
      verdict:
        "Strong breakout above 200 DMA with volume confirmation. MACD just turned bullish. Momentum building with sector tailwinds from EV push.",
      technicals: {
        rsi: 62,
        macd: "Bullish",
        dma50: "Above",
        dma200: "Above",
        volumeVsAvg: 2.3,
        supertrend: "Buy",
        bollingerBand: "Upper",
      },
      fundamentals: {
        pe: 8.4,
        debtToEquity: 0.9,
        marketCap: "3.1L Cr",
        promoterHolding: 46.4,
        qoqRevenue: 12,
        roe: 21,
        sectorPE: 12,
      },
      news: [
        {
          title: "Tata Motors EV sales surge 40% in Q4",
          source: "Economic Times",
          time: "2 hrs ago",
          sentiment: "bullish",
        },
        {
          title: "Auto sector faces headwinds from steel prices",
          source: "LiveMint",
          time: "5 hrs ago",
          sentiment: "neutral",
        },
        {
          title: "Tata Motors to invest 15K Cr in new EV plant",
          source: "MoneyControl",
          time: "1 day ago",
          sentiment: "bullish",
        },
      ],
      signals: [
        { date: "Apr 5", text: "MACD bullish crossover" },
        { date: "Apr 3", text: "Crossed above 200 DMA" },
        { date: "Apr 1", text: "Volume spike (2.3x avg)" },
        { date: "Mar 28", text: "RSI bounced from oversold (32 -> 62)" },
      ],
    },
    {
      ticker: "INFY",
      name: "Infosys",
      sector: "IT",
      price: 1623.5,
      change: 59.2,
      changePct: 3.8,
      signal: "bullish",
      score: 7.8,
      tagline: "MACD Cross | Breakout | Strong Q4",
      verdict:
        "Clean breakout from consolidation zone. IT sector seeing renewed FII interest. Q4 guidance beat expectations.",
      technicals: {
        rsi: 58,
        macd: "Bullish",
        dma50: "Above",
        dma200: "Above",
        volumeVsAvg: 1.8,
        supertrend: "Buy",
        bollingerBand: "Upper",
      },
      fundamentals: {
        pe: 24.2,
        debtToEquity: 0.1,
        marketCap: "6.7L Cr",
        promoterHolding: 31.2,
        qoqRevenue: 8,
        roe: 31,
        sectorPE: 28,
      },
      news: [
        {
          title: "Infosys wins $2B deal from European bank",
          source: "Economic Times",
          time: "3 hrs ago",
          sentiment: "bullish",
        },
        {
          title: "IT sector rally: Is it sustainable?",
          source: "CNBC TV18",
          time: "6 hrs ago",
          sentiment: "neutral",
        },
      ],
      signals: [
        { date: "Apr 5", text: "Breakout above 1600 resistance" },
        { date: "Apr 4", text: "MACD bullish crossover" },
        { date: "Apr 2", text: "FII buying detected" },
      ],
    },
    {
      ticker: "RELIANCE",
      name: "Reliance Industries",
      sector: "Energy",
      price: 2412.0,
      change: 49.6,
      changePct: 2.1,
      signal: "neutral",
      score: 6.5,
      tagline: "Above 200 DMA | Mixed Signals",
      verdict:
        "Holding above key support levels but lacking momentum. Jio listing buzz keeps sentiment positive. Wait for volume confirmation.",
      technicals: {
        rsi: 52,
        macd: "Neutral",
        dma50: "Above",
        dma200: "Above",
        volumeVsAvg: 1.1,
        supertrend: "Buy",
        bollingerBand: "Middle",
      },
      fundamentals: {
        pe: 26.8,
        debtToEquity: 0.4,
        marketCap: "16.3L Cr",
        promoterHolding: 50.3,
        qoqRevenue: 5,
        roe: 14,
        sectorPE: 18,
      },
      news: [
        {
          title: "Jio IPO timeline could be announced in Q2",
          source: "MoneyControl",
          time: "1 hr ago",
          sentiment: "bullish",
        },
        {
          title: "Reliance retail expansion slows in tier-2 cities",
          source: "LiveMint",
          time: "8 hrs ago",
          sentiment: "bearish",
        },
      ],
      signals: [
        { date: "Apr 4", text: "Holding 200 DMA support" },
        { date: "Apr 1", text: "MACD flattening near zero line" },
      ],
    },
    {
      ticker: "HDFCBANK",
      name: "HDFC Bank",
      sector: "Banking",
      price: 1587.25,
      change: 41.3,
      changePct: 2.67,
      signal: "bullish",
      score: 7.5,
      tagline: "FII Buying | NIM Expansion",
      verdict:
        "FII flows returning to banking. NIM improvement story intact. Strong loan growth and stable asset quality make this a core holding.",
      technicals: {
        rsi: 59,
        macd: "Bullish",
        dma50: "Above",
        dma200: "Above",
        volumeVsAvg: 1.5,
        supertrend: "Buy",
        bollingerBand: "Upper",
      },
      fundamentals: {
        pe: 19.2,
        debtToEquity: 6.8,
        marketCap: "12.1L Cr",
        promoterHolding: 26.1,
        qoqRevenue: 15,
        roe: 17,
        sectorPE: 16,
      },
      news: [
        {
          title: "HDFC Bank Q4 profit rises 20% YoY",
          source: "Economic Times",
          time: "4 hrs ago",
          sentiment: "bullish",
        },
        {
          title: "RBI policy rate unchanged, positive for banks",
          source: "Reuters",
          time: "1 day ago",
          sentiment: "bullish",
        },
      ],
      signals: [
        { date: "Apr 5", text: "52-week high breakout attempt" },
        { date: "Apr 3", text: "FII net buying Rs 1200 Cr" },
        { date: "Apr 1", text: "Golden cross (50 DMA > 200 DMA)" },
      ],
    },
    {
      ticker: "BHARTIARTL",
      name: "Bharti Airtel",
      sector: "Telecom",
      price: 1345.8,
      change: 28.7,
      changePct: 2.18,
      signal: "bullish",
      score: 7.2,
      tagline: "Tariff Hike | ARPU Growth",
      verdict:
        "Tariff hike cycle beneficiary. ARPU growth trajectory strong. 5G capex peaking, free cash flow should improve in coming quarters.",
      technicals: {
        rsi: 55,
        macd: "Bullish",
        dma50: "Above",
        dma200: "Above",
        volumeVsAvg: 1.3,
        supertrend: "Buy",
        bollingerBand: "Middle",
      },
      fundamentals: {
        pe: 72.5,
        debtToEquity: 2.1,
        marketCap: "7.8L Cr",
        promoterHolding: 52.0,
        qoqRevenue: 9,
        roe: 12,
        sectorPE: 65,
      },
      news: [
        {
          title: "Airtel 5G reaches 500 cities milestone",
          source: "NDTV",
          time: "6 hrs ago",
          sentiment: "bullish",
        },
      ],
      signals: [
        { date: "Apr 4", text: "RSI trending up from 45 to 55" },
        { date: "Apr 2", text: "Steady accumulation pattern" },
      ],
    },
    {
      ticker: "SBIN",
      name: "State Bank of India",
      sector: "Banking",
      price: 762.4,
      change: -18.5,
      changePct: -2.37,
      signal: "bearish",
      score: 4.1,
      tagline: "NPA Concerns | Below 50 DMA",
      verdict:
        "Slipped below 50 DMA on NPA worries. PSU bank selling pressure continues. Wait for stabilization near 740 support before entry.",
      technicals: {
        rsi: 38,
        macd: "Bearish",
        dma50: "Below",
        dma200: "Above",
        volumeVsAvg: 1.9,
        supertrend: "Sell",
        bollingerBand: "Lower",
      },
      fundamentals: {
        pe: 9.8,
        debtToEquity: 12.5,
        marketCap: "6.8L Cr",
        promoterHolding: 57.5,
        qoqRevenue: 3,
        roe: 18,
        sectorPE: 16,
      },
      news: [
        {
          title: "SBI farm loan NPAs rise in rural belt",
          source: "Business Standard",
          time: "2 hrs ago",
          sentiment: "bearish",
        },
        {
          title: "PSU banks underperform Nifty Bank by 3%",
          source: "MoneyControl",
          time: "5 hrs ago",
          sentiment: "bearish",
        },
      ],
      signals: [
        { date: "Apr 5", text: "Broke below 50 DMA" },
        { date: "Apr 4", text: "MACD bearish crossover" },
        { date: "Apr 3", text: "Rising volume on decline" },
      ],
    },
    {
      ticker: "SUNPHARMA",
      name: "Sun Pharma",
      sector: "Pharma",
      price: 1189.6,
      change: 22.4,
      changePct: 1.92,
      signal: "bullish",
      score: 6.9,
      tagline: "Specialty Ramp | FDA Clearance",
      verdict:
        "Specialty portfolio ramping up in US market. FDA clearance for key drug removes overhang. Steady compounder with improving margins.",
      technicals: {
        rsi: 56,
        macd: "Bullish",
        dma50: "Above",
        dma200: "Above",
        volumeVsAvg: 1.2,
        supertrend: "Buy",
        bollingerBand: "Middle",
      },
      fundamentals: {
        pe: 34.5,
        debtToEquity: 0.2,
        marketCap: "2.9L Cr",
        promoterHolding: 54.5,
        qoqRevenue: 11,
        roe: 16,
        sectorPE: 30,
      },
      news: [
        {
          title: "Sun Pharma gets FDA nod for psoriasis drug",
          source: "Economic Times",
          time: "3 hrs ago",
          sentiment: "bullish",
        },
      ],
      signals: [
        { date: "Apr 5", text: "Breakout from 1170 resistance" },
        { date: "Apr 3", text: "Sector rotation into pharma" },
      ],
    },
    {
      ticker: "LT",
      name: "Larsen & Toubro",
      sector: "Infra",
      price: 3245.0,
      change: -52.3,
      changePct: -1.59,
      signal: "neutral",
      score: 5.5,
      tagline: "Order Book Strong | Profit Booking",
      verdict:
        "Profit booking after strong run. Order book at all-time high but margin concerns linger. Infra spending theme intact for medium term.",
      technicals: {
        rsi: 48,
        macd: "Neutral",
        dma50: "Below",
        dma200: "Above",
        volumeVsAvg: 1.0,
        supertrend: "Buy",
        bollingerBand: "Middle",
      },
      fundamentals: {
        pe: 32.1,
        debtToEquity: 1.5,
        marketCap: "4.5L Cr",
        promoterHolding: 0,
        qoqRevenue: 18,
        roe: 15,
        sectorPE: 28,
      },
      news: [
        {
          title: "L&T wins Rs 8000 Cr order from Saudi Arabia",
          source: "CNBC TV18",
          time: "1 hr ago",
          sentiment: "bullish",
        },
        {
          title: "Infra stocks see profit booking after rally",
          source: "LiveMint",
          time: "4 hrs ago",
          sentiment: "bearish",
        },
      ],
      signals: [
        { date: "Apr 5", text: "Profit booking near resistance" },
        { date: "Apr 2", text: "Slipped below 50 DMA" },
      ],
    },
    {
      ticker: "WIPRO",
      name: "Wipro",
      sector: "IT",
      price: 487.3,
      change: -14.6,
      changePct: -2.91,
      signal: "bearish",
      score: 3.8,
      tagline: "Guidance Cut | Below 200 DMA",
      verdict:
        "Weak Q4 guidance dragged stock below 200 DMA. Attrition concerns persist. Avoid until management commentary improves.",
      technicals: {
        rsi: 34,
        macd: "Bearish",
        dma50: "Below",
        dma200: "Below",
        volumeVsAvg: 2.1,
        supertrend: "Sell",
        bollingerBand: "Lower",
      },
      fundamentals: {
        pe: 21.3,
        debtToEquity: 0.2,
        marketCap: "2.5L Cr",
        promoterHolding: 72.9,
        qoqRevenue: -2,
        roe: 16,
        sectorPE: 28,
      },
      news: [
        {
          title: "Wipro cuts FY27 revenue guidance by 2%",
          source: "Economic Times",
          time: "1 hr ago",
          sentiment: "bearish",
        },
        {
          title: "IT mid-caps outperform large-caps in Q1",
          source: "MoneyControl",
          time: "3 hrs ago",
          sentiment: "neutral",
        },
      ],
      signals: [
        { date: "Apr 5", text: "Broke below 200 DMA on high volume" },
        { date: "Apr 4", text: "Death cross forming (50 DMA nearing 200 DMA)" },
        { date: "Apr 3", text: "RSI entered oversold zone" },
      ],
    },
    {
      ticker: "MARUTI",
      name: "Maruti Suzuki",
      sector: "Auto",
      price: 11842.0,
      change: 185.0,
      changePct: 1.59,
      signal: "bullish",
      score: 7.0,
      tagline: "SUV Mix | Margin Expansion",
      verdict:
        "SUV portfolio mix improving margins. Rural recovery aiding volume growth. Valuations reasonable at current levels for a steady compounder.",
      technicals: {
        rsi: 57,
        macd: "Bullish",
        dma50: "Above",
        dma200: "Above",
        volumeVsAvg: 1.1,
        supertrend: "Buy",
        bollingerBand: "Middle",
      },
      fundamentals: {
        pe: 27.5,
        debtToEquity: 0.0,
        marketCap: "3.7L Cr",
        promoterHolding: 56.4,
        qoqRevenue: 14,
        roe: 18,
        sectorPE: 12,
      },
      news: [
        {
          title: "Maruti March sales up 12% led by SUV segment",
          source: "Autocar India",
          time: "5 hrs ago",
          sentiment: "bullish",
        },
      ],
      signals: [
        { date: "Apr 4", text: "Holding above 11700 support" },
        { date: "Apr 1", text: "Volume picking up on advances" },
      ],
    },
  ],
  weekly: [
    {
      ticker: "BAJFINANCE",
      name: "Bajaj Finance",
      sector: "NBFC",
      price: 7245.0,
      change: 542.0,
      changePct: 8.09,
      signal: "bullish",
      score: 8.8,
      tagline: "AUM Growth | NIM Beat | Breakout",
      verdict:
        "Weekly breakout from 3-month consolidation. AUM growth accelerating and NIM expanded 20bps. Best-in-class NBFC with improving asset quality.",
      technicals: {
        rsi: 68,
        macd: "Bullish",
        dma50: "Above",
        dma200: "Above",
        volumeVsAvg: 2.8,
        supertrend: "Buy",
        bollingerBand: "Upper",
      },
      fundamentals: {
        pe: 33.5,
        debtToEquity: 3.2,
        marketCap: "4.5L Cr",
        promoterHolding: 55.0,
        qoqRevenue: 22,
        roe: 24,
        sectorPE: 25,
      },
      news: [
        {
          title: "Bajaj Finance AUM crosses Rs 3L Cr milestone",
          source: "MoneyControl",
          time: "2 days ago",
          sentiment: "bullish",
        },
        {
          title: "NBFCs see strong demand in rural micro-loans",
          source: "Economic Times",
          time: "3 days ago",
          sentiment: "bullish",
        },
      ],
      signals: [
        { date: "Apr 5", text: "Weekly breakout above 7000 resistance" },
        { date: "Apr 3", text: "RSI crossed 60 with momentum" },
        { date: "Apr 1", text: "Massive volume spike on breakout day" },
        { date: "Mar 30", text: "Golden cross on weekly chart" },
      ],
    },
    {
      ticker: "ADANIENT",
      name: "Adani Enterprises",
      sector: "Conglomerate",
      price: 2890.0,
      change: 312.0,
      changePct: 12.1,
      signal: "bullish",
      score: 7.4,
      tagline: "Airport Revenue | Green Energy Push",
      verdict:
        "Strong weekly momentum driven by airport revenue beat and green hydrogen announcement. High beta play with improving fundamentals.",
      technicals: {
        rsi: 71,
        macd: "Bullish",
        dma50: "Above",
        dma200: "Above",
        volumeVsAvg: 3.1,
        supertrend: "Buy",
        bollingerBand: "Upper",
      },
      fundamentals: {
        pe: 68.2,
        debtToEquity: 1.8,
        marketCap: "3.3L Cr",
        promoterHolding: 72.6,
        qoqRevenue: 28,
        roe: 10,
        sectorPE: 45,
      },
      news: [
        {
          title: "Adani airports handle record 10M passengers in March",
          source: "Business Standard",
          time: "1 day ago",
          sentiment: "bullish",
        },
        {
          title: "Adani Green signs 5GW solar deal with TotalEnergies",
          source: "Reuters",
          time: "3 days ago",
          sentiment: "bullish",
        },
      ],
      signals: [
        { date: "Apr 5", text: "RSI above 70 — overbought but trending" },
        { date: "Apr 2", text: "Weekly close above key 2750 level" },
        { date: "Mar 31", text: "Volume 3x weekly average" },
      ],
    },
    {
      ticker: "ICICIBANK",
      name: "ICICI Bank",
      sector: "Banking",
      price: 1098.0,
      change: 67.0,
      changePct: 6.5,
      signal: "bullish",
      score: 8.0,
      tagline: "Asset Quality | ROA Best-in-Class",
      verdict:
        "Consistently best-in-class ROA among large banks. Asset quality continues to surprise positively. Weekly chart shows clean uptrend.",
      technicals: {
        rsi: 63,
        macd: "Bullish",
        dma50: "Above",
        dma200: "Above",
        volumeVsAvg: 1.6,
        supertrend: "Buy",
        bollingerBand: "Upper",
      },
      fundamentals: {
        pe: 18.5,
        debtToEquity: 6.2,
        marketCap: "7.7L Cr",
        promoterHolding: 0,
        qoqRevenue: 16,
        roe: 18,
        sectorPE: 16,
      },
      news: [
        {
          title: "ICICI Bank NPA ratio drops to decade low",
          source: "CNBC TV18",
          time: "2 days ago",
          sentiment: "bullish",
        },
      ],
      signals: [
        { date: "Apr 5", text: "New 52-week high at 1098" },
        { date: "Apr 3", text: "Weekly MACD histogram expanding" },
        { date: "Mar 31", text: "All-time high volume week" },
      ],
    },
    {
      ticker: "TRENT",
      name: "Trent Ltd",
      sector: "Retail",
      price: 5420.0,
      change: 380.0,
      changePct: 7.54,
      signal: "bullish",
      score: 7.9,
      tagline: "Zudio Expansion | SSSG 18%",
      verdict:
        "Zudio store count acceleration driving revenue. Same-store sales growth at 18% is exceptional. Premium valuation but growth justifies it.",
      technicals: {
        rsi: 66,
        macd: "Bullish",
        dma50: "Above",
        dma200: "Above",
        volumeVsAvg: 2.0,
        supertrend: "Buy",
        bollingerBand: "Upper",
      },
      fundamentals: {
        pe: 95.0,
        debtToEquity: 0.3,
        marketCap: "1.9L Cr",
        promoterHolding: 37.0,
        qoqRevenue: 45,
        roe: 22,
        sectorPE: 60,
      },
      news: [
        {
          title: "Trent opens 50 new Zudio stores in Q4",
          source: "Economic Times",
          time: "1 day ago",
          sentiment: "bullish",
        },
      ],
      signals: [
        { date: "Apr 4", text: "Weekly breakout above 5200" },
        { date: "Apr 1", text: "Institutional buying pattern detected" },
      ],
    },
    {
      ticker: "JSWSTEEL",
      name: "JSW Steel",
      sector: "Metals",
      price: 845.0,
      change: -62.0,
      changePct: -6.83,
      signal: "bearish",
      score: 3.5,
      tagline: "China Dumping | Margin Squeeze",
      verdict:
        "Steel prices under pressure from Chinese dumping. Margin squeeze likely in Q1. Avoid metals until global demand stabilizes.",
      technicals: {
        rsi: 32,
        macd: "Bearish",
        dma50: "Below",
        dma200: "Below",
        volumeVsAvg: 2.4,
        supertrend: "Sell",
        bollingerBand: "Lower",
      },
      fundamentals: {
        pe: 18.0,
        debtToEquity: 1.2,
        marketCap: "2.1L Cr",
        promoterHolding: 44.8,
        qoqRevenue: -8,
        roe: 11,
        sectorPE: 15,
      },
      news: [
        {
          title: "India considers anti-dumping duty on Chinese steel",
          source: "Reuters",
          time: "1 day ago",
          sentiment: "neutral",
        },
        {
          title: "JSW Steel EBITDA margin may drop to 15% in Q1",
          source: "ICICI Direct",
          time: "2 days ago",
          sentiment: "bearish",
        },
      ],
      signals: [
        { date: "Apr 5", text: "Broke below 200 DMA" },
        { date: "Apr 3", text: "Death cross confirmed on weekly" },
        { date: "Mar 31", text: "Sector-wide selling pressure" },
      ],
    },
    {
      ticker: "COALINDIA",
      name: "Coal India",
      sector: "Mining",
      price: 412.0,
      change: 28.5,
      changePct: 7.42,
      signal: "bullish",
      score: 6.8,
      tagline: "Dividend Yield | Volume Growth",
      verdict:
        "Production volumes hitting targets. 7%+ dividend yield makes it defensive. Government divestment overhang but value play at these levels.",
      technicals: {
        rsi: 58,
        macd: "Bullish",
        dma50: "Above",
        dma200: "Above",
        volumeVsAvg: 1.4,
        supertrend: "Buy",
        bollingerBand: "Middle",
      },
      fundamentals: {
        pe: 7.2,
        debtToEquity: 0.1,
        marketCap: "2.5L Cr",
        promoterHolding: 63.1,
        qoqRevenue: 6,
        roe: 52,
        sectorPE: 10,
      },
      news: [
        {
          title: "Coal India announces Rs 25/share interim dividend",
          source: "MoneyControl",
          time: "2 days ago",
          sentiment: "bullish",
        },
      ],
      signals: [
        { date: "Apr 4", text: "Bounced from 50 DMA support" },
        { date: "Apr 1", text: "Dividend announcement catalyst" },
      ],
    },
    {
      ticker: "TITAN",
      name: "Titan Company",
      sector: "Consumer",
      price: 3380.0,
      change: 195.0,
      changePct: 6.12,
      signal: "bullish",
      score: 7.3,
      tagline: "Jewellery Demand | Wedding Season",
      verdict:
        "Wedding season driving jewellery demand. Tanishq store expansion on track. Premium consumer discretionary play with consistent execution.",
      technicals: {
        rsi: 61,
        macd: "Bullish",
        dma50: "Above",
        dma200: "Above",
        volumeVsAvg: 1.5,
        supertrend: "Buy",
        bollingerBand: "Upper",
      },
      fundamentals: {
        pe: 62.0,
        debtToEquity: 0.5,
        marketCap: "3.0L Cr",
        promoterHolding: 52.9,
        qoqRevenue: 20,
        roe: 25,
        sectorPE: 50,
      },
      news: [
        {
          title: "Titan Q4 jewellery revenue up 25%",
          source: "Economic Times",
          time: "3 days ago",
          sentiment: "bullish",
        },
      ],
      signals: [
        { date: "Apr 5", text: "Weekly close above 3300 for first time" },
        { date: "Apr 2", text: "Steady institutional accumulation" },
      ],
    },
    {
      ticker: "HINDALCO",
      name: "Hindalco",
      sector: "Metals",
      price: 542.0,
      change: -38.0,
      changePct: -6.55,
      signal: "bearish",
      score: 3.9,
      tagline: "Novelis Weakness | Aluminium Slump",
      verdict:
        "Novelis margins under pressure from weak US auto demand. Global aluminium prices declining. Wait for commodity cycle to turn.",
      technicals: {
        rsi: 35,
        macd: "Bearish",
        dma50: "Below",
        dma200: "Below",
        volumeVsAvg: 2.0,
        supertrend: "Sell",
        bollingerBand: "Lower",
      },
      fundamentals: {
        pe: 10.5,
        debtToEquity: 0.8,
        marketCap: "1.2L Cr",
        promoterHolding: 34.6,
        qoqRevenue: -5,
        roe: 13,
        sectorPE: 15,
      },
      news: [
        {
          title: "Aluminium prices hit 6-month low on China fears",
          source: "Bloomberg",
          time: "1 day ago",
          sentiment: "bearish",
        },
      ],
      signals: [
        { date: "Apr 5", text: "RSI in oversold territory at 35" },
        { date: "Apr 2", text: "Broke weekly support at 560" },
      ],
    },
    {
      ticker: "POWERGRID",
      name: "Power Grid Corp",
      sector: "Utilities",
      price: 298.0,
      change: 15.5,
      changePct: 5.49,
      signal: "bullish",
      score: 6.5,
      tagline: "Capex Cycle | Dividend Play",
      verdict:
        "Transmission capex cycle beneficiary. Regulated returns provide earnings visibility. Attractive dividend yield for conservative portfolios.",
      technicals: {
        rsi: 54,
        macd: "Bullish",
        dma50: "Above",
        dma200: "Above",
        volumeVsAvg: 1.2,
        supertrend: "Buy",
        bollingerBand: "Middle",
      },
      fundamentals: {
        pe: 14.2,
        debtToEquity: 2.8,
        marketCap: "2.8L Cr",
        promoterHolding: 51.3,
        qoqRevenue: 7,
        roe: 19,
        sectorPE: 18,
      },
      news: [
        {
          title: "Power Grid capex target raised to Rs 40K Cr for FY27",
          source: "Business Standard",
          time: "2 days ago",
          sentiment: "bullish",
        },
      ],
      signals: [
        { date: "Apr 4", text: "Steady uptrend on weekly timeframe" },
        { date: "Apr 1", text: "DII accumulation pattern visible" },
      ],
    },
    {
      ticker: "DMART",
      name: "Avenue Supermarts",
      sector: "Retail",
      price: 3965.0,
      change: -245.0,
      changePct: -5.82,
      signal: "bearish",
      score: 4.2,
      tagline: "Quick Commerce Threat | SSSG Dip",
      verdict:
        "Quick commerce (Blinkit, Zepto) eating into DMart's urban share. Same-store growth slowing. Premium valuation no longer justified.",
      technicals: {
        rsi: 37,
        macd: "Bearish",
        dma50: "Below",
        dma200: "Below",
        volumeVsAvg: 1.8,
        supertrend: "Sell",
        bollingerBand: "Lower",
      },
      fundamentals: {
        pe: 88.0,
        debtToEquity: 0.0,
        marketCap: "2.6L Cr",
        promoterHolding: 74.6,
        qoqRevenue: 2,
        roe: 14,
        sectorPE: 60,
      },
      news: [
        {
          title: "Blinkit hits $1B annualized GMV — threat to retail?",
          source: "TechCrunch",
          time: "2 days ago",
          sentiment: "bearish",
        },
        {
          title: "DMart SSSG falls to 8% from 14% YoY",
          source: "CNBC TV18",
          time: "4 days ago",
          sentiment: "bearish",
        },
      ],
      signals: [
        { date: "Apr 5", text: "Breakdown below key 4000 support" },
        { date: "Apr 3", text: "Institutional selling detected" },
        { date: "Mar 31", text: "Weekly MACD histogram turning negative" },
      ],
    },
  ],
  monthly: [
    {
      ticker: "ZOMATO",
      name: "Zomato",
      sector: "Internet",
      price: 218.5,
      change: 42.0,
      changePct: 23.78,
      signal: "bullish",
      score: 8.5,
      tagline: "Blinkit Hypergrowth | First Profit",
      verdict:
        "Blinkit driving hypergrowth with unit economics turning positive. First quarterly profit marks inflection point. Quick commerce leader with huge TAM.",
      technicals: {
        rsi: 72,
        macd: "Bullish",
        dma50: "Above",
        dma200: "Above",
        volumeVsAvg: 2.5,
        supertrend: "Buy",
        bollingerBand: "Upper",
      },
      fundamentals: {
        pe: 280.0,
        debtToEquity: 0.0,
        marketCap: "1.9L Cr",
        promoterHolding: 0,
        qoqRevenue: 68,
        roe: 3,
        sectorPE: 150,
      },
      news: [
        {
          title: "Blinkit dark store count crosses 1000",
          source: "Economic Times",
          time: "1 week ago",
          sentiment: "bullish",
        },
        {
          title: "Zomato posts first ever quarterly profit",
          source: "MoneyControl",
          time: "2 weeks ago",
          sentiment: "bullish",
        },
        {
          title: "Goldman upgrades Zomato to Buy with Rs 250 target",
          source: "Bloomberg",
          time: "3 weeks ago",
          sentiment: "bullish",
        },
      ],
      signals: [
        { date: "Apr 5", text: "Monthly RSI above 70 — strong trend" },
        { date: "Mar 25", text: "Broke all-time high at 210" },
        { date: "Mar 15", text: "Monthly MACD crossover" },
        { date: "Mar 1", text: "50 DMA crossed above 200 DMA on monthly" },
      ],
    },
    {
      ticker: "TATAMOTORS",
      name: "Tata Motors",
      sector: "Auto",
      price: 847.3,
      change: 156.0,
      changePct: 22.56,
      signal: "bullish",
      score: 8.4,
      tagline: "JLR Turnaround | EV Leader",
      verdict:
        "JLR turnaround delivering record margins. EV market share dominant in India. Monthly chart shows clean breakout from 2-year base.",
      technicals: {
        rsi: 69,
        macd: "Bullish",
        dma50: "Above",
        dma200: "Above",
        volumeVsAvg: 2.1,
        supertrend: "Buy",
        bollingerBand: "Upper",
      },
      fundamentals: {
        pe: 8.4,
        debtToEquity: 0.9,
        marketCap: "3.1L Cr",
        promoterHolding: 46.4,
        qoqRevenue: 12,
        roe: 21,
        sectorPE: 12,
      },
      news: [
        {
          title: "JLR Q4 EBITDA margin hits record 14%",
          source: "Reuters",
          time: "1 week ago",
          sentiment: "bullish",
        },
        {
          title: "Tata EV market share at 72% in March",
          source: "Autocar India",
          time: "2 weeks ago",
          sentiment: "bullish",
        },
      ],
      signals: [
        { date: "Apr 5", text: "Monthly close above 800 for first time" },
        { date: "Mar 20", text: "Monthly golden cross confirmed" },
        { date: "Mar 1", text: "Breakout from 2-year consolidation" },
      ],
    },
    {
      ticker: "BAJFINANCE",
      name: "Bajaj Finance",
      sector: "NBFC",
      price: 7245.0,
      change: 1120.0,
      changePct: 18.29,
      signal: "bullish",
      score: 8.6,
      tagline: "AUM 3L Cr | Fintech Integration",
      verdict:
        "AUM crossing 3L Cr with best-in-class asset quality. Digital lending platform scaling fast. Monthly chart shows multi-year breakout.",
      technicals: {
        rsi: 67,
        macd: "Bullish",
        dma50: "Above",
        dma200: "Above",
        volumeVsAvg: 2.0,
        supertrend: "Buy",
        bollingerBand: "Upper",
      },
      fundamentals: {
        pe: 33.5,
        debtToEquity: 3.2,
        marketCap: "4.5L Cr",
        promoterHolding: 55.0,
        qoqRevenue: 22,
        roe: 24,
        sectorPE: 25,
      },
      news: [
        {
          title: "Bajaj Finance crosses 80M customer milestone",
          source: "Economic Times",
          time: "2 weeks ago",
          sentiment: "bullish",
        },
      ],
      signals: [
        { date: "Apr 5", text: "Monthly breakout above 7000" },
        { date: "Mar 15", text: "Sustained volume above average for 4 weeks" },
      ],
    },
    {
      ticker: "HDFCBANK",
      name: "HDFC Bank",
      sector: "Banking",
      price: 1587.25,
      change: 187.0,
      changePct: 13.35,
      signal: "bullish",
      score: 8.1,
      tagline: "Merger Synergies | FII Comeback",
      verdict:
        "HDFC merger synergies finally reflecting in numbers. FII ownership climbing back. Monthly chart shows fresh all-time high breakout.",
      technicals: {
        rsi: 64,
        macd: "Bullish",
        dma50: "Above",
        dma200: "Above",
        volumeVsAvg: 1.8,
        supertrend: "Buy",
        bollingerBand: "Upper",
      },
      fundamentals: {
        pe: 19.2,
        debtToEquity: 6.8,
        marketCap: "12.1L Cr",
        promoterHolding: 26.1,
        qoqRevenue: 15,
        roe: 17,
        sectorPE: 16,
      },
      news: [
        {
          title: "HDFC Bank merger cost synergies exceed targets by 30%",
          source: "Business Standard",
          time: "10 days ago",
          sentiment: "bullish",
        },
      ],
      signals: [
        { date: "Apr 5", text: "Monthly close at all-time high" },
        { date: "Mar 20", text: "FII holding crosses 55% again" },
      ],
    },
    {
      ticker: "BHARTIARTL",
      name: "Bharti Airtel",
      sector: "Telecom",
      price: 1345.8,
      change: 168.0,
      changePct: 14.26,
      signal: "bullish",
      score: 7.6,
      tagline: "ARPU 230+ | 5G Monetization",
      verdict:
        "ARPU trajectory towards Rs 250 on track. 5G capex peaking enables FCF improvement. Monthly chart in clean uptrend since tariff hikes.",
      technicals: {
        rsi: 60,
        macd: "Bullish",
        dma50: "Above",
        dma200: "Above",
        volumeVsAvg: 1.4,
        supertrend: "Buy",
        bollingerBand: "Upper",
      },
      fundamentals: {
        pe: 72.5,
        debtToEquity: 2.1,
        marketCap: "7.8L Cr",
        promoterHolding: 52.0,
        qoqRevenue: 9,
        roe: 12,
        sectorPE: 65,
      },
      news: [
        {
          title: "Airtel ARPU crosses Rs 230 for first time",
          source: "CNBC TV18",
          time: "2 weeks ago",
          sentiment: "bullish",
        },
      ],
      signals: [
        { date: "Apr 3", text: "Monthly uptrend intact since Nov 2025" },
        { date: "Mar 10", text: "Steady DII accumulation" },
      ],
    },
    {
      ticker: "ITC",
      name: "ITC Ltd",
      sector: "FMCG",
      price: 468.0,
      change: 52.0,
      changePct: 12.5,
      signal: "bullish",
      score: 7.1,
      tagline: "Hotel Demerger | FMCG Margins",
      verdict:
        "Hotel demerger unlocking value. FMCG business margin expansion story gaining traction. High dividend yield provides downside cushion.",
      technicals: {
        rsi: 58,
        macd: "Bullish",
        dma50: "Above",
        dma200: "Above",
        volumeVsAvg: 1.3,
        supertrend: "Buy",
        bollingerBand: "Middle",
      },
      fundamentals: {
        pe: 25.5,
        debtToEquity: 0.0,
        marketCap: "5.8L Cr",
        promoterHolding: 0,
        qoqRevenue: 8,
        roe: 28,
        sectorPE: 35,
      },
      news: [
        {
          title: "ITC hotel demerger gets NCLT approval",
          source: "Economic Times",
          time: "1 week ago",
          sentiment: "bullish",
        },
        {
          title: "ITC FMCG EBITDA margin crosses 12% first time",
          source: "MoneyControl",
          time: "3 weeks ago",
          sentiment: "bullish",
        },
      ],
      signals: [
        { date: "Apr 4", text: "Monthly breakout above 460 resistance" },
        { date: "Mar 15", text: "Re-rating post hotel demerger clarity" },
      ],
    },
    {
      ticker: "PAYTM",
      name: "One97 Communications",
      sector: "Fintech",
      price: 645.0,
      change: -185.0,
      changePct: -22.29,
      signal: "bearish",
      score: 2.8,
      tagline: "RBI Action | UPI Share Drop",
      verdict:
        "RBI restrictions still weighing on lending business. UPI market share declining. Monthly chart in clear downtrend. No signs of reversal.",
      technicals: {
        rsi: 28,
        macd: "Bearish",
        dma50: "Below",
        dma200: "Below",
        volumeVsAvg: 2.8,
        supertrend: "Sell",
        bollingerBand: "Lower",
      },
      fundamentals: {
        pe: -45.0,
        debtToEquity: 0.0,
        marketCap: "0.4L Cr",
        promoterHolding: 9.1,
        qoqRevenue: -12,
        roe: -15,
        sectorPE: 150,
      },
      news: [
        {
          title: "Paytm UPI market share drops to 8% from 15%",
          source: "LiveMint",
          time: "1 week ago",
          sentiment: "bearish",
        },
        {
          title: "RBI extends restrictions on Paytm Payments Bank",
          source: "Reuters",
          time: "3 weeks ago",
          sentiment: "bearish",
        },
      ],
      signals: [
        { date: "Apr 5", text: "RSI at 28 — deeply oversold" },
        { date: "Mar 25", text: "Monthly death cross confirmed" },
        { date: "Mar 10", text: "Broke below 700 psychological support" },
      ],
    },
    {
      ticker: "TRENT",
      name: "Trent Ltd",
      sector: "Retail",
      price: 5420.0,
      change: 820.0,
      changePct: 17.83,
      signal: "bullish",
      score: 8.0,
      tagline: "Zudio 500 Stores | Revenue 2x",
      verdict:
        "Zudio hitting inflection point with 500 stores. Revenue nearly doubled YoY. Monthly chart parabolic but growth supports valuation.",
      technicals: {
        rsi: 70,
        macd: "Bullish",
        dma50: "Above",
        dma200: "Above",
        volumeVsAvg: 2.2,
        supertrend: "Buy",
        bollingerBand: "Upper",
      },
      fundamentals: {
        pe: 95.0,
        debtToEquity: 0.3,
        marketCap: "1.9L Cr",
        promoterHolding: 37.0,
        qoqRevenue: 45,
        roe: 22,
        sectorPE: 60,
      },
      news: [
        {
          title: "Trent revenue doubles to Rs 16K Cr in FY26",
          source: "Economic Times",
          time: "2 weeks ago",
          sentiment: "bullish",
        },
      ],
      signals: [
        { date: "Apr 5", text: "Monthly RSI at 70 — strong momentum" },
        { date: "Mar 20", text: "Continuous monthly higher highs since Sept" },
      ],
    },
    {
      ticker: "VEDL",
      name: "Vedanta Ltd",
      sector: "Metals",
      price: 312.0,
      change: -68.0,
      changePct: -17.89,
      signal: "bearish",
      score: 3.2,
      tagline: "Demerger Delay | Commodity Slump",
      verdict:
        "Demerger plan hitting regulatory roadblocks. Commodity prices in downcycle. High debt and volatile earnings. Monthly downtrend accelerating.",
      technicals: {
        rsi: 30,
        macd: "Bearish",
        dma50: "Below",
        dma200: "Below",
        volumeVsAvg: 2.5,
        supertrend: "Sell",
        bollingerBand: "Lower",
      },
      fundamentals: {
        pe: 12.0,
        debtToEquity: 2.5,
        marketCap: "1.2L Cr",
        promoterHolding: 56.4,
        qoqRevenue: -15,
        roe: 22,
        sectorPE: 15,
      },
      news: [
        {
          title: "Vedanta demerger faces SEBI objections",
          source: "Business Standard",
          time: "1 week ago",
          sentiment: "bearish",
        },
        {
          title: "Zinc prices crash 20% on global oversupply",
          source: "Bloomberg",
          time: "2 weeks ago",
          sentiment: "bearish",
        },
      ],
      signals: [
        { date: "Apr 5", text: "Monthly close at 52-week low" },
        { date: "Mar 20", text: "Volume surge on breakdown" },
        { date: "Mar 1", text: "Broke below 350 major support" },
      ],
    },
    {
      ticker: "ICICIBANK",
      name: "ICICI Bank",
      sector: "Banking",
      price: 1098.0,
      change: 142.0,
      changePct: 14.85,
      signal: "bullish",
      score: 8.3,
      tagline: "ROA King | Digital Lead",
      verdict:
        "Best ROA among large banks for 6th consecutive quarter. Digital banking platform gaining market share. Monthly chart at all-time highs.",
      technicals: {
        rsi: 65,
        macd: "Bullish",
        dma50: "Above",
        dma200: "Above",
        volumeVsAvg: 1.7,
        supertrend: "Buy",
        bollingerBand: "Upper",
      },
      fundamentals: {
        pe: 18.5,
        debtToEquity: 6.2,
        marketCap: "7.7L Cr",
        promoterHolding: 0,
        qoqRevenue: 16,
        roe: 18,
        sectorPE: 16,
      },
      news: [
        {
          title: "ICICI Bank iMobile crosses 60M active users",
          source: "CNBC TV18",
          time: "2 weeks ago",
          sentiment: "bullish",
        },
      ],
      signals: [
        { date: "Apr 5", text: "New all-time monthly closing high" },
        { date: "Mar 15", text: "Monthly MACD in strong bullish zone" },
      ],
    },
  ],
};

// Helper to find a stock by ticker across all timeframes
export function findStock(ticker: string): { stock: Stock; timeframe: string } | null {
  for (const timeframe of ["daily", "weekly", "monthly"] as const) {
    const stock = mockData[timeframe].find(
      (s) => s.ticker.toLowerCase() === ticker.toLowerCase()
    );
    if (stock) return { stock, timeframe };
  }
  return null;
}

// Get all unique stocks across timeframes (for detail page)
export function getStockByTicker(ticker: string): Stock | null {
  // Priority: daily > weekly > monthly (most recent data)
  for (const timeframe of ["daily", "weekly", "monthly"] as const) {
    const stock = mockData[timeframe].find(
      (s) => s.ticker.toLowerCase() === ticker.toLowerCase()
    );
    if (stock) return stock;
  }
  return null;
}
