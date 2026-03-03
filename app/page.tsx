"use client";

import { useEffect, useState, useRef } from 'react';

interface TokenData {
  symbol: string;
  currentPrice: number;
  mms20: number;
  mms40: number;
  mms200: number;
  stage: string;
  distanceToMMS20: number;
}

// BUSCADOR UNIVERSAL (Sin listas cerradas)
function TokenSearch({ value, onChange, label }: { value: string, onChange: (val: string) => void, label: string }) {
  const [query, setQuery] = useState(value.replace('/USDC', ''));
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Al escribir, actualizamos el estado local
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value.toUpperCase());
  };

  // Al pulsar Enter o el botón, disparamos la búsqueda global
  const triggerSearch = () => {
    if (query.trim() !== "") {
      onChange(`${query.trim()}/USDC`);
    }
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block ml-1 tracking-widest">{label}</label>
      <div className="relative flex gap-2">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && triggerSearch()}
          className="w-full bg-slate-900 border border-slate-800 p-3.5 rounded-xl text-white font-bold outline-none focus:border-indigo-500 transition-all text-sm"
          placeholder="Ej: JUP, SOL, BTC..."
        />
        <button 
          onClick={triggerSearch}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 rounded-xl font-bold text-xs transition-colors uppercase tracking-widest"
        >
          Cargar
        </button>
      </div>
      <p className="text-[9px] text-slate-600 mt-1 ml-1 font-medium italic">Par de referencia automático: USDC</p>
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Análisis Técnico');
  const [tokenTech, setTokenTech] = useState('BTC/USDC');
  const [tokenLiqA, setTokenLiqA] = useState('BTC/USDC');
  const [tokenLiqB, setTokenLiqB] = useState('SOL/USDC');
  const [techData, setTechData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || activeTab !== 'Análisis Técnico') return;
    async function fetchTechData() {
      setLoading(true);
      setErrorMsg(null);
      try {
        const cleanSymbol = tokenTech.replace('/', '');
        const res = await fetch(`/api/report?symbol=${cleanSymbol}`);
        const json = await res.json();
        
        if (json.data && json.data.length > 0) {
          setTechData(json.data[0]);
        } else {
          setErrorMsg(`No se encontraron datos para ${tokenTech} en USDC.`);
        }
      } catch (e) {
        setErrorMsg("Error de conexión con el Hub de datos.");
      } finally {
        setLoading(false);
      }
    }
    fetchTechData();
  }, [tokenTech, activeTab, mounted]);

  if (!mounted) return <div className="min-h-screen bg-slate-950" />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-10 border-b border-slate-800 pb-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
              PABLO TERMINAL <span className="text-indigo-500">PRO</span>
            </h1>
            <p className="text-slate-600 text-[10px] tracking-[0.3em] uppercase font-bold mt-1">
              Institutional Analysis | Base: USDC
            </p>
          </div>
          <div className="hidden md:block text-right">
             <div className="text-green-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 justify-end">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               Universal Scanner Active
             </div>
          </div>
        </header>

        <nav className="flex gap-2 mb-10 bg-slate-900/40 p-1.5 rounded-2xl border border-slate-800 w-fit">
          {['Estrategia de Liquidez', 'Análisis Técnico', 'Análisis Fundamental'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {activeTab === 'Análisis Técnico' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-8 border-b border-slate-800/50 pb-8">
                <div>
                  <h2 className="text-xl font-bold text-white uppercase">Power 4 Lifecycle</h2>
                  <p className="text-slate-500 text-sm mt-1">Cálculo de etapas institucionales para cualquier token</p>
                </div>
                <div className="w-full lg:w-96">
                  <TokenSearch label="Buscar cualquier Token" value={tokenTech} onChange={setTokenTech} />
                </div>
              </div>

              {loading ? (
                <div className="py-20 text-center uppercase tracking-[0.3em] text-slate-600 text-[10px] font-bold">
                  Conectando con el motor de búsqueda universal...
                </div>
              ) : techData ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-3">Precio Actual</p>
                    <p className="text-2xl font-mono text-white">${techData.currentPrice.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-3">Etapa</p>
                    <div className="text-indigo-400 font-black text-xl italic tracking-tighter">{techData.stage}</div>
                  </div>
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-3">Media Móvil 20</p>
                    <p className="text-xl font-mono text-slate-400">${techData.mms20.toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-3">Distancia %</p>
                    <p className={`text-xl font-mono ${techData.distanceToMMS20 > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {techData.distanceToMMS20.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ) : errorMsg && (
                <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-2xl text-center text-red-400 text-sm italic">
                  {errorMsg}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Estrategia de Liquidez' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-8 uppercase tracking-tight">Comparativa Global (USDC)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end mb-12">
                <TokenSearch label="Activo A" value={tokenLiqA} onChange={setTokenLiqA} />
                <TokenSearch label="Activo B" value={tokenLiqB} onChange={setTokenLiqB} />
              </div>
              <div className="p-20 border-2 border-dashed border-slate-800 rounded-3xl text-center bg-slate-950/20">
                <div className="flex justify-center items-center gap-8">
                   <span className="text-white font-mono text-2xl font-black">{tokenLiqA}</span>
                   <span className="text-slate-700 font-black tracking-widest">VS</span>
                   <span className="text-white font-mono text-2xl font-black">{tokenLiqB}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
