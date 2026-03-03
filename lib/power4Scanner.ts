// lib/power4Scanner.ts
import ccxt from 'ccxt';
import { SMA } from 'technicalindicators';

const exchange = new ccxt.binance();

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
    const ohlcv = await exchange.fetchOHLCV(symbol, '1d', undefined, 250);
    
    const closes = ohlcv.map(candle => candle[4]);
    const highs = ohlcv.map(candle => candle[2]);
    const lows = ohlcv.map(candle => candle[3]);
    
    const currentPrice = closes[closes.length - 1];

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
  
  // 1. Extraemos los datos más recientes para evaluar inercia
  const currentClose = closes[closes.length - 1];
  const mms20 = mms20Array[mms20Array.length - 1];
  const mms20Prev = mms20Array[mms20Array.length - 2];
  const mms40 = mms40Array[mms40Array.length - 1];
  const mms40Prev = mms40Array[mms40Array.length - 2];

  // 2. Evaluamos la pendiente de las Medias Móviles (Alcista o Bajista)
  const mms20Bullish = mms20 > mms20Prev;
  const mms20Bearish = mms20 < mms20Prev;
  const mms40Bullish = mms40 > mms40Prev;
  const mms40Bearish = mms40 < mms40Prev;
  const mms20Flat = Math.abs((mms20 - mms20Prev) / mms20Prev) < 0.0005; // Tolerancia de aplanamiento

  // 3. Regla de los 3 Cierres
  const last3Closes = closes.slice(-3);
  const last3MMS20 = mms20Array.slice(-3);
  const threeClosesBelowMMS20 = last3Closes.every((close, index) => close < last3MMS20[index]);
  const threeClosesAboveMMS20 = last3Closes.every((close, index) => close > last3MMS20[index]);

  // 4. Lógica Estructural de Etapas
  
  // ETAPA 2: Dominio comprador, MM20 y MM40 alcistas.
  if (currentClose > mms20 && mms20Bullish && mms40Bullish && !threeClosesBelowMMS20) {
    return 'E2';
  }

  // ETAPA 4: Dominio vendedor, MM20 y MM40 bajistas.
  if (currentClose < mms20 && mms20Bearish && mms40Bearish && !threeClosesAboveMMS20) {
    return 'E4';
  }

  // ETAPA 3 (Distribución): Detectamos agotamiento (3 cierres por debajo o consumo/aplanamiento).
  if (threeClosesBelowMMS20 || (mms20Flat && currentClose < mms20)) {
    return 'E3';
  }

  // ETAPA 1 (Acumulación): Detectamos freno de caída (3 cierres por encima o aplanamiento tras caída).
  if (threeClosesAboveMMS20 || (mms20Flat && currentClose > mms20)) {
    return 'E1';
  }

  return 'Transición';
}
