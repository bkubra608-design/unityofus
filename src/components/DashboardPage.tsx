import React, { useState } from "react";
import { 
  Users, CheckCircle2, AlertCircle, Package, Timer, 
  TrendingUp, Shield, Activity, RefreshCw, AlertTriangle, ChevronRight
} from "lucide-react";
import { Patient, InventoryBatch, ColdChainRefrigerator, AuditLog } from "../types";

interface DashboardProps {
  patients: Patient[];
  inventory: InventoryBatch[];
  coldChain: ColdChainRefrigerator[];
  auditLogs: AuditLog[];
  onNavigate: (view: string) => void;
}

export default function DashboardPage({ 
  patients, 
  inventory, 
  coldChain, 
  auditLogs,
  onNavigate 
}: DashboardProps) {
  const [selectedTrendPeriod, setSelectedTrendPeriod] = useState<"Monthly" | "Weekly">("Monthly");

  // Calculations
  const totalRegistered = patients.length;
  
  // Fully vaccinated definition for children: completed at least 3 doses
  const fullyVaccinated = patients.filter(p => {
    const completed = p.vaccinations.filter(v => v.status === "Completed").length;
    return completed >= 3;
  }).length;

  const pendingVaccinations = patients.reduce((acc, p) => {
    return acc + p.vaccinations.filter(v => v.status === "Pending").length;
  }, 0);

  const totalStock = inventory.reduce((acc, b) => acc + b.quantityInHand, 0);
  const expiredStock = inventory.reduce((acc, b) => acc + (b.status === "Expired" ? b.quantityInHand : 0), 0);
  
  // Custom disease coverage rate for 12 core diseases
  const diseaseCoverage: { [key: string]: number } = {
    "Polio": 92,
    "Measles": 88,
    "Tuberculosis (BCG)": 95,
    "Hepatitis B": 90,
    "Rotavirus Diarrhea": 84,
    "Pneumococcal": 81,
    "Typhoid": 76,
    "Rubella": 85,
    "Diphtheria": 89,
    "Tetanus": 91,
    "Pertussis": 87,
    "Hib": 88
  };

  const coveragePercentage = Math.round(
    Object.values(diseaseCoverage).reduce((sum, val) => sum + val, 0) / Object.keys(diseaseCoverage).length
  );

  // Statistics for KPIs
  const kpis = [
    {
      id: "registered",
      title: "Total Children Registered",
      value: totalRegistered,
      sub: "Active database profiles",
      color: "text-blue-600 bg-blue-50 border-blue-100",
      icon: Users
    },
    {
      id: "vaccinated",
      title: "Fully Immunized (3+ Doses)",
      value: fullyVaccinated,
      sub: `${Math.round((fullyVaccinated / (totalRegistered || 1)) * 100)}% of registered`,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      icon: CheckCircle2
    },
    {
      id: "pending",
      title: "Pending Doses Required",
      value: pendingVaccinations,
      sub: "Active follow-ups queued",
      color: "text-amber-500 bg-amber-50 border-amber-100",
      icon: Timer
    },
    {
      id: "coverage",
      title: "Global Coverage Rate",
      value: `${coveragePercentage}%`,
      sub: "12 Primary Pathogens Target",
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      icon: Shield
    },
    {
      id: "stock",
      title: "Vials in Temperature-Store",
      value: totalStock.toLocaleString(),
      sub: "Available stock on hand",
      color: "text-sky-600 bg-sky-50 border-sky-100",
      icon: Package
    },
    {
      id: "expired",
      title: "Quarantined / Expired Vials",
      value: expiredStock,
      sub: "Awaiting safe bio-disposal",
      color: expiredStock > 0 ? "text-rose-600 bg-rose-50 border-rose-100" : "text-slate-400 bg-slate-50 border-slate-100",
      icon: AlertCircle
    }
  ];

  // Alerts calculations
  const lowStockBatches = inventory.filter(b => b.status === "Low Stock" || b.quantityInHand < 50);
  const criticalColdUnits = coldChain.filter(r => r.status === "Critical" || r.status === "Warning");

  // Chart rendering components (Custom responsive SVG graphs)
  const monthlyData = [
    { label: "Jan", count: 180 },
    { label: "Feb", count: 240 },
    { label: "Mar", count: 310 },
    { label: "Apr", count: 290 },
    { label: "May", count: 420 },
    { label: "Jun", count: 480 },
    { label: "Jul", count: 510 },
    { label: "Aug", count: 560 }
  ];

  const maxVal = Math.max(...monthlyData.map(d => d.count)) * 1.1;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Upper Brand Intro Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none -mr-10 -mb-10 select-none">
          <Shield size={250} />
        </div>
        <div className="space-y-1 relative z-10">
          <h1 className="text-2xl font-bold font-display" id="dash-main-title">VaccineShield Pro Dashboard</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Live operations portal monitoring 12 vaccine-preventable diseases. Managing patient intake records, cold-chain preservation, and real-time inventory levels.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 relative z-10 w-full md:w-auto">
          <button 
            id="btn-quick-intake"
            onClick={() => onNavigate("patient-intake")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl flex items-center gap-2 cursor-pointer transition shadow-md"
          >
            <Users size={14} /> Registered Intake POS
          </button>
          <button 
            id="btn-scan-vial"
            onClick={() => onNavigate("scanner")}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-xs rounded-xl flex items-center gap-2 cursor-pointer transition"
          >
            <Shield size={14} /> Scan / Verify Vial
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={kpi.id} 
              id={`kpi-${kpi.id}`}
              className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between"
            >
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">{kpi.title}</span>
                <span className={`p-1.5 rounded-lg border ${kpi.color}`}>
                  <Icon size={14} />
                </span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold text-slate-800 tracking-tight block">{kpi.value}</span>
                <span className="text-slate-400 text-[10px] block mt-0.5">{kpi.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Critical Warnings / Active Watch Bar */}
      {(lowStockBatches.length > 0 || criticalColdUnits.length > 0) && (
        <div className="bg-amber-50 border border-amber-200/60 text-amber-900 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-xs">
          <div className="flex gap-3 items-start">
            <span className="p-2 bg-amber-500 text-white rounded-lg block shrink-0 glow-warning">
              <AlertTriangle size={18} />
            </span>
            <div>
              <h4 className="text-sm font-semibold text-amber-950 font-display">Actionable Clinical Alerts</h4>
              <p className="text-xs text-amber-800/80 mt-0.5">
                {lowStockBatches.length > 0 && `${lowStockBatches.length} critical vaccine items have low inventory. `}
                {criticalColdUnits.length > 0 && `${criticalColdUnits.length} temperature monitors reporting abnormal levels.`}
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            {lowStockBatches.length > 0 && (
              <button 
                id="alert-goto-inv"
                onClick={() => onNavigate("inventory")} 
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold rounded-lg cursor-pointer transition shadow-xs"
              >
                Refill Stock
              </button>
            )}
            {criticalColdUnits.length > 0 && (
              <button 
                id="alert-goto-cold"
                onClick={() => onNavigate("cold-chain")} 
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold rounded-lg cursor-pointer transition"
              >
                Inspect Coolers
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SVG Monthly Trends Chart */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center pb-4 border-b border-slate-50 mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-800 font-display">Immunization Throughput Trends</h3>
              <p className="text-xs text-slate-400">Total doses administered over the active monitoring timeline</p>
            </div>
            <div className="flex gap-1.5 bg-slate-100 p-0.5 rounded-lg">
              <button
                onClick={() => setSelectedTrendPeriod("Monthly")}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md cursor-pointer transition-all ${
                  selectedTrendPeriod === "Monthly" 
                    ? "bg-white text-slate-800 shadow-xs" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedTrendPeriod("Weekly")}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md cursor-pointer transition-all ${
                  selectedTrendPeriod === "Weekly" 
                    ? "bg-white text-slate-800 shadow-xs" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Weekly
              </button>
            </div>
          </div>

          {/* Core Custom SVG Line Chart */}
          <div className="relative h-60 w-full mt-2">
            <svg className="w-full h-full" viewBox="0 0 500 220" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Grid Background Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => {
                const y = 20 + p * 160;
                return (
                  <React.Fragment key={idx}>
                    <line x1="30" y1={y} x2="480" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                    <text x="5" y={y + 4} className="fill-slate-400 text-[9px] font-mono">
                      {Math.round(((1 - p) * maxVal)) || 0}
                    </text>
                  </React.Fragment>
                );
              })}

              {/* The Area / Polyline paths */}
              {(() => {
                const stepX = 450 / (monthlyData.length - 1);
                // Map coordinates
                const points = monthlyData.map((d, i) => {
                  const x = 30 + i * stepX;
                  const ratio = d.count / maxVal;
                  const y = 180 - ratio * 160;
                  return { x, y, label: d.label, val: d.count };
                });

                // Path description
                const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
                const areaD = `${pathD} L ${points[points.length - 1].x} 180 L ${points[0].x} 180 Z`;

                return (
                  <>
                    {/* SVG Gradient Area */}
                    <path d={areaD} fill="url(#chartGrad)" />
                    
                    {/* SVG Line */}
                    <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Data circle indicators */}
                    {points.map((p, i) => (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" className="cursor-pointer hover:r-5 transition-all" />
                        
                        {/* Numeric Tooltip on hover simulation */}
                        <text x={p.x} y={p.y - 8} className="fill-slate-700 font-mono text-[9px] text-center font-bold" textAnchor="middle">
                          {p.val}
                        </text>

                        {/* X Axis Labels */}
                        <text x={p.x} y="200" className="fill-slate-400 text-[10px]" textAnchor="middle">
                          {p.label}
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>

          <div className="flex gap-4 border-t border-slate-50 pt-4 text-xs text-slate-500 mt-2">
            <span className="flex items-center gap-1.5 font-medium text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> High-volume active cycles
            </span>
            <span>Monthly coverage of rural mobile sectors showing steady 15% improvement across registered wards.</span>
          </div>
        </div>

        {/* Cold Chain Quick Diagnostics Widget */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Active refrigerator block */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
            <div className="flex justify-between items-center pb-3 border-b border-slate-50 mb-3">
              <h3 className="text-sm font-bold text-slate-800 font-display flex items-center gap-2">
                <Activity size={15} className="text-blue-500" /> Cold Chain Real-time Status
              </h3>
              <button 
                id="dash-goto-cold-chain"
                onClick={() => onNavigate("cold-chain")}
                className="text-[10px] text-blue-600 font-semibold hover:underline flex items-center"
              >
                Manage <ChevronRight size={10} />
              </button>
            </div>

            <div className="space-y-3">
              {coldChain.map((ref) => {
                const isSafe = ref.status === "Safe";
                const isWarning = ref.status === "Warning";
                
                return (
                  <div key={ref.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-slate-800 block text-ellipsis overflow-hidden max-w-[140px] whitespace-nowrap">
                        {ref.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ID: {ref.id} | Powered: {ref.powerStatus}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className={`text-sm font-mono font-bold block ${
                          isSafe ? "text-emerald-600" : isWarning ? "text-amber-500" : "text-rose-500"
                        }`}>
                          {ref.currentTemp}°C
                        </span>
                        <span className="text-[8px] text-slate-400 font-medium block">
                          Range: {ref.targetTempRange.min}..{ref.targetTempRange.max}°C
                        </span>
                      </div>
                      
                      {/* Interactive Visual Status dot */}
                      <span className={`w-2.5 h-2.5 rounded-full block shrink-0 ${
                        isSafe ? "bg-emerald-500 glow-success" : isWarning ? "bg-amber-400 glow-warning" : "bg-rose-500 glow-danger"
                      }`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Disease Coverage list preview */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 font-display mb-3">12 Pathogens Coverage</h3>
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {Object.entries(diseaseCoverage).map(([disease, value]) => (
                <div key={disease} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-medium text-slate-700">
                    <span>{disease}</span>
                    <span className="font-mono text-slate-500">{value}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${value}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Vaccine inventory heat list & audit logs timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-4">
        
        {/* Quick Inventory Stock Map */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex justify-between items-center pb-3 border-b border-slate-50 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 font-display">Preservation Warehouse Assets</h3>
              <p className="text-xs text-slate-400">Total vials, expiration monitoring, and status levels</p>
            </div>
            <button 
              id="dash-goto-inventory"
              onClick={() => onNavigate("inventory")}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Update Storage
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1">
            {inventory.map((batch) => {
              const statusColors = {
                "Safe": "bg-emerald-500",
                "Near Expiry": "bg-amber-400",
                "Expired": "bg-rose-500",
                "Low Stock": "bg-blue-400"
              };
              
              return (
                <div key={batch.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-semibold text-slate-800 truncate block max-w-[125px]">
                      {batch.vaccineName}
                    </span>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${statusColors[batch.status] || "bg-slate-400"}`} />
                  </div>
                  
                  <div className="flex justify-between text-[11px] font-mono text-slate-500">
                    <span>Batch: {batch.id}</span>
                    <span className="font-bold text-slate-700">{batch.quantityInHand} vials</span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-200/50">
                    <span>Expiry: {batch.expiryDate}</span>
                    <span className="px-1.5 py-0.5 rounded bg-white font-medium shadow-2xs border border-slate-200 text-slate-500">
                      {batch.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Security Audit Log Timeline */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-50 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 font-display">Enterprise Security Audit Trail</h3>
                <p className="text-xs text-slate-400">Chronological list of local system authorizations</p>
              </div>
              <button 
                id="dash-goto-audit-logs"
                onClick={() => onNavigate("settings")}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Full Controls
              </button>
            </div>

            <div className="space-y-4 max-h-[260px] overflow-y-auto pr-1">
              {auditLogs.slice(0, 5).map((log) => {
                const formattedTime = new Date(log.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <div key={log.id} className="flex gap-3 items-start text-xs text-slate-600 leading-relaxed border-l-2 border-slate-100 pl-3 relative ml-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 block absolute -left-[5px] top-1.5" />
                    <div className="space-y-0.5 w-full">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800">{log.action}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{formattedTime}</span>
                      </div>
                      <p className="text-slate-500 text-[11px]">{log.details}</p>
                      <div className="flex justify-between text-[9px] text-slate-400 pt-0.5">
                        <span>Authorized By: {log.user} ({log.role})</span>
                        <span>IP: {log.ipAddress}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-500 block leading-relaxed mt-4">
            💻 <strong>Local Database Synchronized</strong>: Offline modifications stored safely inside your sandboxed browser storage. Multi-user role changes logs are tracked.
          </div>
        </div>

      </div>
    </div>
  );
}
