"use client";
import React, { useState } from 'react';
import * as Tabs from "@radix-ui/react-tabs";
import { Search, TrendingUp, BarChart3, BookOpen, ShieldCheck, Zap } from "lucide-react";

export default function Dashboard() {
const [mainToken, setMainToken] = useState('');
const [price, setPrice] = useState(null);
const [loading, setLoading] = useState(false);

const [sma20, setSma20] = useState(null);
const [sma40, setSma40] = useState(null);
const [etapa, setEtapa] = useState('Esperando datos...');

const [checklist, setChecklist] = useState(new Array(12).fill(false));

const toggleCheck = (index) => {
const newChecklist = [...checklist];
newChecklist[index] = !newChecklist[index];
setChecklist(newChecklist);
};

const generarPrompt = () => {
const tokenName = mainToken ? mainToken.toUpperCase() : "el token seleccionado";
const promptText = `Actua como un analista experto de criptomonedas y Web3. Realiza una auditoria profunda y exhaustiva del token ${tokenName} siguiendo estrictamente el formato del "Pablo Report". No te limites a dar definiciones genericas; proporciona datos reales, metricas actuales y un analisis critico para cada uno de los siguientes 12 puntos:

Informacion Basica: Ticker, narrativa principal y problema exacto que resuelve en la blockchain.

Metricas y Datos Financieros: Precio actual, Market Cap, Fully Diluted Valuation (FDV) y ratio Market Cap/FDV. Indica si esta sobrevalorado.

Tokenomics y Distribucion: Supply maximo y circulante, inflacion programada, proximos unlocks importantes y distribucion inicial (equipo vs comunidad).

Utilidad del Token: ¿Para que sirve realmente? (Gobernanza, pago de fees, staking, mecanismos deflacionarios o de quema).

Actividad del Ecosistema: Total Value Locked (TVL), volumen de transacciones, usuarios activos diarios y principales DApps construidas.

Competencia y Posicionamiento: Principales competidores en su sector y sus ventajas/desventajas competitivas reales.

Comunidad y Redes Sociales: Sentimiento general, crecimiento en Twitter/Discord, y nivel de engagement organico (detectar si hay exceso de bots).

Roadmap y Desarrollo: Frecuencia de commits en GitHub, numero de desarrolladores activos y nivel de cumplimiento de hitos pasados.

Analisis de Seguridad: Auditorias realizadas (CertiK, Hacken, etc.), vulnerabilidades pasadas y riesgo de rug pull o excesiva concentracion en top wallets.

Narrativa de Mercado: ¿Esta alineado con narrativas fuertes actuales (IA, RWA, DePIN, etc.)? ¿Hay catalizadores en el corto/medio plazo?

Datos Complementarios: Metricas clave de herramientas on-chain como DefiLlama o Glassnode que aporten valor al analisis.

Estrategia Personal: Perfil de riesgo global del proyecto y zonas historicas de soporte/resistencia clave.

INSTRUCCION FINAL OBLIGATORIA:
Al final de tu analisis, incluye una conclusion clara con dos notas del 1 al 10 (siendo 1 una trampa de liquidez/mala inversion y 10 una oportunidad extraordinaria):

Nota para HOLDERS (Inversion a largo plazo, ponderando fundamentales, tokenomics y seguridad).

Nota para ESPECULADORES (Swing Trading / Corto plazo, ponderando momentum, narrativas y liquidez).`;

navigator.clipboard.writeText(promptText);
alert("¡Mega-Prompt del Pablo Report copiado al portapapeles! Pegalo en ChatGPT, Claude o tu IA favorita.");
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
      setEtapa("ETAPA 2 (Alcista)");
    } else if (calcMMS20 < calcMMS40 && currentPrice < calcMMS20) {
      setEtapa("ETAPA 4 (Bajista)");
    } else if (currentPrice > calcMMS20 && calcMMS20 < calcMMS40) {
      setEtapa("ETAPA 1 (Base/Acumulacion)");
    } else {
      setEtapa("ETAPA 3 (Distribucion)");
    }
  } else {
    setEtapa("Datos insuficientes (minimo 40 dias)");
  }
}
} catch (error) {
console.error("Error obteniendo precio");
}
setLoading(false);
};

const pabloReportItems = [
"1. Informacion Basica (Ticker, Narrativa)",
"2. Metricas y Datos Financieros (Market Cap, FDV)",
"3. Tokenomics y Distribucion (Unlocks)",
"4. Utilidad del Token (Gobernanza, Fees)",
"5. Actividad del Ecosistema (TVL, DApps)",
"6. Competencia y Posicionamiento",
"7. Comunidad y Redes Sociales",
"8. Roadmap y Desarrollo (GitHub)",
"9. Analisis de Seguridad (Auditorias, Rug pull)",
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
placeholder="Ej: solana, bitcoin..."
/>
</div>
<button
onClick={analizarToken}
className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center min-w-[120px]"
>
{loading ? "Calculando..." : "Analizar"}
</button>
</div>
</header>

<Tabs.Root defaultValue="fundamental" className="w-full">
  <Tabs.List className="bg-white p-2 rounded-[1.5rem] mb-8 border border-slate-100 shadow-sm inline-flex gap-2 overflow-x-auto max-w-full">
    <Tabs.Trigger value="lp" className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-slate-500 whitespace-nowrap"><BarChart3 size={20}/> Estrategia de Liquidez</Tabs.Trigger>
    <Tabs.Trigger value="tecnico" className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-slate-500 whitespace-nowrap"><Zap size={20}/> Análisis Técnico</Tabs.Trigger>
    <Tabs.Trigger value="fundamental" className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold text-slate-500 whitespace-nowrap"><ShieldCheck size={20}/> Análisis Fundamental</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content value="tecnico" className="focus:outline-none">
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black mb-1">Análisis Técnico (Power 4)</h2>
          <p className="text-slate-400 font-bold text-xs uppercase">Ref: Semanal | Op: Diario (Cierre 01:00 AM)</p>
        </div>
        {price && (
          <div className="text-left md:text-right bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <p className="text-sm font-bold text-blue-400 uppercase">Precio Actual</p>
            <p className="text-3xl font-black text-blue-700">${price.toFixed(4)}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 relative overflow-hidden group">
          <p className="text-xs font-black text-slate-500 uppercase mb-2">Deteccion de Etapa</p>
          <p className="text-2xl md:text-3xl font-black italic uppercase mb-4 text-slate-700">
            {etapa}
          </p>
          {sma20 && sma40 && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-600"><strong>MMS20:</strong> ${sma20.toFixed(4)}</p>
              <p className="text-sm font-medium text-slate-600"><strong>MMS40:</strong> ${sma40.toFixed(4)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </Tabs.Content>

  <Tabs.Content value="fundamental" className="focus:outline-none">
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-black flex items-center gap-3"><BookOpen size={28} className="text-blue-600"/> Análisis Fundamental (12 Puntos)</h2>
        <button onClick={generarPrompt} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 text-sm shadow-md">
          Generar Prompt Maestro
        </button>
      </div>
      <div className="grid gap-3">
        {pabloReportItems.map((item, idx) => (
          <div 
            key={idx} 
            onClick={() => toggleCheck(idx)}
            className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${checklist[idx] ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}
          >
            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${checklist[idx] ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'}`}>
              {checklist[idx] && <span className="text-white text-sm font-bold">V</span>}
            </div>
            <span className={`font-bold ${checklist[idx] ? 'text-blue-900' : 'text-slate-600'}`}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  </Tabs.Content>

  <Tabs.Content value="lp" className="focus:outline-none">
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <h2 className="text-2xl font-black mb-6">Estrategia de Liquidez</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" placeholder="Token A (ej: solana)" />
        <div className="flex items-center justify-center font-black text-slate-300">VS</div>
        <input className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" placeholder="Token B (ej: jupiter-exchange-solana)" />
        <button className="bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-700 transition-all active:scale-95">Calcular Correlacion</button>
      </div>
      <div className="h-64 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 font-medium">
        Esperando tokens para cruzar graficos...
      </div>
    </div>
  </Tabs.Content>
</Tabs.Root>
</div>
);

}
