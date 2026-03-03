export const dynamic = 'force-dynamic';
export const preferredRegion = 'fra1'; // Mudamos el servidor a Frankfurt (Europa) para evitar el bloqueo de Binance

import { NextResponse } from 'next/server';
import { analyzeToken } from '../../../lib/power4Scanner';

export async function GET() {
  // Lista de activos base para el análisis
  const tokens = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'AAVE/USDT', 'UNI/USDT'];
  
  try {
    // Ejecutamos el escáner para todos los tokens simultáneamente
    const reportData = await Promise.all(tokens.map(token => analyzeToken(token)));
    
    // Devolvemos el JSON actualizado con los datos
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      data: reportData
    });
  } catch (error: any) {
    // Capturamos cualquier error y lo enviamos al Front-End
    return NextResponse.json({ error: error.message || 'Fallo al generar el análisis' }, { status: 500 });
  }
}
