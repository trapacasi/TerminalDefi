// app/api/report/route.ts
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { analyzeToken } from '../../../lib/power4Scanner';

export async function GET(request: Request) {
  // Extraemos el parámetro ?symbol= de la URL
  const { searchParams } = new URL(request.url);
  const querySymbol = searchParams.get('symbol');

  try {
    // Si no se especifica un token en la búsqueda, analizamos BTCUSDC por defecto.
    const targetSymbol = querySymbol || 'BTCUSDC';
    
    // Solo analizamos el token solicitado
    const reportData = await analyzeToken(targetSymbol);
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      data: [reportData] // Retornamos en formato array para mantener la compatibilidad con page.tsx
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Fallo al generar el análisis' }, { status: 500 });
  }
}
