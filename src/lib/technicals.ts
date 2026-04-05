import { RSI, MACD, BollingerBands, SMA } from "technicalindicators";

export type TechnicalIndicators = {
  rsi: number | null;
  macd: "Bullish" | "Bearish" | "Neutral";
  macdValue: number | null;
  macdSignal: number | null;
  macdHistogram: number | null;
  sma50: number | null;
  sma200: number | null;
  bollingerUpper: number | null;
  bollingerMiddle: number | null;
  bollingerLower: number | null;
  dma50: "Above" | "Below";
  dma200: "Above" | "Below";
  volumeVsAvg: number | null;
};

export function computeTechnicals(
  closes: number[],
  volumes: number[],
  currentPrice: number,
  fiftyDayAvg?: number,
  twoHundredDayAvg?: number
): TechnicalIndicators {
  // RSI (14-period)
  const rsiValues = RSI.calculate({ values: closes, period: 14 });
  const rsi = rsiValues.length > 0 ? Math.round(rsiValues[rsiValues.length - 1]) : null;

  // MACD (12, 26, 9)
  const macdValues = MACD.calculate({
    values: closes,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false,
  });
  const lastMacd = macdValues.length > 0 ? macdValues[macdValues.length - 1] : null;
  const macdHist = lastMacd?.histogram ?? null;
  let macdSignalLabel: "Bullish" | "Bearish" | "Neutral" = "Neutral";
  if (macdHist !== null) {
    if (macdHist > 0) macdSignalLabel = "Bullish";
    else if (macdHist < 0) macdSignalLabel = "Bearish";
  }

  // Bollinger Bands (20, 2)
  const bbValues = BollingerBands.calculate({ values: closes, period: 20, stdDev: 2 });
  const lastBB = bbValues.length > 0 ? bbValues[bbValues.length - 1] : null;

  // SMA 50 & 200 (use Yahoo's values if available, else compute)
  let sma50 = fiftyDayAvg ?? null;
  let sma200 = twoHundredDayAvg ?? null;

  if (!sma50 && closes.length >= 50) {
    const sma50Values = SMA.calculate({ values: closes, period: 50 });
    sma50 = sma50Values.length > 0 ? sma50Values[sma50Values.length - 1] : null;
  }
  if (!sma200 && closes.length >= 200) {
    const sma200Values = SMA.calculate({ values: closes, period: 200 });
    sma200 = sma200Values.length > 0 ? sma200Values[sma200Values.length - 1] : null;
  }

  // Volume vs average
  let volumeVsAvg: number | null = null;
  if (volumes.length >= 20) {
    const recentVol = volumes[volumes.length - 1];
    const avgVol = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;
    volumeVsAvg = avgVol > 0 ? Math.round((recentVol / avgVol) * 10) / 10 : null;
  }

  return {
    rsi,
    macd: macdSignalLabel,
    macdValue: lastMacd?.MACD ?? null,
    macdSignal: lastMacd?.signal ?? null,
    macdHistogram: macdHist,
    sma50: sma50 ? Math.round(sma50 * 100) / 100 : null,
    sma200: sma200 ? Math.round(sma200 * 100) / 100 : null,
    bollingerUpper: lastBB ? Math.round(lastBB.upper * 100) / 100 : null,
    bollingerMiddle: lastBB ? Math.round(lastBB.middle * 100) / 100 : null,
    bollingerLower: lastBB ? Math.round(lastBB.lower * 100) / 100 : null,
    dma50: sma50 ? (currentPrice > sma50 ? "Above" : "Below") : "Below",
    dma200: sma200 ? (currentPrice > sma200 ? "Above" : "Below") : "Below",
    volumeVsAvg,
  };
}
