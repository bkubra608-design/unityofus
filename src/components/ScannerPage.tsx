import { useState } from "react";
import { 
  Scan, QrCode, ShieldCheck, AlertCircle, RefreshCw, 
  Search, ShieldAlert, CheckCircle, Tag, Thermometer, Calendar
} from "lucide-react";
import { InventoryBatch } from "../types";

interface ScannerPageProps {
  inventory: InventoryBatch[];
  onAddStock: (batch: InventoryBatch) => void;
}

export default function ScannerPage({ inventory, onAddStock }: ScannerPageProps) {
  const [selectedScanBarcode, setSelectedScanBarcode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scannedBatch, setScannedBatch] = useState<InventoryBatch | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleScanSample = (barcode: string) => {
    setIsScanning(true);
    setScannedBatch(null);
    setErrorMessage("");

    // Simulate standard beep sounds using Web Audio API
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // high tone beep
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      // Audio context might be blocked by browser iframe guidelines, fail gracefully
      console.log("Audio beep failed gracefully: ", e);
    }

    setTimeout(() => {
      setIsScanning(false);
      const match = inventory.find(b => b.barcode === barcode || b.id === barcode);
      
      if (match) {
        setScannedBatch(match);
      } else {
        setErrorMessage(`Security Alert: Scanner scanned barcode "${barcode}" but found no authenticated records in national immunisation catalog!`);
      }
    }, 1200); // 1.2s sweep simulation
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Intro upper Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
        <h1 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
          <Scan size={20} className="text-blue-500" /> Sterile Vial Barcode & QR Verification
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Verify and authenticate vial manufacturing legitimacy, real-time safety thresholds, and quarantine indicators prior to administering any injection doses.
        </p>
      </div>

      {/* Grid: Viewfinder screen and Results display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Glowing Simulated Viewfinder */}
        <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 flex flex-col justify-between items-center text-white relative overflow-hidden h-[420px] shadow-lg">
          
          <div className="w-full flex justify-between items-center z-10">
            <span className="text-[10px] bg-red-600/60 p-1 px-2 rounded-md font-mono text-red-100 animate-pulse flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block" /> SIMULATED RECOG DECK
            </span>
            <span className="text-[10px] text-slate-400 font-semibold font-mono">CAMERA FEED : ACTIVE</span>
          </div>

          {/* Glowing Target Area Sweep */}
          <div className="relative w-64 h-48 border-2 border-slate-700/80 rounded-xl flex items-center justify-center bg-slate-950/40 z-10 transition-colors">
            
            {/* Holographic scanner corners */}
            <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500" />
            <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500" />
            <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500" />
            <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500" />

            {isScanning ? (
              <>
                {/* Horizontal laser laser line sweep */}
                <span className="absolute inset-x-0 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-bounce" />
                <span className="text-xs font-mono text-emerald-400 font-bold tracking-widest animate-pulse">
                  DECODING DATA...
                </span>
              </>
            ) : (
              <div className="text-center space-y-1 p-4">
                <QrCode size={36} className="text-slate-600 mx-auto" />
                <p className="text-[10px] text-slate-500 font-medium">Position vaccine vial barcode in viewfinder field</p>
              </div>
            )}
          </div>

          {/* Quick Select trigger items */}
          <div className="w-full text-center space-y-2 z-10">
            <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block">Select active database vial to mock scanning action</span>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {inventory.slice(0, 4).map(b => (
                <button
                  key={b.id}
                  onClick={() => handleScanSample(b.barcode)}
                  disabled={isScanning}
                  className="px-2.5 py-1 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-[10px] font-mono rounded cursor-pointer transition"
                >
                  [Scan EXP: {b.id}]
                </button>
              ))}
              <button
                onClick={() => handleScanSample("84ffffffff")}
                disabled={isScanning}
                className="px-2.5 py-1 bg-red-950/40 hover:bg-red-900 border border-red-800 text-[10px] font-mono text-red-200 rounded cursor-pointer transition"
              >
                [Scan Bad Code]
              </button>
            </div>
          </div>

          {/* Bottom decorative scan laser grid */}
          <div className="absolute inset-x-0 bottom-0 top-1/2 bg-[radial-gradient(ellipse_at_bottom,_rgba(37,99,235,0.15),_transparent)] pointer-events-none" />
        </div>

        {/* Diagnostic decoded results Panel */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
          
          {isScanning ? (
            <div className="h-full flex flex-col items-center justify-center space-y-3 py-16">
              <RefreshCw size={28} className="text-blue-500 animate-spin" />
              <h3 className="text-sm font-semibold text-slate-700 font-display">Authorizing cryptographic signature</h3>
              <p className="text-[11px] text-slate-400 text-center max-w-sm">Checking barcode UPC matches against the World Health Organization international product verification registries...</p>
            </div>
          ) : errorMessage ? (
            <div className="bg-rose-50 border border-rose-200/60 rounded-xl p-5 text-rose-900 space-y-3 h-full flex flex-col justify-center">
              <span className="p-3 bg-rose-500 text-white rounded-xl inline-block w-fit glow-danger">
                <ShieldAlert size={20} />
              </span>
              <h3 className="text-sm font-bold font-display">UNAUTHENTICATED PRODUCT HALT</h3>
              <p className="text-xs text-rose-800/80 leading-relaxed font-mono">
                {errorMessage}
              </p>
              <div className="text-[10px] bg-white p-3 rounded-lg border border-rose-200 text-rose-600">
                ⚠️ <strong>EMERGENCY NOTE</strong>: Never inject an un-cataloged batch into any citizen. Retain physical sample and report immediately to Health Ministry supervisors for verification.
              </div>
            </div>
          ) : scannedBatch ? (
            <div className="space-y-5 animate-fade-up">
              
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    🛡️ Verified Legit Standard
                  </span>
                  <h2 className="text-base font-bold text-slate-800 font-display mt-1">
                    {scannedBatch.vaccineName}
                  </h2>
                  <p className="text-xs text-slate-400">Pathology grouping: {scannedBatch.disease}</p>
                </div>

                <span className="p-2.5 bg-emerald-500 text-white rounded-xl glow-success">
                  <ShieldCheck size={20} />
                </span>
              </div>

              {/* Scanned batch details cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase font-mono flex items-center gap-1">
                    <Tag size={10} /> Cryptographic batch ID
                  </span>
                  <span className="text-xs font-bold text-slate-800 font-mono block">{scannedBatch.id}</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase font-mono flex items-center gap-1">
                    <QrCode size={10} /> UPC Barcode Content
                  </span>
                  <span className="text-xs font-bold text-slate-800 font-mono block">{scannedBatch.barcode}</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase font-mono flex items-center gap-1">
                    <Calendar size={10} /> Critical EXP Limit
                  </span>
                  <span className="text-xs font-bold block text-slate-800">{scannedBatch.expiryDate}</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase font-mono flex items-center gap-1">
                    <Thermometer size={10} /> Cold Chain Standard
                  </span>
                  <span className="text-xs font-bold block text-emerald-600 font-mono">{scannedBatch.temperatureRequired}</span>
                </div>
              </div>

              {/* Expiry indicator progress and stock limits */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/50 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Authorized Physical Vials Available:</span>
                  <span className="font-mono text-slate-900">{scannedBatch.quantityInHand} vials</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/40">
                  <span>Warehouse Storage Slot: {scannedBatch.binLocation}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    scannedBatch.status === "Safe" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                  }`}>
                    Status: {scannedBatch.status}
                  </span>
                </div>
              </div>

              {/* Immediate verification note */}
              <div className="text-[11px] text-slate-500 leading-relaxed bg-blue-50/50 p-3 rounded-lg border border-blue-200/40">
                🌿 <strong>Pre-administration verification passed</strong>: This formulation is cataloged, safe, and stored within authorized storage temperatures. Verify the name on client paper cards before injection.
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center space-y-3 py-20 text-center max-w-sm mx-auto text-slate-400">
              <QrCode size={36} className="text-slate-200" />
              <h3 className="text-sm font-semibold text-slate-700 font-display">Waiting for scan trigger</h3>
              <p className="text-xs">Select or scan an item to load validation metrics, safety stamps, and sterile warehouse values.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
