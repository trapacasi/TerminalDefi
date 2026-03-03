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

// BUSCADOR UNIVERSAL REAL: Sin listas, sin filtros previos. 
// Lo que escribes se busca en la blockchain vía API.
function TokenSearch({ value, onChange, label }: { value: string, onChange: (val: string) => void, label: string }) {
  // Quitamos el /USDC para mostrar solo el Ticker en el input
  const [query, setQuery] = useState(value.split('/')[0]);

  const handleAction = () => {
    if (query.trim()) {
      // Forzamos el par USDC que es tu estándar validado
      const fullSymbol = `${query.trim().toUpperCase()}/USDC`;
      onChange(fullSymbol);
    }
  };

  return (
    <div className="relative w-full">
      <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block ml-1 tracking-[0.2em]">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && handleAction()}
          className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl text-white font-mono font-bold outline-none focus:border-indigo-500 transition-all shadow-inner"
          placeholder="EJ: SYRUP, JUP, BTC..."
        />
        <button 
          onClick={handleAction}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
        >
          ANALIZAR
        </button>
      </div>
      <p className="text-[9px] text-slate-600 mt-2 ml-1 font-bold italic uppercase tracking-tighter">
        Protocolo activo: Mercado al contado USDC
      </p>
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
          setErrorMsg(`TOKEN NO ENCONTRADO: ${tokenTech} no está disponible en el par USDC de Binance.`);
        }
      } catch (e) {
        setErrorMsg("ERROR DE CONEXIÓN CON LA TERMINAL.");
      } finally {
        setLoading(false);
      }
    }
    fetchTechData();
  }, [tokenTech, activeTab, mounted]);

  if (!mounted) return <div className="min-h-screen bg-slate-950" />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-10 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER SISTEMA */}
        <header className="mb-10 border-b border-slate-800 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(99,102,241,1)]"></div>
              <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">PABLO TERMINAL <span className="text-indigo-500">PRO</span></h1>
            </div>
            <p className="text-slate-500 text-[10px] tracking-[0.4em] uppercase font-bold">Universal Blockchain Scanner | USDC Standard</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 px-5 py-3 rounded-2xl hidden md:block">
             <div className="text-green-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> 
               Sincronización Global OK
             </div>
             <p className="text-slate-600 text-[9px] mt-1 font-mono uppercase">Reference: Binance Spot API</p>
          </div>
        </header>

        {/* NAVEGACIÓN PESTAÑAS */}
        <nav className="flex gap-2 mb-10 bg-slate-900/40 p-1.5 rounded-2xl border border-slate-800 w-fit overflow-x-auto no-scrollbar">
          {['Estrategia de Liquidez', 'Análisis Técnico', 'Análisis Fundamental'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === tab ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/50'}`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* CONTENIDO: ANÁLISIS TÉCNICO */}
        {activeTab === 'Análisis Técnico' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/5 blur-[100px] rounded-full"></div>
              
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-10">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">Power 4 Lifecycle</h2>
                  <p className="text-slate-500 text-sm mt-2 font-medium">Análisis de estructura y medias móviles institucionales.</p>
                </div>
                <div className="w-full lg:w-[450px]">
                  <TokenSearch label="Consultar cualquier Activo (USDC)" value={tokenTech} onChange={setTokenTech} />
                </div>
              </div>

              {loading ? (
                <div className="py-24 text-center">
                  <div className="inline-block w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-600 text-[10px] tracking-[0.5em] uppercase font-black">Escaneando Bloques...</p>
                </div>
              ) : techData ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800/50 hover:border-indigo-500/50 transition-all group">
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-4 tracking-widest group-hover:text-indigo-400 transition-colors">Precio Mercado</p>
                    <p className="text-3xl font-mono text-white">${techData.currentPrice.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800/50">
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-4 tracking-widest">Etapa Power 4</p>
                    <div className="text-indigo-500 font-black text-2xl tracking-tighter italic uppercase">{techData.stage}</div>
                  </div>
                  <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800/50">
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-4 tracking-widest">Media Móvil 20</p>
                    <p className="text-2xl font-mono text-slate-300">${techData.mms20.toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800/50">
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-4 tracking-widest">Gap vs MM20</p>
                    <p className={`text-2xl font-mono ${techData.distanceToMMS20 > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {techData.distanceToMMS20.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ) : errorMsg && (
                <div className="bg-red-500/5 border border-red-500/20 p-10 rounded-3xl text-center">
                  <p className="text-
