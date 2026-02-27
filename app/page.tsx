"use client";
import React from 'react';
import * as Tabs from "@radix-ui/react-tabs";
import { Search, TrendingUp, BarChart3, BookOpen, ShieldCheck, Zap } from "lucide-react";

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

);
}
