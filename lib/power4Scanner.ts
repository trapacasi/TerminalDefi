// lib/power4Scanner.ts

// Definimos la estructura de datos que espera tu Dashboard
export interface Power4Report {
    symbol: string;
    currentPrice: number;
    mms20: number;
    mms40: number;
    mms200: number;
    stage: 'E1' | 'E2' | 'E3' | 'E4' | 'INDEFINIDA';
    distanceToMMS20: number;
  }
  
  // Función para calcular la Media Móvil Simple (MMS)
  function calculateMMS(closes: number[], period: number): number {
    if (closes.length < period) return 0; // Si no hay datos suficientes
    
    // Sumamos los últimos "period" cierres
    const sum = closes.slice(closes.length - period).reduce((acc, val) => acc + val, 0);
    return sum / period;
  }
  
  // Función principal de Análisis Técnico según el Método Power 4
  export async function analyzeToken(symbol: string): Promise<Power4Report> {
    
    // Limpiamos el símbolo asegurando formato Binance (ej: "BTCUSDC")
    const cleanSymbol = symbol.replace('/', '').toUpperCase();
    
    // Llamada a la API de Binance. 
    // Pedimos 250 velas diarias (1d) para poder calcular holgadamente la MMS200
    // Binance proporciona automáticamente el cierre de cada día completo.
    const url = `https://data-api.binance.vision/api/v3/klines?symbol=${cleanSymbol}&interval=1d&limit=250`;
  
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Token ${symbol} no encontrado o sin volumen en el par USDC.`);
      }
  
      const rawData = await response.json();
      
      // Verificamos si hay suficientes datos para una lectura fiable. 
      // Mínimo 20 días para sacar la MMS20
