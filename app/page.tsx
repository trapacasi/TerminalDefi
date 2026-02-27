"use client";
import React from 'react';
import * as Tabs from "@radix-ui/react-tabs";
import { Search, TrendingUp, BarChart3, BookOpen, ShieldCheck, Zap } from "lucide-react";

export default function Dashboard() {
return (
<div className="min-h-screen p-4 md:p-8 bg-[#F8FAFC]">
<header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 gap-4">
<div className="flex items-center gap-3">
<div className="bg-blue-600 p-2 rounded-2xl text-white"><TrendingUp size={28} /></div>
<div>
<h1 className="text-2xl font-black text-slate-800 tracking-tight">Pablo Terminal Pro</h1>
<p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Análisis Swing & Web3 Intelligence</p>
</div>
</div>
<div className="flex gap-3 w-full md:w-auto">
<div className="relative flex-grow">
<Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
<input className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" placeholder="Token (ej: JUP, SOL)..." />
</div>
<button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all">Analizar</button>
</div>
</header>

);
}
