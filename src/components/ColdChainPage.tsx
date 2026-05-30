import React, { useState } from "react";
import { 
  Thermometer, ShieldAlert, Cpu, Radio, ShieldCheck, 
  TrendingUp, Compass, Plus, Minus, RotateCcw, AlertCircle
} from "lucide-react";
import { ColdChainRefrigerator, TemperatureLog } from "../types";

interface ColdChainPageProps {
  coldChain: ColdChainRefrigerator[];
  onUpdateCoolerTemp: (id: string, newTemp: number) => void;
}

export default function ColdChainPage({ coldChain, onUpdateCoolerTemp }: ColdChainPageProps) {
  const [selectedUnitId, setSelectedUnitId] = useState<string>(coldChain[0]?.id || "");
  const [coolingSystemMode, setCoolingSystemMode] = useState<"Eco" | "Boost" | "Manual">("Eco");

  // Find active unit
  const activeUnit = coldChain.find(u => u.id === selectedUnitId) || coldChain[0];

  // Simulated cooling logs
  const [alertLogs, setAlertLogs] = useState<string[]>([
    "REF-03: Exceeded target parameters by +1.1°C (2026-05-30 07:15:32)",
    "REF-01: Grid failure. Switched cleanly to battery auto backup. (2026-05-29 11:03:10)"
  ]);

  // Adjust temperature manually to test Warning and Critical states
  const adjustTemp = (change: number) => {
    if (!activeUnit) return;
    const newTemp = Math.round((activeUnit.currentTemp + change) * 10) / 10;
    onUpdateCoolerTemp(activeUnit.id, newTemp);

    // Dynamic warning alert logger trigger
    if (newTemp > activeUnit.targetTempRange.max) {
      setAlertLogs(prev => [
        `⚠️ Alert [Critical]: ${activeUnit.id} (${activeUnit.name}) temperature is ${newTemp}°C, exceeding safe upper limit of ${activeUnit.targetTempRange.max}°C!`,
        ...prev
      ]);
    } else if (newTemp < activeUnit.targetTempRange.min) {
      setAlertLogs(prev => [
        `❄️ Alert [Critical]: ${activeUnit.id} (${activeUnit.name}) temperature dropped to ${newTemp}°C, below safe freezing margin of ${activeUnit.targetTempRange.min}°C!`,
        ...prev
      ]);
    }
  };

  // Safe reset to normal
  const resetNormal = () => {
    if (!activeUnit) return;
    const targetMid = (activeUnit.targetTempRange.min + activeUnit.targetTempRange.max) / 2;
    onUpdateCoolerTemp(activeUnit.id, Math.round(targetMid * 10) / 10);
    setAlertLogs(prev => [
      `✔️ Health Restore: ${activeUnit.name} climate values re-certified under medical standards.`,
      ...prev
    ]);
  };

  // Sparkline generator
  const sparklineData = [4.1, 4.3, 4.2, 4.0, 4.5, 4.2, 4.6, 4.4, activeUnit ? activeUnit.currentTemp : 4.2];
  const minTemp = Math.min(...sparklineData);
  const maxTemp = Math.max(...sparklineData);
  const range = (maxTemp - minTemp) || 1;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Overview upper brand card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
            <Thermometer size={20} className="text-blue-500" /> WHO-Approved Cold Chain Monitoring
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict subzero control of Sabin Oral Polio formulations to maintain sterile clinical protection layers.
          </p>
        </div>
        
        <div className="flex gap-2">
          {["Eco", "Boost", "Manual"].map(m => (
            <button
              key={m}
              onClick={() => setCoolingSystemMode(m as any)}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg cursor-pointer border transition-all ${
                coolingSystemMode === m 
                  ? "bg-slate-900 border-slate-900 text-white shadow-xs" 
                  : "bg-white border-slate-200 text-slate-500 hover:text-slate-800"
              }`}
            >
              {m} Mode
            </button>
          ))}
        </div>
      </div>

      {/* Grid structure: Unit Selector and Thermometer dial controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Unit Selector list */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block font-display">Refrigerator Units</h3>
          
          <div className="space-y-3">
            {coldChain.map(unit => {
              const isActive = unit.id === selectedUnitId;
              const isSafe = unit.status === "Safe";
              const isWarning = unit.status === "Warning";

              return (
                <div
                  key={unit.id}
                  onClick={() => setSelectedUnitId(unit.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isActive 
                      ? "bg-blue-50/60 border-blue-400" 
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200/50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{unit.name}</h4>
                      <code className="text-[10px] text-slate-400 font-mono">ID: {unit.id}</code>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${
                      isSafe ? "bg-emerald-500 glow-success" : isWarning ? "bg-amber-400 glow-warning" : "bg-rose-500 glow-danger"
                    }`} />
                  </div>

                  <div className="flex justify-between pt-2 border-t border-slate-200/40 text-[11px] font-mono text-slate-500">
                    <span>Power: {unit.powerStatus}</span>
                    <span className={`font-bold ${
                      isSafe ? "text-emerald-600" : isWarning ? "text-amber-500" : "text-rose-500"
                    }`}>{unit.currentTemp}°C</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current climate monitoring & dial controls */}
        {activeUnit && (
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 block">Active diagnostic node</span>
                <h3 className="text-base font-bold text-slate-800 font-display">{activeUnit.name}</h3>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Cpu size={12} className="text-blue-500" /> Refrigerant Compressor: {activeUnit.refrigerationGas} • Calibration Expiry: {activeUnit.lastMaintained}
                </p>
              </div>

              <div className={`p-2 px-3.5 rounded-xl border shadow-3xs flex items-center gap-2 text-xs font-bold ${
                activeUnit.status === "Safe" 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                  : activeUnit.status === "Warning" 
                    ? "bg-amber-50 text-amber-700 border-amber-100" 
                    : "bg-rose-50 text-rose-700 border-rose-100"
              }`}>
                {activeUnit.status === "Safe" ? (
                  <>🛡️ Health: Safe Compliance</>
                ) : activeUnit.status === "Warning" ? (
                  <>⚠️ Status: Climate Swell Margin</>
                ) : (
                  <>🚨 Danger: EXCEEDED CRITICAL LIMIT</>
                )}
              </div>
            </div>

            {/* Simulated Climate Dial & Thermometer representation */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-center">
              
              {/* Thermic mercury thermometer graphic layout */}
              <div className="sm:col-span-5 text-center flex flex-col items-center">
                <div className="relative w-16 h-52 bg-slate-100 border border-slate-200/80 rounded-full flex flex-col items-center justify-end p-1 shadow-inner">
                  
                  {/* Temp ticks scales */}
                  <div className="absolute right-1 top-4 flex flex-col gap-3 text-[8px] font-mono text-slate-300">
                    <span>15°</span><span>10°</span><span>5°</span><span>0°</span><span>-5°</span><span>-10°</span><span>-20°</span>
                  </div>

                  {/* Reactive Mercury Level column */}
                  {(() => {
                    // Safe scale formula
                    const percent = Math.min(100, Math.max(10, ((activeUnit.currentTemp + 25) / 50) * 100));
                    const isCold = activeUnit.currentTemp <= 0;
                    
                    return (
                      <div 
                        className={`w-4 h-[75%] rounded-t-full transition-all duration-300 ease-out ${
                          activeUnit.status === "Safe" 
                            ? isCold ? "bg-cyan-500" : "bg-emerald-500" 
                            : activeUnit.status === "Warning" ? "bg-amber-400" : "bg-rose-500"
                        }`}
                        style={{ height: `${percent}%` }}
                      />
                    );
                  })()}

                  {/* Mercury bulb bulb */}
                  <div className={`w-8 h-8 rounded-full border border-slate-200/50 shadow-sm mt-0.5 z-10 transition-colors ${
                    activeUnit.status === "Safe" 
                      ? activeUnit.currentTemp <= 0 ? "bg-cyan-500" : "bg-emerald-500" 
                      : activeUnit.status === "Warning" ? "bg-amber-400" : "bg-rose-500"
                  }`} />
                </div>
                <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400 mt-2 block">Mercury scale index</span>
              </div>

              {/* Climate values gauges parameters & Controls */}
              <div className="sm:col-span-7 space-y-5">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-mono">Current Temperature sensor</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-slate-900 tracking-tight font-mono">{activeUnit.currentTemp}°C</span>
                    <span className="text-xs text-slate-400">Target safe parameters: {activeUnit.targetTempRange.min}°C to {activeUnit.targetTempRange.max}°C</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 border border-slate-200/40 rounded-xl">
                    <span className="text-[9px] text-slate-400 uppercase font-mono block">Humidity Level</span>
                    <strong className="text-sm font-bold text-slate-800 block mt-0.5">{activeUnit.humidity}% R.H.</strong>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200/40 rounded-xl">
                    <span className="text-[9px] text-slate-400 uppercase font-mono block">Log Compliance index</span>
                    <strong className="text-sm font-bold text-slate-800 block mt-0.5">{activeUnit.complianceRate}% uptime</strong>
                  </div>
                </div>

                {/* Simulated Climate Dial adjustments */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 uppercase font-display">
                    <span>Compressor Output modifier</span>
                    <span>Manual Override console</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => adjustTemp(-1)}
                      className="flex-1 py-2 bg-slate-100 hover:bg-cyan-100 hover:text-cyan-800 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition"
                    >
                      <Minus size={14} /> Chill Vials (-1.0°C)
                    </button>
                    <button
                      onClick={() => adjustTemp(1)}
                      className="flex-1 py-2 bg-slate-100 hover:bg-amber-100 hover:text-amber-800 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition"
                    >
                      <Plus size={14} /> Warm Vials (+1.0°C)
                    </button>
                    <button
                      onClick={resetNormal}
                      style={{ flex: "0 0 auto" }}
                      className="p-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg cursor-pointer transition"
                      title="Reset Standard Temperature"
                    >
                      <RotateCcw size={14} />
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Sparkline historical fluctuation graph */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
              <div className="flex justify-between text-[11px] font-bold text-slate-600 font-display">
                <span>Fluctuation sparkline history (Last 8 Hours)</span>
                <span>Active polling: 100% calibration matched</span>
              </div>
              
              <div className="h-10 w-full relative pt-2">
                <svg className="w-full h-full" viewBox="0 0 400 40" preserveAspectRatio="none">
                  {(() => {
                    const step = 380 / (sparklineData.length - 1);
                    const coords = sparklineData.map((v, i) => {
                      const x = 10 + i * step;
                      const y = 35 - ((v - minTemp) / range) * 25;
                      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                    }).join(" ");
                    
                    return (
                      <path d={coords} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    );
                  })()}
                </svg>
              </div>
            </div>

            {/* Alert Logs Timeline list */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 font-display">Climate Diagnostics & Alert Logs</h4>
              <div className="bg-slate-950 p-4 rounded-xl font-mono text-[10px] text-zinc-400 space-y-2.5 max-h-[140px] overflow-y-auto border border-slate-800 shadow-inner">
                {alertLogs.map((log, i) => {
                  const isWarning = log.includes("⚠️") || log.includes("REF-03");
                  const isSafe = log.includes("✔️") || log.includes("Clean");
                  return (
                    <div key={i} className={`flex items-start gap-1 ${
                      isWarning ? "text-amber-400" : isSafe ? "text-emerald-400" : "text-zinc-400"
                    }`}>
                      <span className="text-zinc-600 shrink-0 select-none">&gt;&gt;</span>
                      <span>{log}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
