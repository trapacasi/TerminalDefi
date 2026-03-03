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

function calculateMMS(closes: number[], period: number): number {
  if (closes.length < period) return 0;
  const sum = closes.slice(closes.length - period).reduce((acc: number, val: number) => acc + val, 0);
  return sum / period;
}

export async function analyzeToken(symbol: string): Promise<Power4Report> {
  // Limpieza de símbolo para Binance
  const baseToken = symbol.split('/')[0].toUpperCase().trim();
  const cleanSymbol = `${baseToken}USDT`; 
  
  // API de Binance (Velas diarias)
  const url = `https://api.binance.com/api/v3/klines?symbol=${cleanSymbol}&interval=1d&limit=250`;

  try {
    const response = await fetch(url, { next: { revalidate: 0 } }); // Evita caché de Next.js
    if (!response.ok) {
      throw new Error(`Token ${baseToken} no encontrado.`);
    }

    const rawData = await response.json();
    // El índice 4 es el precio de cierre (Close)
    const closes = rawData.map((candle: any[]) => parseFloat(candle[4] as string));
    const currentPrice = closes[closes.length - 1];

    const mms20 = calculateMMS(closes, 20);
    const mms40 = calculateMMS(closes, 40);
    const mms200 = closes.length >= 200 ? calculateMMS(closes, 200) : 0;

    const distanceToMMS20 = ((currentPrice - mms20) / mms20) * 100;

    // Lógica de Etapas del Método Power 4
    let stage: 'E1' | 'E2' | 'E3' | 'E4' | 'INDEFINIDA' = 'INDEFINIDA';
    
    const mms20_prev = calculateMMS(closes.slice(0, -1), 20);
    const isMMS20Rising = mms20 > mms20_prev;
    const isMMS20Falling = mms20 < mms20_prev;

    if (currentPrice > mms20 && mms20 > mms40 && isMMS20Rising) {
      stage = 'E2'; // Alcista
    } else if (currentPrice < mms20 && mms20 < mms40 && isMMS20Falling) {
      stage = 'E4'; // Bajista
    } else if (currentPrice > mms20 && mms20 < mms40) {
      stage = 'E1'; // Suelo
    } else if (currentPrice < mms20 && mms20 > mms40) {
      stage = 'E3'; // Techo
    }

    return {
      symbol: baseToken,
      currentPrice,
      mms20,
      mms40,
      mms200,
      stage,
      distanceToMMS20
    };

  } catch (error: any) {
    console.error("Error en Scanner:", error.message);
    throw error;
  }
}
