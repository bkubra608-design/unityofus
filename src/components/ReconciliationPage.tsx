import React, { useState, useRef, useEffect } from "react";
import { 
  ClipboardCheck, ShieldAlert, CheckCircle, RefreshCw, 
  Trash2, PenTool, Edit, UserCheck, Eye, LogOut, Check
} from "lucide-react";
import { ReconciliationShift, InventoryBatch, UserSession } from "../types";

interface ReconciliationPageProps {
  inventory: InventoryBatch[];
  currentSession: UserSession;
  onCompleteReconciliation: (shift: any) => void;
}

export default function ReconciliationPage({ 
  inventory, 
  currentSession, 
  onCompleteReconciliation 
}: ReconciliationPageProps) {
  // Inventory items as reference
  const vaccinesList = ["BCG", "OPV", "IPV", "Pentavalent", "Rotavirus", "Measles MR", "PCV Pneumo"];

  // Opening stock (simulated values for EOD checkout)
  const initialOpeningStocks: { [key: string]: number } = {
    "BCG": 450,
    "OPV": 1300,
    "IPV": 25,
    "Pentavalent": 900,
    "Rotavirus": 660,
    "Measles MR": 950,
    "PCV Pneumo": 580
  };

  // Simulated doses logged during shift
  const [administeredQty, setAdministeredQty] = useState<{ [key: string]: number }>({
    "BCG": 30,
    "OPV": 50,
    "IPV": 10,
    "Pentavalent": 50,
    "Rotavirus": 20,
    "Measles MR": 30,
    "PCV Pneumo": 30
  });

  // User input physical checks
  const [physicalCount, setPhysicalCount] = useState<{ [key: string]: number }>({
    "BCG": 420,
    "OPV": 1250,
    "IPV": 15,
    "Pentavalent": 850,
    "Rotavirus": 640,
    "Measles MR": 920,
    "PCV Pneumo": 550
  });

  // Signature canvas setup
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [supervisorName, setSupervisorName] = useState("");
  const [auditNotes, setAuditNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Clear signature canvas
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Set up signature events inside ref
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "#1d4ed8"; // Navy blue ink
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
  }, [isSubmitted]);

  // Handle signature drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const drawSignature = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Physical input changer
  const handlePhysicalChange = (vac: string, val: string) => {
    const num = val === "" ? 0 : Number(val);
    setPhysicalCount(prev => ({ ...prev, [vac]: num }));
  };

  // Administered input changer
  const handleAdministerChange = (vac: string, val: string) => {
    const num = val === "" ? 0 : Number(val);
    setAdministeredQty(prev => ({ ...prev, [vac]: num }));
  };

  // Submit Closure Check-off
  const handleShiftClosureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supervisorName) {
      alert("Supervisor authentication signature requires supervisor name validation.");
      return;
    }

    setIsSubmitted(true);
    
    // Callback mock
    onCompleteReconciliation({
      date: new Date().toISOString().split("T")[0],
      workerName: currentSession.fullName,
      role: currentSession.role,
      supervisorName,
      status: "Approved",
      notes: auditNotes
    });
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Intro Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
        <h1 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
          <ClipboardCheck size={20} className="text-blue-500" /> End-of-Day Shift Stock Reconciliation
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Mandatory closing shift check. Compare opening vial levels with registered clinical POS records to calculate absolute stock variance.
        </p>
      </div>

      {isSubmitted ? (
        <div className="bg-white p-8 rounded-2xl border border-emerald-200 outline outline-4 outline-emerald-50 text-center max-w-xl mx-auto space-y-4">
          <span className="p-4 bg-emerald-500 text-white rounded-full inline-block glow-success">
            <CheckCircle size={36} className="mx-auto" />
          </span>
          <h2 className="text-xl font-bold text-slate-800 font-display">SHIFT RECONCILIATION COMPLETED</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The EOD shift ledger was signed off, reconciled, and audited by Supervisor <strong>{supervisorName}</strong>. 
            All inventory values have been successfully offset and synchronized cleanly with LocalStorage database.
          </p>
          <div className="text-[10px] bg-slate-50 border border-slate-200 text-slate-500 p-3 rounded-lg font-mono">
            ID Code: SHIFT-REC-2026-{Math.floor(1000 + Math.random() * 9000)} • Status: Approved/Locked
          </div>
          <button
            onClick={() => setIsSubmitted(false)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl cursor-pointer transition shadow"
          >
            Open New Idle Ledger
          </button>
        </div>
      ) : (
        <form onSubmit={handleShiftClosureSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Shift Table and counts */}
          <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 font-display">Shift checkout records</h3>
              <span className="text-[10px] text-slate-400 font-mono font-bold">Authorized User Node: {currentSession.fullName} ({currentSession.role})</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px] font-mono">
                    <th className="pb-3 font-semibold">Vaccine Category</th>
                    <th className="pb-3 text-center font-semibold">Opening Stock</th>
                    <th className="pb-3 text-center font-semibold">Administered (-)</th>
                    <th className="pb-3 text-center font-semibold">Expected Vials</th>
                    <th className="pb-3 text-center font-semibold">Physical Count</th>
                    <th className="pb-3 text-right font-semibold">Variance Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/60 font-semibold text-slate-700">
                  {vaccinesList.map(vac => {
                    const opening = initialOpeningStocks[vac] || 0;
                    const admin = administeredQty[vac] || 0;
                    const expected = opening - admin;
                    const physical = physicalCount[vac] || 0;
                    const variance = physical - expected;

                    return (
                      <tr key={vac} className="hover:bg-slate-50/50">
                        <td className="py-3 font-bold text-slate-800">{vac}</td>
                        <td className="py-3 text-center font-mono">
                          {opening}
                        </td>
                        <td className="py-3 text-center font-mono">
                          <input
                            type="number"
                            min="0"
                            value={admin}
                            onChange={(e) => handleAdministerChange(vac, e.target.value)}
                            className="w-14 text-center py-1 bg-slate-50 border border-slate-200 rounded-md font-mono font-bold text-xs focus:bg-white"
                          />
                        </td>
                        <td className="py-3 text-center font-mono text-slate-500">
                          {expected}
                        </td>
                        <td className="py-3 text-center font-mono">
                          <input
                            type="number"
                            min="0"
                            value={physical}
                            onChange={(e) => handlePhysicalChange(vac, e.target.value)}
                            className="w-14 text-center py-1 bg-slate-50 border border-slate-200 rounded-md font-mono font-bold text-xs focus:bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                          />
                        </td>
                        <td className="py-3 text-right font-mono">
                          {variance === 0 ? (
                            <span className="text-emerald-600">0</span>
                          ) : variance > 0 ? (
                            <span className="text-blue-600 font-bold">+{variance}</span>
                          ) : (
                            <span className="text-red-500 font-bold bg-stretch">{variance}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="bg-amber-50 border border-amber-200/50 p-3.5 rounded-xl text-[11px] text-amber-800 leading-relaxed">
              ⚠️ <strong>Audit note</strong>: Any variance other than 0 represents physical vial loss or reporting failure. Please review scan records and verify syringe/vial waste bins prior to supervisor sign-off!
            </div>
          </div>

          {/* Supervisor verification pad */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 font-display flex items-center gap-1.5">
              <UserCheck size={16} className="text-blue-500" /> Supervisor Authorization
            </h3>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">Supervisor Full Name *</label>
                <input
                  id="reconcile-sup-name"
                  type="text"
                  required
                  placeholder="e.g. Dr. Amara Saeed"
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">Supervisor Comments</label>
                <textarea
                  id="reconcile-sup-notes"
                  placeholder="Review findings e.g. checked wastage bins, all codes accounted..."
                  rows={2}
                  value={auditNotes}
                  onChange={(e) => setAuditNotes(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-base text-xs text-slate-700"
                />
              </div>

              {/* Touch signature pad canvas */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Digital Sign-off Inkpad</label>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="text-[9px] font-bold text-rose-500 hover:underline flex items-center"
                  >
                    Clear Slate
                  </button>
                </div>
                
                {/* Touch Signature Canvas pad */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden relative cursor-crosshair">
                  <canvas
                    id="rec-canvas-pad"
                    ref={canvasRef}
                    width="260"
                    height="100"
                    onMouseDown={startDrawing}
                    onMouseMove={drawSignature}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full block bg-slate-50/50"
                  />
                  <div className="absolute bottom-1 right-2 pointer-events-none text-[8px] font-mono text-slate-300">
                    SIGN HERE (MOUSE)
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl cursor-pointer transition shadow flex items-center justify-center gap-1.5"
              >
                <CheckCircle size={13} className="text-emerald-400" /> Reconcile & Verify Shift
              </button>
            </div>
          </div>

        </form>
      )}

    </div>
  );
}
