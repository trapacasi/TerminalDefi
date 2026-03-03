// app/api/report/route.ts
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { analyzeToken } from '../../../lib/power4Scanner';

export async function GET() {
  const tokens = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'AAVE/USDT', 'UNI/USDT'];
  
  try {
    const reportData = await Promise.all(tokens.map(token => analyzeToken(token)));
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      data: reportData
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Fallo al generar el análisis' }, { status: 500 });
  }
}
