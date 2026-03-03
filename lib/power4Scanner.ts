// lib/power4Scanner.ts
import ccxt from 'ccxt';
import { SMA } from 'technicalindicators';

// Instanciamos Binance. No requiere API Keys para datos públicos (velas/OHLCV).
const exchange = new ccxt.binance();

export interface TokenAnalysis {
  symbol: string;
  currentPrice: number;
  mms20: number;
  mms40: number;
  mms200: number;
  stage: 'E1' | 'E2' | 'E3' | 'E4' | 'Transición';
  distanceToMMS20: number; // Para evaluar la regla del 4% (Barrio Sésamo)
}

export async function analyzeToken(symbol: string): Promise<TokenAnalysis> {
  try {
    // 1. Obtenemos las últimas 250 velas diarias para asegurar que la MMS200 ("La Gran Ballena") se calcula correctamente.
    // El cierre de esta vela corresponde a la 01:00 AM (España).
    const ohlcv = await exchange.fetchOHLCV(symbol, '1d', undefined, 250);
    
    const closes = ohlcv.map(candle => candle[4]);
    const highs = ohlcv.map(candle => candle[2]);
    const lows = ohlcv.map(candle => candle[3]);
    
    // Obtenemos el precio en tiempo real exacto en el momento de la ejecución
    const currentPrice = closes[closes.length - 1];

    // 2. Cálculo de Medias Móviles Simples (MMS)
    const mms20Array = SMA.calculate({ period: 20, values: closes });
    const mms40Array = SMA.calculate({ period: 40, values: closes });
    const mms200Array = SMA.calculate({ period: 200, values: closes });

    const mms20 = mms20Array[mms20Array.length - 1];
    const mms40 = mms40Array[mms40Array.length - 1];
    const mms200 = mms200Array[mms200Array.length - 1];

    // 3. Cálculo de la Distancia a la MM20 (Barrio Sésamo)
    const distanceToMMS20 = ((currentPrice - mms20) / mms20) * 100;

    // 4. Evaluación de Etapas (Lógica Estructural POWER 4)
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

function determineStage(closes: number[], highs: number[], lows: number[], mms20: number[], mms40: number[]) {
  // Aquí inyectaremos el árbol de decisiones:
  // - E1: Máximos ya no decrecientes, el precio corta la MM20, MM20 empieza a aplanarse.
  // - E2: Máximos y mínimos crecientes, superando 2 máximos previos, MM20 y MM40 alcistas.
  // - E3: Mínimos ya no crecientes, precio corta MM20, MM20 aplanándose.
  // - E4: Máximos y mínimos decrecientes, perforación de 2 mínimos previos, MM20/40 bajistas.
  
  // Por ahora, devolvemos un placeholder que iremos llenando con la matemática exacta
  return 'Transición'; 
}
