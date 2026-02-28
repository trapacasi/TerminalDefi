"use client";
import React from 'react';
import * as Tabs from "@radix-ui/react-tabs";
import { Search, TrendingUp, BarChart3, BookOpen, ShieldCheck, Zap } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#F8FAFC] font-sans text-slate-900">
      {/* Header con Buscador Inteligente */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-2xl text-white">
            <TrendingUp size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase">Pablo Terminal Pro</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Web3 Financial Intelligence</p>
          </div>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all" 
              placeholder="Analizar Token (ej: JUP, SOL)..." 
            />
          </div>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all">
            Analizar
          </button>
        </div>
      </header>

      <Tabs.Root defaultValue="tecnico" className="w-full">
        <Tabs.List className="bg-white p-2 rounded-[1.5rem] mb-8 border border-slate-100 shadow-sm inline-flex gap-2 overflow-x-auto max-w-full">
          <Tabs.Trigger value="lp" className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-slate-500 whitespace-nowrap">
            <BarChart3 size={20}/> LP Strategy
          </Tabs.Trigger>
          <Tabs.Trigger value="tecnico" className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-slate-500 whitespace-nowrap">
            <Zap size={20}/> Power 4 Swing
          </Tabs.Trigger>
          <Tabs.Trigger value="fundamental" className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-slate-500 whitespace-nowrap">
            <ShieldCheck size={20}/> Pablo Report
          </Tabs.Trigger>
        </Tabs.List>

        {/* Pestaña de Análisis Técnico por Etapas [cite: 486-489] */}
        <Tabs.Content value="tecnico" className="focus:outline-none">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between mb-8 pb-6 border-b border-slate-50 gap-4">
              <div>
                <h2 className="text-3xl font-black tracking-tight">Metodología Power 4</h2>
                <p className="text-slate-400 font-bold uppercase text-[10px] mt-1 tracking-widest">Ref: Semanal | Op: Diario (Cierre 01:00 AM España)</p>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 flex items-center">
                 <span className="text-blue-600 font-bold text-sm">Corriente del río a favor 🌊</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                <p className="text-xs font-black text-emerald-600 uppercase mb-2 tracking-tighter">Estado MMS 20/40</p>
                <p className="text-3xl font-black text-emerald-700 italic uppercase">Etapa 2</p>
                <p className="text-[10px] text-emerald-600 font-bold mt-2">Mínimos crecientes detectados</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <p className="text-xs font-black text-slate-400 uppercase mb-2">Estrategia Operativa</p>
                <p className="text-3xl font-black text-slate-800 italic uppercase tracking-tighter">Ataque</p>
                <p className="text-[10px] text-slate-500 font-bold mt-2">Alineación semanal/diaria</p>
              </div>
            </div>
          </div>
        </Tabs.Content>

        {/* Pestaña de Auditoría Fundamental [cite: 561-574] */}
        <Tabs.Content value="fundamental" className="focus:outline-none">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm max-w-4xl">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
              <BookOpen className="text-blue-600" size={32} /> Checklist Pablo Report
            </h2>
            <div className="grid gap-4">
              {[
                'Métricas Clave (Market Cap / FDV [cite: 570-571])', 
                'Tokenomics & Calendario de Unlocks [cite: 584-587]', 
                'Análisis de Seguridad y Contrato [cite: 591-594]', 
                'Equipo, Roadmap y Actividad GitHub [cite: 597-600]', 
                'Narrativa, Momentum y Comunidad [cite: 607-610]'
              ].map((item) => (
                <div key={item} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:border-blue-200 transition-all cursor-pointer group">
                  <div className="w-6 h-6 rounded-lg border-2 border-slate-200 group-hover:border-blue-500 transition-colors flex items-center justify-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-sm scale-0 group-hover:scale-100 transition-transform"></div>
                  </div>
                  <span className="font-bold text-slate-700 tracking-tight">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Tabs.Content>

        {/* Espacio para la Calculadora de Impermanent Loss [cite: 431-433] */}
        <Tabs.Content value="lp" className="focus:outline-none">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[500px]">
            <h3 className="text-xl font-bold mb-6 text-center italic">Simulador de IL (Lógica DefiTuna en desarrollo)</h3>
            <div className="h-80 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400">
              Gráfico de Ratio & Pérdida estimada en USD...
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
