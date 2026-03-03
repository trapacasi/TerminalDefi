"use client";

import { useEffect, useState } from 'react';

interface TokenData {
  symbol: string;
  currentPrice: number;
  mms20: number;
  mms40: number;
  mms200: number;
  stage: string;
  distanceToMMS20: number;
}

export default function Dashboard() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/report');
        const json = await response.json();
        
        if (json.data) {
          setTokens(json.data);
        } else {
          setErrorMsg(json.error || "Error desconocido desde el servidor");
        }
        
        const now = new Date();
        setLastUpdate(now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
      } catch (error) {
        setErrorMsg("Fallo crítico de conexión con la API");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'E2': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'E4': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'E1': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'E3': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-8 border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Terminal POWER 4
          </h1>
          <div className="flex justify-between items-center text-sm text-slate-400">
            <p>Análisis de Estructura Institucional (Cierre 01:00 AM)</p>
            <p>Última actualización: {loading ? 'Cargando...' : lastUpdate}</p>
          </div>
        </header>

        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
              <p className="text-slate-400">Procesando reglas algorítmicas y descargando OHLCV...</p>
            </div>
          ) : errorMsg ? (
            <div className="flex flex-col items-center justify-center p-20 h-full">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-white mb-2">Error en el Escáner</h2>
              <p className="text-red-400 bg-red-500/10 px-4 py-2 rounded border border-red-500/20">{errorMsg}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/50 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                    <th className="p-4 font-medium">Activo</th>
                    <th className="p-4 font-medium text-right">Precio Actual</th>
                    <th className="p-4 font-medium text-center">Etapa Actual</th>
                    <th className="p-4 font-medium text-right">MM20</th>
                    <th className="p-4 font-medium text-right">Distancia a MM20 (Barrio Sésamo)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {tokens.map((token, index) => (
                    <tr key={index} className="hover:bg-slate-800/20 transition-colors">
                      <td className="p-4 font-semibold text-white">{token.symbol}</td>
                      <td className="p-4 text-right font-mono">${token.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStageColor(token.stage)}`}>
                          {token.stage}
                        </span>
                      </td>
                      <td className="p-4 text-right font-mono text-slate-400">${token.mms20.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</td>
                      <td className="p-4 text-right">
                        <span className={`font-mono ${Math.abs(token.distanceToMMS20) <= 4 ? 'text-green-400' : 'text-amber-500'}`}>
                          {token.distanceToMMS20 > 0 ? '+' : ''}{token.distanceToMMS20.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
