"use client";

import { useEffect, useState, useRef } from 'react';

// Interfaz de datos de tokens
interface TokenData {
  symbol: string;
  currentPrice: number;
  mms20: number;
  mms40: number;
  mms200: number;
  stage: string;
  distanceToMMS20: number;
}

// Lista de tokens con sus logos para el buscador predictivo
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

// Componente de Buscador Predictivo (Autocomplete)
function TokenSearch({ value, onChange, label }: { value: string, onChange: (val: string) => void, label: string }) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = TOKEN_LIST.filter(t => 
    t.symbol.toLowerCase().includes(query.toLowerCase()) || 
    t.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  return (
    <div className="relative flex-1" ref={wrapperRef}>
      <label className="text-[10px] font-black text-slate-500 uppercase mb-1 block ml-1">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl text-white font-bold outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          placeholder="Buscar token..."
        />
        <div className="absolute right-3 top-3 text-slate-600">🔍</div>
      </div>
      
      {isOpen && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto overflow-x-hidden">
          {filtered.map(t => (
            <div 
              key={t.symbol}
              onClick={() => { onChange(t.symbol); setQuery(t.symbol); setIsOpen(false); }}
              className="flex items-center p-3 hover:bg-indigo-600 cursor-pointer transition-colors border-b border-slate-800/50"
            >
              <img src={t.logo} alt={t.name} className="w-6 h-6 mr-3 rounded-full bg-white p-0.5" />
              <div>
                <p className="text-white text-sm font-bold">{t.symbol}</p>
                <p className="text-slate-400 text-[10px] uppercase">{t.name}</p>
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

  useEffect(() => {
    async function fetchTechData() {
      if (activeTab !== 'Análisis Técnico') return;
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await fetch(`/api/report?symbol=${tokenTech.replace('/', '')}`);
        const json = await res.json();
        if (json.data) setTechData(json.data[0]);
        else setErrorMsg(json.error);
      } catch (e) { setErrorMsg("Error de conexión"); }
      finally { setLoading(false); }
    }
    fetchTechData();
  }, [tokenTech, activeTab]);

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
        <header className="mb-8 border-b border-slate-800 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase">PABLO TERMINAL <span className="text-indigo-500">PRO</span></h1>
            <p className="text-slate-500 text-[10px] mt-1 tracking-widest uppercase font-bold">Institutional Intelligence & Power 4</p>
          </div>
          <div className="text-right">
             <span className="text-green-500 text-[10px] font-bold animate-pulse block">● LIVE DATA HUB</span>
             <span className="text-slate-600 text-[10px]">Cierre 01:00 AM ES</span>
          </div>
        </header>

        <div className="flex space-x-1 mb-8 bg-slate-900/50 p-1 rounded-xl border border-slate-800 w-fit">
          {['Estrategia de Liquidez', 'Análisis Técnico', 'Análisis Fundamental'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Análisis Técnico' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-800/50 pb-6">
                <h2 className="text-xl font-bold text-white">Power 4 Lifecycle</h2>
                <div className="w-full md:w-72">
                  <TokenSearch label="Seleccionar Activo" value={tokenTech} onChange={setTokenTech} />
                </div>
              </div>

              {loading ? (
                <div className="py-20 text-center text-slate-500 text-xs tracking-[0.2em] uppercase">Computando Algoritmo...</div>
              ) : techData ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-2">Precio</p>
                    <p className="text-2xl font-mono text-white">${techData.currentPrice.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-2">Etapa</p>
                    <div className={`px-3 py-1 rounded border text-sm font-black inline-block ${getStageColor(techData.stage)}`}>{techData.stage}</div>
                  </div>
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-2">MMS 20</p>
                    <p className="text-xl font-mono text-slate-300">${tech
