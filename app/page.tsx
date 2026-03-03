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
  const [activeTab, setActiveTab] = useState('Análisis Técnico');
  
  // Estados para Análisis Técnico
  const [selectedTokenTech, setSelectedTokenTech] = useState('BTC/USDT');
  const [techData, setTechData] = useState<TokenData | null>(null);
  
  // Estados para Estrategia de Liquidez (Dos cajas dinámicas)
  const [tokenA, setTokenA] = useState('BTC/USDT');
  const [tokenB, setTokenB] = useState('ETH/USDT');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const availableTokens = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'AAVE/USDT', 'UNI/USDT', 'LINK/USDT', 'DOT/USDT'];

  useEffect(() => {
    async function fetchTechData() {
      if (activeTab !== 'Análisis Técnico') return;
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await fetch(`/api/report?symbol=${selectedTokenTech.replace('/', '')}`);
        const json = await res.json();
        if (json.data) setTechData(json.data[0]);
        else setErrorMsg(json.error);
      } catch (e) {
        setErrorMsg("Error de conexión");
      } finally {
        setLoading(false);
      }
    }
    fetchTechData();
  }, [selectedTokenTech, activeTab]);

  const getStageColor = (stage: string) => {
    const colors: any = {
      'E1': 'border-blue-500 text-blue-400 bg-blue-500/10',
      'E2': 'border-green-500 text-green-400 bg-green-500/10',
      'E3': 'border-yellow-500 text-yellow-400 bg-yellow-500/10',
      'E4': 'border-red-500 text-red-400 bg-red-500/10',
    };
    return colors[stage] || 'border-slate-500 text-slate-400';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-8 border-b border-slate-800 pb-6">
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase">
            PABLO TERMINAL <span className="text-indigo-500">PRO</span>
          </h1>
          <p className="text-slate-500 text-xs mt-1 tracking-widest uppercase font-bold">Institutional Intelligence System</p>
        </header>

        {/* NAVEGACIÓN */}
        <div className="flex space-x-1 mb-8 bg-slate-900/50 p-1 rounded-xl border border-slate-800 w-fit">
          {['Estrategia de Liquidez', 'Análisis Técnico', 'Análisis Fundamental'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* CONTENIDO: ANÁLISIS TÉCNICO */}
        {activeTab === 'Análisis Técnico' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-xl font-bold text-white">Detección de Etapa (Power 4)</h2>
                  <p className="text-slate-500 text-sm">Cierre 01:00 AM España | Datos en tiempo real</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg flex items-center space-x-3">
                  <span className="text-[10px] font-black text-slate-500 uppercase pl-2">Activo:</span>
                  <select 
                    className="bg-transparent text-indigo-400 font-bold outline-none cursor-pointer pr-2"
                    value={selectedTokenTech}
                    onChange={(e) => setSelectedTokenTech(e.target.value)}
                  >
                    {availableTokens.map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="py-20 text-center animate-pulse text-slate-500 uppercase text-xs tracking-widest">Consultando Algoritmo...</div>
              ) : techData ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-2">Precio Actual</p>
                    <p className="text-2xl font-mono text-white">${techData.currentPrice.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-2">Etapa Institucional</p>
                    <div className={`px-3 py-1 rounded border text-sm font-black inline-block ${getStageColor(techData.stage)}`}>
                      {techData.stage}
                    </div>
                  </div>
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-2">Media Móvil 20</p>
                    <p className="text-xl font-mono text-slate-300">${techData.mms20.toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-2">Distancia MM20</p>
                    <p className={`text-xl font-mono ${techData.distanceToMMS20 > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {techData.distanceToMMS20 > 0 ? '+' : ''}{techData.distanceToMMS20.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* CONTENIDO: ESTRATEGIA DE LIQUIDEZ */}
        {activeTab === 'Estrategia de Liquidez' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Configuración de Liquidez Dinámica</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Caja Token A */}
                <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl">
                  <label className="text-[10px] font-black text-slate-500 uppercase mb-4 block">Token Principal (A)</label>
                  <select 
                    className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white font-bold outline-none focus:border-indigo-500"
                    value={tokenA}
                    onChange={(e) => setTokenA(e.target.value)}
                  >
                    {availableTokens.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                {/* Caja Token B */}
                <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl">
                  <label className="text-[10px] font-black text-slate-500 uppercase mb-4 block">Token de Contraste (B)</label>
                  <select 
                    className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white font-bold outline-none focus:border-indigo-500"
                    value={tokenB}
                    onChange={(e) => setTokenB(e.target.value)}
                  >
                    {availableTokens.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="p-20 border-2 border-dashed border-slate-800 rounded-xl text-center">
                <p className="text-slate-600 uppercase text-xs font-bold tracking-widest">Módulo de Correlación de Liquidez</p>
                <p className="text-slate-700 text-[10px] mt-2 italic">Calculando spreads y profundidad entre {tokenA} y {tokenB}...</p>
              </div>
            </div>
          </div>
        )}

        {/* CONTENIDO: FUNDAMENTAL */}
        {activeTab === 'Análisis Fundamental' && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-20 text-center animate-in zoom-in-95 duration-500">
             <div className="text-slate-800 text-6xl mb-4 font-black">DATA</div>
             <h2 className="text-white text-xl font-bold mb-2 uppercase tracking-tighter">Módulo de Narrativas e IA</h2>
             <p className="text-slate-500 text-sm max-w-sm mx-auto">Conexión con fuentes de noticias y redes sociales para análisis de sentimiento institucional.</p>
          </div>
        )}

      </div>
    </div>
  );
}
