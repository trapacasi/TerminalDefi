"use client";
import React, { useState } from 'react';
import * as Tabs from "@radix-ui/react-tabs";
import { Search, TrendingUp, BarChart3, BookOpen, ShieldCheck, Zap } from "lucide-react";

export default function Dashboard() {
const [mainToken, setMainToken] = useState('');
const [price, setPrice] = useState<number | null>(null);
const [loading, setLoading] = useState(false);

const [sma20, setSma20] = useState(null);
const [sma40, setSma40] = useState(null);
const [etapa, setEtapa] = useState('Esperando datos...');

const [checklist, setChecklist] = useState<boolean[]>(new Array(12).fill(false));

const toggleCheck = (index: number) => {
const newChecklist = [...checklist];
newChecklist[index] = !newChecklist[index];
setChecklist(newChecklist);
};

const analizarToken = async () => {
if (!mainToken) return;
setLoading(true);
try {
const res = await fetch('/api/prices?token=' + mainToken.toLowerCase() + '&days=60');
const data = await res.json();
if (data && data.length > 0) {
const validPrices = data.map((d) => d.price);
const currentPrice = validPrices[validPrices.length - 1];
setPrice(currentPrice);
if (validPrices.length >= 40) {
const last20 = validPrices.slice(-20);
const last40 = validPrices.slice(-40);
const calcMMS20 = last20.reduce((a, b) => a + b, 0) / 20;
const calcMMS40 = last40.reduce((a, b) => a + b, 0) / 40;
setSma20(calcMMS20);
setSma40(calcMMS40);
if (calcMMS20 > calcMMS40 && currentPrice > calcMMS20) {
setEtapa('ETAPA 2 (Alcista)');
} else if (calcMMS20 < calcMMS40 && currentPrice < calcMMS20) {
setEtapa('ETAPA 4 (Bajista)');
} else if (currentPrice > calcMMS20 && calcMMS20 < calcMMS40) {
setEtapa('ETAPA 1 (Base/Acumulación)');
} else {
setEtapa('ETAPA 3 (Distribución)');
}
}
}
} catch (error) {
console.error('Error');
}
setLoading(false);
};
if (!mainToken) return;
setLoading(true);
try {
const res = await fetch('/api/prices?token=' + mainToken.toLowerCase());
const data = await res.json();
if (data && data.length > 0) {
setPrice(data[data.length - 1].price);
}
} catch (error) {
console.error("Error obteniendo precio");
}
setLoading(false);
};

const pabloReportItems = [
"1. Información Básica (Ticker, Narrativa)",
"2. Métricas y Datos Financieros (Market Cap, FDV)",
"3. Tokenomics y Distribución (Unlocks)",
"4. Utilidad del Token (Gobernanza, Fees)",
"5. Actividad del Ecosistema (TVL, DApps)",
"6. Competencia y Posicionamiento",
"7. Comunidad y Redes Sociales",
"8. Roadmap y Desarrollo (GitHub)",
"9. Análisis de Seguridad (Auditorías, Rug pull)",
"10. Narrativa de Mercado",
"11. Datos Complementarios (DefiLlama, Glassnode)",
"12. Estrategia Personal (Riesgo/Recompensa)"
];

return (
<div className="min-h-screen p-4 md:p-8 font-sans text-slate-900 bg-[#F8FAFC]">
<header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 gap-4">
<div className="flex items-center gap-3">
<div className="bg-blue-600 p-2 rounded-2xl text-white">
<TrendingUp size={28} />
</div>
<div>
<h1 className="text-2xl font-black tracking-tight uppercase">Pablo Terminal Pro</h1>
<p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Web3 Intelligence</p>
</div>
</div>
<div className="flex gap-3 w-full md:w-auto">
<div className="relative flex-grow">
<Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
<input
value={mainToken}
onChange={(e) => setMainToken(e.target.value)}
className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
placeholder="Ej: solana, jupiter..."
/>
</div>
<button
onClick={analizarToken}
className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center min-w-[120px]"
>
{loading ? <span className="animate-pulse">⏳</span> : "Analizar"}
</button>
</div>
</header>

);
}
