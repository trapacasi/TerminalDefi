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
  const [activeTab, setActiveTab] = useState('tecnico');
  const [selectedToken, setSelectedToken] = useState('BTC/USDT');
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Lista de tokens populares para el selector
  const availableTokens = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'AAVE/USDT', 'UNI/USDT', 'LINK/USDT', 'DOT/USDT', 'MATIC/USDT'];

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setErrorMsg(null);
      try {
        // Llamamos a la API pasando el token seleccionado como parámetro
        const response = await fetch(`/api/report?symbol=${selectedToken.replace('/', '')}`);
        const json = await response.json();
        
        if (json.data && json.data.length > 0) {
          setTokenData(json.data[0]);
        } else {
          setErrorMsg(json.error || "No se encontraron datos para este token");
        }
      } catch (error) {
        setErrorMsg("Error de conexión con la terminal");
      } finally {
        setLoading(false);
      }
    }

    if (activeTab === 'tecnico') {
      loadData();
    }
  }, [selectedToken, activeTab]);

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
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER ESTILO TERMINAL */}
        <header className="mb-8 border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 uppercase tracking-widest">
            Pablo Terminal Pro <span className="text-indigo-500 text-sm font-light">V1.0</span>
          </h1>
          <p className="text-slate-400 text-sm italic">Institutional Analysis & Liquidity Intelligence</p>
        </header>

        {/* NAVEGACIÓN POR PESTAÑAS */}
        <div className="flex space-x-2 mb-6 bg-slate-900 p-1 rounded-lg border border-slate-800 w-fit">
          <button 
            onClick={() => setActiveTab('liquidez')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'liquidez' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Estrategia de Liquidez
          </button>
          <button 
            onClick={() => setActiveTab('tecnico')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'tecnico' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Análisis Técnico (Power 4)
          </button>
          <button 
            onClick={() => setActiveTab('fundamental')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'fundamental' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Análisis Fundamental
          </button>
        </div>

        {/* CONTENIDO DE LA PESTAÑA TÉCNICA */}
        {activeTab === 'tecnico' && (
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-2xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Detección de Etapa Institucional</h2>
                  <p className="text-slate-400 text-sm">Cierre diario analizado a las 01:00 AM (España)</p>
                </div>
                
                <div className="flex items-center space-x-3 bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-xs font-bold text-slate-500 uppercase ml-2">Token:</span>
                  <select 
                    value={selectedToken}
                    onChange={(e) => setSelectedToken(e.target.value)}
                    className="bg-transparent text-white font-bold outline-none cursor-pointer focus:text-indigo-400"
                  >
                    {availableTokens.map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mb-4"></div>
                  <p className="text-slate-500 animate-pulse">Sincronizando con Binance Data Hub...</p>
                </div>
              ) : errorMsg ? (
                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-lg text-center">
                  <p className="text-red-400">{errorMsg}</p>
                </div>
              ) : tokenData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                    <p className="text-slate-500 text-xs uppercase font-bold mb-1">Precio Actual</p>
                    <p className="text-2xl font-mono text-white">${tokenData.currentPrice.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                    <p className="text-slate-500 text-xs uppercase font-bold mb-1">Etapa Power 4</p>
                    <div className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-black border ${getStageColor(tokenData.stage)}`}>
                      {tokenData.stage}
                    </div>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                    <p className="text-slate-500 text-xs uppercase font-bold mb-1">Media Móvil 20</p>
                    <p className="text-xl font-mono text-slate-300">${tokenData.mms20.toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                    <p className="text-slate-500 text-xs uppercase font-bold mb-1">Distancia MM20</p>
                    <p className={`text-xl font-mono ${tokenData.distanceToMMS20 > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {tokenData.distanceToMMS20 > 0 ? '+' : ''}{tokenData.distanceToMMS20.toFixed(2)}%
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Espacio para gráfico o consejos de Lifecycle (según tus instrucciones guardadas) */}
            <div className="bg-slate-900/50 rounded-xl border border-dashed border-slate-800 p-8 text-center">
              <p className="text-slate-600 text-sm tracking-widest uppercase">Métricas de Soporte y Resistencia Institucional</p>
            </div>
          </div>
        )}

        {/* PESTAÑAS VACÍAS (PARA RELLENAR EN EL FUTURO) */}
        {activeTab !== 'tecnico' && (
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-20 text-center">
            <div className="text-slate-500 text-5xl mb-4">⚙️</div>
            <h2 className="text-white text-xl font-bold mb-2">Módulo en Desarrollo</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Esta pestaña de {activeTab} se activará una vez finalicemos la integración de los modelos Power 4.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
