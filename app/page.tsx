use client";
import React from 'react';
import * as Tabs from "@radix-ui/react-tabs";
import { TrendingUp, BarChart3, ShieldCheck, Zap } from "lucide-react";
export default function Dashboard() {
return (
<div className="min-h-screen p-8 bg-[#F8FAFC]">
<header className="flex justify-between items-center mb-8 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
<div className="flex items-center gap-3">
<div className="bg-blue-600 p-2 rounded-2xl text-white"><TrendingUp size={28} /></div>
<h1 className="text-2xl font-black text-slate-800">Pablo Terminal Pro</h1>
</div>
<div className="flex gap-3">
<input className="pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" placeholder="Token (ej: JUP)..." />
<button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold">Analizar</button>
</div>
</header>
<Tabs.Root defaultValue="tecnico">
<Tabs.List className="bg-white p-2 rounded-[1.5rem] mb-8 border border-slate-100 inline-flex gap-2">
<Tabs.Trigger value="lp" className="px-6 py-3 rounded-xl font-bold data-[state=active]:bg-blue-50">LP Strategy</Tabs.Trigger>
<Tabs.Trigger value="tecnico" className="px-6 py-3 rounded-xl font-bold data-[state=active]:bg-blue-50">Power 4 Swing</Tabs.Trigger>
<Tabs.Trigger value="fundamental" className="px-6 py-3 rounded-xl font-bold data-[state=active]:bg-blue-50">Pablo Report</Tabs.Trigger>
</Tabs.List>
<Tabs.Content value="tecnico">
<div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
<h2 className="text-3xl font-black mb-2">Metodología Power 4</h2>
<p className="text-slate-400 font-bold text-xs uppercase mb-8 tracking-widest">Semanal (Ref) | Diario (Op) - Cierre 01:00 AM</p>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
<div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 text-emerald-700">
<p className="text-xs font-black uppercase mb-2">MMS 20</p>
<p className="text-2xl font-black italic">ETAPA 2 (ALCISTA)</p>
</div>
<div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 text-blue-700">
<p className="text-xs font-black uppercase mb-2">Tendencia</p>
<p className="text-2xl font-black italic uppercase">ATAQUE</p>
</div>
</div>
</div>
</Tabs.Content>
</Tabs.Root>
</div>
);
}
