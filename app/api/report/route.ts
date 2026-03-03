// app/api/report/route.ts

import { NextResponse } from 'next/server';
import { analyzeToken } from '../../../lib/power4Scanner';

// Forzamos que esta ruta sea dinámica para que Vercel no la guarde en caché (datos siempre en vivo)
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Extraemos el parámetro 'symbol' que nos manda el buscador del Dashboard (ej. "?symbol=ETHUSDC")
  const { searchParams } = new URL(request.url);
  const querySymbol = searchParams.get('symbol');

  try {
    // Si la página hace una petición vacía al inicio, por defecto cargamos BTCUSDC
    const targetSymbol = querySymbol || 'BTCUSDC';
    
    // Llamamos a tu motor en 'lib/power4Scanner.ts' y esperamos su análisis real sobre Binance
    const reportData = await analyzeToken(targetSymbol);
    
    // Devolvemos los datos analizados a tu página.
    // Ojo: Lo devolvemos dentro de un array ( [reportData] ) 
    // porque tu 'page.tsx' original (json.data[0]) espera recibir una lista.
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      data: [reportData]
    });

  } catch (error: any) {
    // En caso de que el token no exista en Binance, enviamos el error controlado
    return NextResponse.json(
      { error: error.message || 'Fallo al generar el análisis' }, 
      { status: 500 }
    );
  }
}
