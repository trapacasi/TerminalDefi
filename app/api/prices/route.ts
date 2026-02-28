
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token') || 'jupiter-exchange-solana';
  const days = searchParams.get('days') || '30';

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${token}/market_chart?vs_currency=usd&days=${days}&interval=daily`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) throw new Error('Error en la API');

    const data = await response.json();
    
    const prices = data.prices.map((p: any) => ({
      date: new Date(p[0]).toLocaleDateString(),
      price: p[1]
    }));

    return NextResponse.json(prices);
  } catch (error) {
    return NextResponse.json({ error: 'No se pudieron cargar los precios' }, { status: 500 });
  }
}
