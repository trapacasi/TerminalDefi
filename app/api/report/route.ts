import { NextResponse } from 'next/server';
import { analyzeToken } from '@/lib/power4Scanner'; // Usamos @ para evitar errores de ruta

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || 'BTC'; // Si no hay nada, por defecto BTC

  try {
    const data = await analyzeToken(symbol);
    return NextResponse.json({ data: [data] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
