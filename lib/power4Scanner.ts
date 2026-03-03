// lib/power4Scanner.ts
import { SMA } from 'technicalindicators';

export interface TokenAnalysis {
  symbol: string;
  currentPrice: number;
  mms20: number;
  mms40: number;
  mms200: number;
  stage: 'E1' | 'E2' | 'E3' | 'E4' | 'Transición';
  distanceToMMS20: number;
}

export async function analyzeToken(symbol: string): Promise<TokenAnalysis> {
  try {
    // Adaptamos el formato del símbolo (ej. "BTC/USDT" pasa a "BTCUSDT") para Binance
    const formattedSymbol = symbol.replace('/', '');
    
    // Llamada nativa y directa a Binance (sin librerías pesadas)
    const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${formattedSymbol}&interval=1d&limit=250`);
    
    if (!response.ok) {
      throw new Error(`Error de conexión con Binance para ${symbol}`);
    }
    
    const data = await response.json();
    
    // Binance devuelve arrays. Posición 2: High, 3: Low, 4: Close
    const closes = data.map((candle: any[]) => parseFloat(candle[4]));
    const highs = data.map((candle: any[]) => parseFloat(candle[2]));
    const lows = data.map((candle: any[]) => parseFloat(candle[3]));
    
    const currentPrice = closes[closes.length - 1];

    // Cálculos de las medias móviles
    const mms20Array = SMA.calculate({ period: 20, values: closes });
    const mms40Array = SMA.calculate({ period: 40, values: closes });
    const mms200Array = SMA.calculate({ period: 200, values: closes });

    const mms20 = mms20Array[mms20Array.length - 1];
    const mms40 = mms40Array[mms40Array.length - 1];
    const mms200 = mms200Array[mms200Array.length - 1];

    const distanceToMMS20 = ((currentPrice - mms20) / mms20) * 100;

    const stage = determineStage(closes, highs, lows, mms20Array, mms40Array);

    return {
      symbol,
      currentPrice,
      mms20,
      mms40,
      mms200,
      stage,
      distanceToMMS20
    };

  } catch (error) {
    console.error(`Error analizando ${symbol}:`, error);
    throw error;
  }
}

function determineStage(
  closes: number[], 
  highs: number[], 
  lows: number[], 
  mms20Array: number[], 
  mms40Array: number[]
): 'E1' | 'E2' | 'E3' | 'E4' | 'Transición' {
  
  const currentClose = closes[closes.length - 1];
  const mms20 = mms20Array[mms20Array.length - 1];
  const mms20Prev = mms20Array[mms20Array.length - 2];
  const mms40 = mms40Array[mms40Array.length - 1];
  const mms40Prev = mms40Array[mms40Array.length - 2];

  const mms20Bullish = mms20 > mms20Prev;
  const mms20Bearish = mms20 < mms20Prev;
  const mms40Bullish = mms40 > mms40Prev;
  const mms40Bearish = mms40 < mms40Prev;
  const mms20Flat = Math.abs((mms20 - mms20Prev) / mms20Prev) < 0.0005;

  const last3Closes = closes.slice(-3);
  const last3MMS20 = mms20Array.slice(-3);
  const threeClosesBelowMMS20 = last3Closes.every((close, index) => close < last3MMS20[index]);
  const threeClosesAboveMMS20 = last3Closes.every((close, index) => close > last3MMS20[index]);

  if (currentClose > mms20 && mms20Bullish && mms40Bullish && !threeClosesBelowMMS20) {
    return 'E2';
  }

  if (currentClose < mms20 && mms20Bearish && mms40Bearish && !threeClosesAboveMMS20) {
    return 'E4';
  }

  if (threeClosesBelowMMS20 || (mms20Flat && currentClose < mms20)) {
    return 'E3';
  }

  if (threeClosesAboveMMS20 || (mms20Flat && currentClose > mms20)) {
    return 'E1';
  }

  return 'Transición';
}
