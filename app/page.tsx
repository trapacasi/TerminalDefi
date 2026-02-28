"use client";
import React, { useState } from 'react';
import * as Tabs from "@radix-ui/react-tabs";
import { Search, TrendingUp, BarChart3, BookOpen, ShieldCheck, Zap, Loader2 } from "lucide-react";

export default function Dashboard() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[] | null>(null);

  const handleAnalyze = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Llamamos a tu nueva API
      const response = await fetch(`/api/prices?token=${token.toLowerCase()}`);
      const prices = await response.json();
      setData(prices);
    } catch (error) {
      console.error("Error analizando:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#F8FAFC] font-sans text-slate-900">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-2xl text-white"><TrendingUp size={28} /></div>
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase">Pablo Terminal Pro</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Web3 Intelligence</p>
          </div>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" 
              placeholder="ID de CoinGecko (ej: solana, jupiter-exchange-solana)..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
          <button 
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Analizar'}
          </button>
        </div>
      </header>

      <Tabs.Root defaultValue="tecnico" className="w-full">
        <Tabs.List className="bg-white p-2 rounded-[1.5rem] mb-8 border border-slate-100 shadow-sm inline-flex gap-2 overflow-x-auto max-w-full">
          <Tabs.Trigger value="lp" className="px-6 py-3 rounded-xl transition-all data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-slate-500">LP Strategy</Tabs.Trigger>
          <Tabs.Trigger value="tecnico" className="px-6 py-3 rounded-xl transition-all data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-slate-500">Power 4 Swing</Tabs.Trigger>
          <Tabs.Trigger value="fundamental" className="px-6 py-3 rounded-xl transition-all data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-slate-500">Pablo Report</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="tecnico">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h2 className="text-3xl font-black mb-1">Análisis Power 4</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] mb-8">Ref: Semanal | Op: Diario (Cierre 01:00 AM)</p>
            
            {!data ? (
              <div className="text-center py-20 text-slate-300 font-bold italic">Busca un token para ver la etapa actual...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100">
                  <p className="text-xs font-black text-emerald-600 uppercase mb-2">Detección de Etapa</p>
                  <p className="text-4xl font-black text-emerald-700 italic">ETAPA 2</p>
                  <p className="text-sm text-emerald-600 font-bold mt-4 italic">"MMS20 y MMS40 alcistas. Superando máximos previos."</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <p className="text-xs font-black text-slate-400 uppercase mb-2">Precio Actual</p>
                  <p className="text-4xl font-black text-slate-800">${data[data.length - 1].price.toFixed(2)}</p>
                </div>
              </div>
            )}
          </div>
        </Tabs.Content>

        <Tabs.Content value="fundamental">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm max-w-4xl">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3"><BookOpen className="text-blue-600" /> Checklist Fundamental</h2>
            <div className="grid gap-4">
              {['MC / FDV', 'Tokenomics', 'Seguridad', 'Equipo', 'Narrativa'].map((item) => (
                <div key={item} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all">
                  <div className="w-6 h-6 rounded-lg border-2 border-slate-200 group-hover:border-blue-500 flex items-center justify-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <span className="font-bold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
