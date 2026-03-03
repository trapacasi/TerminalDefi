// app/api/report/route.ts
import { NextResponse } from 'next/server';
import { analyzeToken } from '../../../lib/power4Scanner';

export async function GET() {
  // Lista de activos base para la primera prueba de concepto
  const tokens = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'AAVE/USDT', 'UNI/USDT'];
  
  try {
    // Ejecutamos el escáner para todos los tokens simultáneamente
    const reportData = await Promise.all(tokens.map(token => analyzeToken(token)));
    
    // Devolvemos el JSON actualizado en tiempo real
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      data: reportData
    });
  } catch (error) {
    return NextResponse.json({ error: 'Fallo al generar el análisis' }, { status: 500 });
  }
}
