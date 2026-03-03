"use client";

import { useEffect, useState, useRef } from 'react';

// Interfaz de datos
interface TokenData {
  symbol: string;
  currentPrice: number;
  mms20: number;
  mms40: number;
  mms200: number;
  stage: string;
  distanceToMMS20: number;
}

const TOKEN_LIST = [
  { name: 'Bitcoin', symbol: 'BTC/USDT', logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
  { name: 'Ethereum', symbol: 'ETH/USDT', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { name: 'Solana', symbol: 'SOL/USDT', logo: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
  { name: 'Aave', symbol: 'AAVE/USDT', logo: 'https://cryptologos.cc/logos/aave-aave-logo.png' },
  { name: 'Uniswap', symbol: 'UNI/USDT', logo: 'https://cryptologos.cc/logos/uniswap-uni-logo.png' },
  { name: 'Chainlink', symbol: 'LINK/USDT', logo: 'https://cryptologos.cc/logos/chainlink-link-logo.png' },
  { name: 'Polkadot', symbol: 'DOT/USDT', logo: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png' },
  { name: 'Polygon', symbol: 'MATIC/USDT', logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png' },
];

function TokenSearch({ value, onChange, label }: { value: string, onChange: (val: string) => void, label: string }) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = TOKEN_LIST.filter(t => 
    t.symbol.toLowerCase().includes(query.toLowerCase()) || 
    t.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    // Solo se ejecuta en el cliente, evitando el error de Build que vimos en el PDF
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block ml-1 tracking-widest">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          className="w-full bg-slate-900 border border-slate-800 p-3.5 rounded-xl text-white font-bold outline-none focus:border-indigo-500 transition-all text-sm"
          placeholder="Buscar activo..."
        />
      </div>
      
      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
          {filtered.map(t => (
            <div 
              key={t.symbol}
              onClick={() => { onChange(t.symbol); setQuery(t.symbol); setIsOpen(false); }}
              className="flex items-center p-4 hover:bg-indigo-600 cursor-pointer border-b border-slate-800/50 last:border-0"
            >
              <img src={t.logo} alt="" className="w-5 h-5 mr-4 rounded-full bg-white p-0.5" />
              <div className="flex flex-col">
                <span className="text-white text-sm font-bold">{t.symbol}</span>
                <span className="text-slate-500 text-[10px] uppercase font-medium">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Análisis Técnico');
  const [tokenTech, setTokenTech] = useState('BTC/USDT');
  const [tokenLiqA, setTokenLiqA] = useState('BTC/USDT');
  const [tokenLiqB, setTokenLiqB] = useState('ETH/USDT');
  const [techData, setTechData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Evitamos errores de hidratación asegurando que el componente esté montado
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || activeTab !== 'Análisis Técnico') return;
    async function fetchTechData() {
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await fetch(`/api/report?symbol=${tokenTech.replace('/', '')}`);
        const json = await res.json();
        if (json.data) setTechData(json.data[0]);
        else setErrorMsg(json.error);
      } catch (e) { setErrorMsg("Error Hub"); }
      finally { setLoading(false); }
    }
    fetchTechData();
  }, [tokenTech, activeTab, mounted]);

  if (!mounted) return <div className="min-h-screen bg-slate-950" />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 border-b border-slate-800 pb-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">PABLO TERMINAL <span className="text-indigo-500">PRO</span></h1>
            <p className="text-slate-600 text-[10px] tracking-[0.3em] uppercase font-bold mt-1">Institutional Data Access</p>
          </div>
          <div className="text-right hidden md:block">
             <div className="text-green-500 text-[10px] font-bold animate-pulse">● SYSTEMS ONLINE</div>
          </div>
        </header>

        <nav className="flex gap-2 mb-10 bg-slate-900/40 p-1.5 rounded-2xl border border-slate-800 w-fit">
          {['Estrategia de Liquidez', 'Análisis Técnico', 'Análisis Fundamental'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
              {tab}
            </button>
          ))}
        </nav>

        {activeTab === 'Análisis Técnico' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-8">
                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Power 4 Scanner</h2>
                <div className="w-full lg:w-80">
                  <TokenSearch label="Activo" value={tokenTech} onChange={setTokenTech} />
                </div>
              </div>

              {loading ? (
                <div className="py-20 text-center text-slate-600 text-xs tracking-widest uppercase animate-pulse">Analizando Bloques...</div>
              ) : techData ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-2">Precio</p>
                    <p className="text-2xl font-mono text-white">${techData.currentPrice.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-2">Etapa</p>
                    <div className="text-indigo-400 font-black text-xl">{techData.stage}</div>
                  </div>
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-2">MM20</p>
                    <p className="text-xl font-mono text-slate-400">${techData.mms20.toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-2">Gap %</p>
                    <p className={`text-xl font-mono ${techData.distanceToMMS20 > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {techData.distanceToMMS20.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {activeTab === 'Estrategia de Liquidez' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <h2 className="text-xl font-bold text-white mb-8 uppercase tracking-tight">Liquidity Matrix</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end mb-10">
                <TokenSearch label="Token A" value={tokenLiqA} onChange={setTokenLiqA} />
                <TokenSearch label="Token B" value={tokenLiqB} onChange={setTokenLiqB} />
              </div>
              <div className="p-20 border-2 border-dashed border-slate-800 rounded-3xl text-center">
                <p className="text-slate-600 text-xs font-bold uppercase tracking-[0.3em]">{tokenLiqA} vs {tokenLiqB}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
