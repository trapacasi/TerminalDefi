// lib/power4Scanner.ts

export interface Power4Report {
  symbol: string;
  currentPrice: number;
  mms20: number;
  mms40: number;
  mms200: number;
  stage: 'E1' | 'E2' | 'E3' | 'E4' | 'INDEFINIDA';
  distanceToMMS20: number;
}

// Función auxiliar para calcular medias móviles
function calculateMMS(closes: number[], period: number): number {
  if (closes.length < period) return 0;
  const sum = closes.slice(closes.length - period).reduce((acc, val) => acc + val, 0);
  return sum / period;
}

export async function analyzeToken(symbol: string): Promise<Power4Report> {
  // Aseguramos el formato correcto para Binance (ej. JUPUSDC)
  const cleanSymbol = symbol.replace('/', '').toUpperCase();
  
  // Binance API - Velas diarias (cierre 01:00 AM ES / 00:00 UTC)
  const url = `https://data-api.binance.vision/api/v3/klines?symbol=${cleanSymbol}&interval=1d&limit=250`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Token ${symbol} no válido o sin par USDC en Binance.`);
    }

    const rawData = await response.json();
    if (rawData.length < 20) {
      throw new Error(`Histórico insuficiente para ${symbol} (mínimo 20 días).`);
    }

    // Extraemos los precios de cierre (índice 4 en la respuesta de Binance)
    const closes = rawData.map((candle: any[]) => parseFloat(candle[4]));
    const currentPrice = closes[closes.length - 1];

    // Cálculos de Medias Móviles Simples (MMS)
    const mms20 = calculateMMS(closes, 20);
    const mms40 = calculateMMS(closes, 40);
    const mms200 = closes.length >= 200 ? calculateMMS(closes, 200) : 0;

    // Barrio Sésamo: Distancia porcentual del precio a la MMS20
    const distanceToMMS20 = ((currentPrice - mms20) / mms20) * 100;

    // Evaluación de Etapas (Lifecycle Power 4)
    let stage: 'E1' | 'E2' | 'E3' | 'E4' | 'INDEFINIDA' = 'INDEFINIDA';
    
    // Determinamos la pendiente de la MMS20 analizando días previos
    const mms20_yesterday = calculateMMS(closes.slice(0, -1), 20);
    const mms20_dayBefore = calculateMMS(closes.slice(0, -2), 20);
    
    const isMMS20Rising = mms20 > mms20_yesterday && mms20_yesterday >= mms20_dayBefore;
    const isMMS20Falling = mms20 < mms20_yesterday && mms20_yesterday <= mms20_dayBefore;
    const isMMS20Flattening = Math.abs((mms20 - mms20_yesterday) / mms20_yesterday) < 0.001;

    // Reglas estrictas extraídas de "La Biblia del Trader"
    if (currentPrice > mms20 && mms20 > mms40 && isMMS20Rising) {
      stage = 'E2'; // Tendencia Alcista Confirmada
    } else if (currentPrice < mms20 && mms20 < mms40 && isMMS20Falling) {
      stage = 'E4'; // Tendencia Bajista Confirmada
    } else if (currentPrice > mms20 && (isMMS20Flattening || !isMMS20Falling) && mms20 < mms40) {
      stage = 'E1'; // Transición Alcista
    } else if (currentPrice < mms20 && (isMMS20Flattening || !isMMS20Rising) && mms20 > mms40) {
      stage = 'E3'; // Transición Bajista
    }

    return {
      symbol,
      currentPrice,
      mms20,
      mms40,
      mms200,
      stage,
      distanceToMMS20
    };

  } catch (error: any) {
    console.error(`Error escaneando ${symbol}:`, error.message);
    throw error;
  }
}
