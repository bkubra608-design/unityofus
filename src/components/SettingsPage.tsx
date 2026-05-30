import React from "react";
import { 
  Settings, Database, Shield, Wifi, WifiOff, RefreshCcw, 
  Trash2, User, Key, CheckCircle, Info, Lock, Eye
} from "lucide-react";
import { UserSession, UserRole } from "../types";

interface SettingsPageProps {
  currentSession: UserSession;
  onChangeUserRole: (role: UserRole) => void;
  onClearDatabase: () => void;
  isOfflineMode: boolean;
  onToggleOffline: () => void;
  offlineBufferCount: number;
}

export default function SettingsPage({
  currentSession,
  onChangeUserRole,
  onClearDatabase,
  isOfflineMode,
  onToggleOffline,
  offlineBufferCount
}: SettingsPageProps) {
  
  // Roles Matrix configuration for clinical safety checks
  const rolesInfo = [
    {
      role: "Worker" as UserRole,
      title: "Health Worker",
      desc: "Fast register intakes, run queue lookups, and schedule SMS queues.",
      perms: ["Register profile", "SMS templates"]
    },
    {
      role: "Nurse" as UserRole,
      title: "Field Nurse",
      desc: "Administer clinical shots, verify vial barcode safety, and sign off patient cards.",
      perms: ["Register profile", "SMS templates", "Inject shots", "Verify barcodes"]
    },
    {
      role: "Supervisor" as UserRole,
      title: "Regional Supervisor",
      desc: "Audit refrigerator temperatures, review shift checkout logs, sign shift variances.",
      perms: ["Register profile", "SMS templates", "Inject shots", "Verify barcodes", "Uptime check", "Sign variance signature"]
    },
    {
      role: "Administrator" as UserRole,
      title: "System Administrator",
      desc: "All permissions. Clear cold warehouse records, database wipe, profile management.",
      perms: ["Register profile", "SMS templates", "Inject shots", "Verify barcodes", "Uptime check", "Sign variance signature", "Database reset"]
    }
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Intro Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
        <h1 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
          <Settings size={20} className="text-blue-500" /> Executive Node Console & Configuration
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage local digital session variables, configure role permissions, or test mobile outreach offline capability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Hand: User profile & Outreach simulator */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active health node profile */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-display pb-2 border-b border-slate-50">
              Active Security Node Profile
            </h3>

            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 text-white font-bold text-base flex items-center justify-center shrink-0">
                {currentSession.fullName.charAt(0)}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900">{currentSession.fullName}</h4>
                <p className="text-xs text-slate-400">Security Clearance: <strong className="text-slate-700">{currentSession.role}</strong></p>
                <p className="text-[10px] text-slate-400 font-mono">Hub Unit: {currentSession.facilityCode} • {currentSession.district}</p>
              </div>
            </div>

            {/* Quick role changer dropdown selector */}
            <div className="space-y-1.5 pt-3 border-t border-slate-100">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase block">Switch Active Simulation Credentials</label>
              <select
                id="role-credential-changer"
                value={currentSession.role}
                onChange={(e) => onChangeUserRole(e.target.value as UserRole)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:bg-white focus:border-blue-500"
              >
                <option value="Worker">Health Worker</option>
                <option value="Nurse">Field Nurse</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Administrator">Administrator</option>
              </select>
            </div>
          </div>

          {/* Outreach telemetry offline simulator */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-display">
                Outreach Outreach Off-grid Simulator
              </h3>
              <span className={`w-2.5 h-2.5 rounded-full inline-block ${
                isOfflineMode ? "bg-red-500 glow-danger" : "bg-emerald-500 glow-success"
              }`} />
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-display">
              Test remote mountains campaigns with zero cellular signal. Registered children and logged dosages remain safely cached inside local sandboxed buckets and synchronize cleanly when signal triggers back on.
            </p>

            {/* Offline state widget controls */}
            <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  {isOfflineMode ? (
                    <><WifiOff size={14} className="text-red-500 animate-pulse" /> Mobile Outreach Disconnected</>
                  ) : (
                    <><Wifi size={14} className="text-emerald-500" /> High-Speed Cloud Connected</>
                  )}
                </span>
                
                {isOfflineMode && (
                  <span className="text-[10px] text-slate-400 font-medium block">
                    Caches/Buffered entries queue: <strong>{offlineBufferCount} actions pending</strong>
                  </span>
                )}
              </div>

              <button
                id="btn-toggle-outreach-wifi"
                onClick={onToggleOffline}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg cursor-pointer transition ${
                  isOfflineMode 
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {isOfflineMode ? "Trigger Go Online (Sync)" : "Trigger Go Offline"}
              </button>
            </div>
          </div>

          {/* Critical Administration Actions */}
          {currentSession.role === "Administrator" && (
            <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm space-y-3.5">
              <h3 className="text-xs font-bold text-rose-700 uppercase tracking-widest font-display pb-2 border-b border-rose-50">
                Critical Operations Clearance
              </h3>
              
              <p className="text-xs text-slate-500 leading-relaxed font-display">
                Administrator only: wipe and flush local browser database modifications, restoring standard diagnostic seed children and inventory counts directly.
              </p>

              <button
                id="btn-reset-db-wipe"
                onClick={onClearDatabase}
                className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg cursor-pointer transition border border-dashed border-rose-200 flex items-center justify-center gap-1.5"
              >
                <Trash2 size={13} /> Reset Browser Local DB back to seed
              </button>
            </div>
          )}

        </div>

        {/* Right Hand: Roles matrix checklist */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-display pb-2 border-b border-slate-50">
            Government Security Credentials Matrix
          </h3>

          <div className="space-y-4">
            {rolesInfo.map((info) => {
              const isSelected = info.role === currentSession.role;
              return (
                <div 
                  key={info.role}
                  className={`p-4 rounded-xl border transition-all ${
                    isSelected 
                      ? "bg-slate-50 border-blue-400 outline outline-4 outline-blue-50/15" 
                      : "bg-white border-slate-100"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-extrabold text-slate-800 font-display flex items-center gap-1.5">
                        {info.title}
                        {isSelected && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[8px] font-bold">
                            Active User Credentials
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-400">{info.desc}</p>
                    </div>
                    
                    <Lock size={12} className={isSelected ? "text-blue-500" : "text-slate-300"} />
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {info.perms.map((p) => (
                      <span 
                        key={p} 
                        className={`text-[9px] font-mono p-1 px-2 rounded-md ${
                          isSelected ? "bg-blue-100/50 text-blue-800 font-semibold" : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        ✔ {p}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
