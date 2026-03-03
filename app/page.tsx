"use client";

import { useEffect, useState, useRef } from 'react';

// Interfaz de datos con referencia a USDC
interface TokenData {
  symbol: string;
  currentPrice: number;
  mms20: number;
  mms40: number;
  mms200: number;
  stage: string;
  distanceToMMS20: number;
}

// COMPONENTE BUSCADOR UNIVERSAL (Predictivo y Libre)
function TokenSearch({ value, onChange, label }: { value: string, onChange: (val: string) => void, label: string }) {
  const [query, setQuery] = useState(value.replace('/USDC', ''));
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sugerencias rápidas (incluyendo JUP como pediste)
  const suggestions = ['BTC', 'ETH', 'SOL', 'JUP', 'AAVE', 'LINK', 'UNI', 'DOT'];

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (symbol: string) => {
    const fullSymbol = `${symbol.toUpperCase()}/USDC`;
    setQuery(symbol.toUpperCase());
    onChange(fullSymbol);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block ml-1 tracking-widest">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => setQuery(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSelect(query);
          }}
          className="w-full bg-slate-900 border border-slate-800 p-3.5 rounded-xl text-white font-bold outline-none focus:border-indigo-500 transition-all text-sm"
          placeholder="Ej: JUP, BTC, SOL..."
        />
        <button 
          onClick={() => handleSelect(query)}
          className="absolute right-3 top-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] px-3 py-1.5 rounded-lg font-bold transition-colors"
        >
          CARGAR
        </button>
      </div>
      
      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
          <p className="p-3 text-[9px] font-black text-slate-600 uppercase border-b border-slate-800">Sugerencias rápidas</p>
          {suggestions.filter(s => s.includes(query)).map(s => (
            <div 
              key={s}
              onClick={() => handleSelect(s)}
              className="flex items-center justify-between p-4 hover:bg-indigo-600/20 cursor-pointer border-b border-slate-800/50 last:border-0"
            >
              <span className="text-white text-sm font-bold">{s}/USDC</span>
              <span className="text-indigo-500 text-[10px] font-bold">SELECCIONAR</span>
            </div>
          ))}
        </div>
      )}
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
        // Limpiamos el símbolo para la API (ej: BTC/USDC -> BTCUSDC)
        const cleanSymbol = tokenTech.replace('/', '');
        const res = await fetch(`/api/report?symbol=${cleanSymbol}`);
        const json = await res.json();
        
        if (json.data && json.data.length > 0) {
          setTechData(json.data[0]);
        } else {
          setErrorMsg(`El par ${tokenTech} no devolvió datos. Asegúrate de que existe en USDC.`);
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
              USDC Liquidity Hub & Power 4 Engine
            </p>
          </div>
          <div className="hidden md:block text-right">
             <div className="text-indigo-500 text-[10px] font-black uppercase tracking-widest">Global Scan Active</div>
             <div className="text-slate-500 text-[9px] mt-1 italic font-mono">BASE_CURRENCY: USDC</div>
          </div>
        </header>

        <nav className="flex gap-2 mb-10 bg-slate-900/40 p-1.5 rounded-2xl border border-slate-800 w-fit overflow-x-auto">
          {['Estrategia de Liquidez', 'Análisis Técnico', 'Análisis Fundamental'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {activeTab === 'Análisis Técnico' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl border-t-indigo-500/30">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-8">
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-tight">Escáner Power 4 (Lifecycle)</h2>
                  <p className="text-slate-500 text-sm mt-1">Cálculo institucional optimizado para pares USDC</p>
                </div>
                <div className="w-full lg:w-80">
                  <TokenSearch label="Token de Análisis" value={tokenTech} onChange={setTokenTech} />
                </div>
              </div>

              {loading ? (
                <div className="py-24 text-center">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-2 w-48 bg-slate-800 rounded-full mb-4"></div>
                    <p className="text-slate-600 text-[10px] tracking-[0.4em] uppercase font-black">Sincronizando con Blockchain...</p>
                  </div>
                </div>
              ) : techData ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-3">Precio ({tokenTech.split('/')[0]})</p>
                    <p className="text-2xl font-mono text-white">${techData.currentPrice.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-3">Etapa Lifecycle</p>
                    <div className="text-indigo-400 font-black text-xl tracking-tighter">{techData.stage}</div>
                  </div>
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-3">MM20 (Diaria)</p>
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
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <h2 className="text-xl font-bold text-white mb-8 uppercase tracking-tight">Comparativa de Liquidez USDC</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end mb-12">
                <TokenSearch label="Token Base (A)" value={tokenLiqA} onChange={setTokenLiqA} />
                <TokenSearch label="Token Contraste (B)" value={tokenLiqB} onChange={setTokenLiqB} />
              </div>
              <div className="p-20 border-2 border-dashed border-slate-800 rounded-3xl text-center bg-slate-950/20">
                <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em] mb-4">Correlación de Volúmenes</p>
                <div className="flex justify-center items-center gap-6">
                   <span className="text-white font-mono text-xl">{tokenLiqA}</span>
                   <span className="text-slate-700 italic text-sm">vs</span>
                   <span className="text-white font-mono text-xl">{tokenLiqB}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
