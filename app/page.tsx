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

// ----------------------------------------------------------------------------------
// BUSCADOR UNIVERSAL REFINADO (Versión Estable para Vercel)
// ----------------------------------------------------------------------------------
function TokenSearch({ value, onChange, label }: { value: string, onChange: (val: string) => void, label: string }) {
  // Inicializamos limpiando cualquier '/USDC'
  const [query, setQuery] = useState(value.replace('/USDC', '').replace('/USDT', ''));

  const handleAction = () => {
    const cleanQuery = query.trim().toUpperCase();
    if (cleanQuery) {
      // Aplicamos siempre USDC, garantizado para el análisis institucional.
      onChange(`${cleanQuery}/USDC`);
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
          placeholder="EJ: JUP, SYRUP, BTC..."
        />
        <button 
          onClick={handleAction}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
        >
          ANALIZAR
        </button>
      </div>
      <p className="text-[9px] text-slate-600 mt-2 ml-1 font-bold italic uppercase tracking-tighter">
        Base de cotización forzada: USDC
      </p>
    </div>
  );
}

// ----------------------------------------------------------------------------------
// COMPONENTE PRINCIPAL DEL DASHBOARD
// ----------------------------------------------------------------------------------
export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('Análisis Técnico');
  
  const [tokenTech, setTokenTech] = useState('BTC/USDC');
  const [tokenLiqA, setTokenLiqA] = useState('BTC/USDC');
  const [tokenLiqB, setTokenLiqB] = useState('SOL/USDC');
  
  const [techData, setTechData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Escudo contra problemas de hidratación en Vercel
  useEffect(() => { 
    setMounted(true); 
  }, []);

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
          setErrorMsg(`NO ENCONTRADO: Verifica que "${tokenTech}" tenga liquidez en Binance Spot.`);
        }
      } catch (e) {
        setErrorMsg("Error de red crítico. El Hub de Binance no responde.");
      } finally {
        setLoading(false);
      }
    }
    fetchTechData();
  }, [tokenTech, activeTab, mounted]);

  // Durante la compilación en el servidor de Vercel (pre-renderizado)
  // devolvemos un esqueleto vacío para evitar conflictos de mismatch.
  if (!mounted) return <div className="min-h-screen bg-slate-950" />;

  // Renderizado dinámico seguro
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-10 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto">
        
        {/* ENCABEZADO INSTITUCIONAL */}
        <header className="mb-10 border-b border-slate-800 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(99,102,241,1)]"></div>
              <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">
                PABLO TERMINAL <span className="text-indigo-500">PRO</span>
              </h1>
            </div>
            <p className="text-slate-500 text-[10px] tracking-[0.4em] uppercase font-bold">
              Universal Algorithm Interface
            </p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 px-5 py-3 rounded-2xl hidden md:block text-right">
             <div className="text-green-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-end gap-2">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> 
               SYSTEMS ONLINE
             </div>
             <p className="text-slate-600 text-[9px] mt-1 font-mono uppercase">
               Cierre Diario: 01:00 AM (ES)
             </p>
          </div>
        </header>

        {/* NAVEGADOR DE PESTAÑAS */}
        <div className="flex gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
          {['Estrategia de Liquidez', 'Análisis Técnico', 'Análisis Fundamental'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border-2 
                ${activeTab === tab 
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]' 
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ========================================================= */}
        {/* PESTAÑA: ANÁLISIS TÉCNICO (POWER 4 LIFECYCLE) */}
        {/* ========================================================= */}
        {activeTab === 'Análisis Técnico' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-10">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight italic flex items-center gap-3">
                    <span className="text-indigo-500 text-3xl">P4</span>
                    Power 4 Lifecycle
                  </h2>
                  <p className="text-slate-500 text-xs mt-2 font-bold tracking-[0.1em] uppercase">
                    Estructura basada en MMS 20, 40 y 200
                  </p>
                </div>
                <div className="w-full lg:w-[450px]">
                  <TokenSearch label="Consultar Activo Universal" value={tokenTech} onChange={setTokenTech} />
                </div>
              </div>

              {loading ? (
                <div className="py-24 text-center">
                  <div className="inline-block w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-500 text-[10px] tracking-[0.5em] uppercase font-black animate-pulse">
                    Computando Algoritmo de Etapas...
                  </p>
                </div>
              ) : techData ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800">
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-4 tracking-widest">Precio</p>
                    <p className="text-3xl font-mono text-white">${techData.currentPrice.toLocaleString()}</p>
                  </div>
                  
                  {/* Etapa (Con color dinámico según la Biblia del Trader) */}
                  <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-16 h-16 blur-2xl opacity-20 ${techData.stage === 'E2' ? 'bg-green-500' : techData.stage === 'E4' ? 'bg-red-500' : 'bg-indigo-500'}`}></div>
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-4 tracking-widest">Etapa Lifecycle</p>
                    <div className="text-indigo-400 font-black text-3xl italic tracking-tighter uppercase">
                      {techData.stage}
                    </div>
                  </div>

                  <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800">
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-4 tracking-widest">MMS 20</p>
                    <p className="text-2xl font-mono text-slate-300">${techData.mms20.toFixed(4)}</p>
                  </div>

                  {/* Barrio Sésamo / Distancia */}
                  <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800">
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-4 tracking-widest">Barrio Sésamo</p>
                    <p className={`text-2xl font-mono ${Math.abs(techData.distanceToMMS20) > 4 ? 'text-red-400' : 'text-green-400'}`}>
                      {techData.distanceToMMS20 > 0 ? '+' : ''}{techData.distanceToMMS20.toFixed(2)}%
                    </p>
                    <p className="text-slate-600 text-[9px] font-bold mt-1 uppercase">
                      {Math.abs(techData.distanceToMMS20) > 4 ? 'Umbral excedido' : 'Zona segura'}
                    </p>
                  </div>
                </div>
              ) : errorMsg && (
                <div className="bg-red-950/30 border border-red-900/50 p-10 rounded-3xl text-center">
                  <p className="text-red-400 text-xs font-bold uppercase tracking-widest">{errorMsg}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PESTAÑA: ESTRATEGIA DE LIQUIDEZ */}
        {/* ========================================================= */}
        {activeTab === 'Estrategia de Liquidez' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 lg:p-12 shadow-2xl">
              <h2 className="text-2xl font-black text-white mb-10 uppercase tracking-tight italic">
                Liquidity Correlation Engine
              </h2>
              
              {/* DOBLE SELECTOR DINÁMICO VALIDADO */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mb-14">
                <TokenSearch label="Activo Principal (A)" value={tokenLiqA} onChange={setTokenLiqA} />
                <TokenSearch label="Activo de Contraste (B)" value={tokenLiqB} onChange={setTokenLiqB} />
              </div>
              
              <div className="p-20 md:p-32 border-2 border-dashed border-slate-800 rounded-3xl text-center bg-slate-950/50 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-slate-800/50"></div>
                <div className="flex flex-col md:flex-row justify-center items-center gap-10 relative z-10">
                   <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 min-w-[200px]">
                      <p className="text-4xl font-black text-white uppercase font-mono">{tokenLiqA.split('/')[0]}</p>
                   </div>
                   <div className="bg-indigo-600 text-white font-black text-xs px-4 py-2 rounded-full uppercase tracking-widest italic shadow-lg shadow-indigo-500/20">VS</div>
                   <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 min-w-[200px]">
                      <p className="text-4xl font-black text-white uppercase font-mono">{tokenLiqB.split('/')[0]}</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA FUNDAMENTAL */}
        {activeTab === 'Análisis Fundamental' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             <div className="bg-slate-900 border border-slate-800 rounded-3xl p-24 text-center shadow-2xl">
               <div className="text-slate-800 text-6xl font-black mb-6">MÓDULO</div>
               <p className="text-slate-500 text-xs tracking-widest uppercase font-bold">En desarrollo</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
