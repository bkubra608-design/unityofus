import React, { useState } from "react";
import { 
  Package, Plus, Calendar, Compass, AlertCircle, AlertTriangle, 
  CheckCircle, ArrowRightLeft, TrendingDown, Clipboard, Trash2, ShieldAlert
} from "lucide-react";
import { InventoryBatch, DiseaseType, UserSession } from "../types";

interface InventoryPageProps {
  inventory: InventoryBatch[];
  currentSession: UserSession;
  onAddStock: (batch: InventoryBatch) => void;
  onDeleteBatch: (id: string) => void;
}

export default function InventoryPage({ 
  inventory, 
  currentSession, 
  onAddStock, 
  onDeleteBatch 
}: InventoryPageProps) {
  const [filterStatus, setFilterStatus] = useState<"All" | "Safe" | "Near Expiry" | "Expired" | "Low Stock">("All");
  
  // Create / Replenish Form States
  const [showForm, setShowForm] = useState(false);
  const [disease, setDisease] = useState<DiseaseType>("Polio");
  const [vaccineName, setVaccineName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState(500);
  const [mfgDate, setMfgDate] = useState("2026-01-01");
  const [expiryDate, setExpiryDate] = useState("2027-10-31");
  const [tempRequired, setTempRequired] = useState("+2°C to +8°C");
  const [binLocation, setBinLocation] = useState("Cold Box-2C");

  // Summary figures
  const totalStock = inventory.reduce((sum, b) => sum + b.quantityInHand, 0);
  const reservedStock = inventory.reduce((sum, b) => sum + b.reservedQty, 0);
  const expiredStock = inventory.reduce((sum, b) => sum + (b.status === "Expired" ? b.quantityInHand : 0), 0);
  const availableStock = totalStock - reservedStock - expiredStock;

  // Filter list
  const filteredInventory = inventory.filter(b => {
    if (filterStatus === "All") return true;
    return b.status === filterStatus;
  });

  // Unique diseases required for public health coverage
  const targetDiseases: DiseaseType[] = [
    "Polio", "Measles", "Tuberculosis (BCG)", "Diphtheria", "Tetanus", "Pertussis (Whooping Cough)",
    "Hepatitis B", "Haemophilus Influenzae Type B (Hib)", "Rotavirus Diarrhea", "Pneumococcal Pneumonia",
    "Typhoid", "Rubella"
  ];

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vaccineName || !mfgDate || !expiryDate) {
      alert("Please fill all necessary batch parameters.");
      return;
    }

    const batchCode = `BATCH-${disease.substring(0,3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const barcodeCode = barcode || Math.floor(1000000000 + Math.random() * 9000000000).toString();
    
    // Status assessment
    let status: "Safe" | "Near Expiry" | "Expired" | "Low Stock" = "Safe";
    const expiryTime = new Date(expiryDate).getTime();
    const nowTime = new Date().getTime();
    const diffMonths = (expiryTime - nowTime) / (1000 * 3600 * 24 * 30);

    if (diffMonths <= 0) {
      status = "Expired";
    } else if (diffMonths <= 3) {
      status = "Near Expiry";
    } else if (quantity < 60) {
      status = "Low Stock";
    }

    const newBatch: InventoryBatch = {
      id: batchCode,
      disease,
      vaccineName,
      barcode: barcodeCode,
      quantityInHand: Number(quantity),
      reservedQty: 0,
      expiredQty: 0,
      mfgDate,
      expiryDate,
      temperatureRequired: tempRequired,
      status,
      binLocation
    };

    onAddStock(newBatch);
    setShowForm(false);
    
    // reset
    setVaccineName("");
    setBarcode("");
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Upper overview card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-50">
          <div>
            <h1 className="text-lg font-bold text-slate-800 font-display">Cold Warehouse Inventory Management</h1>
            <p className="text-xs text-slate-400">Strict FIFO stock rotation of active immunological vials</p>
          </div>
          <button
            id="btn-show-inventory-form"
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl cursor-pointer transition shadow-xs flex items-center gap-1.5"
          >
            <Plus size={14} /> Replenish Vaccine Stock
          </button>
        </div>

        {/* Totals overview widget */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Total Cold-Inventory</span>
            <strong className="text-xl text-slate-800 font-bold block mt-1">{totalStock.toLocaleString()} vials</strong>
            <span className="text-[9px] text-slate-400">Aggregated physical count</span>
          </div>

          <div className="p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-100">
            <span className="text-[10px] text-emerald-600 block uppercase font-mono">Available Stock (Safe)</span>
            <strong className="text-xl text-emerald-800 font-bold block mt-1">{availableStock.toLocaleString()} vials</strong>
            <span className="text-[9px] text-emerald-500 font-medium">Ready for immediate injection</span>
          </div>

          <div className="p-3.5 bg-amber-50/40 rounded-xl border border-amber-100">
            <span className="text-[10px] text-amber-600 block uppercase font-mono font-bold">Reserved Campaign Stock</span>
            <strong className="text-xl text-amber-800 font-bold block mt-1">{reservedStock.toLocaleString()} vials</strong>
            <span className="text-[9px] text-amber-500">Allocated to field camps</span>
          </div>

          <div className="p-3.5 bg-rose-50/40 rounded-xl border border-rose-100">
            <span className="text-[10px] text-rose-600 block uppercase font-mono">Expired / Locked Assets</span>
            <strong className="text-xl text-rose-800 font-bold block mt-1">{expiredStock.toLocaleString()} vials</strong>
            <span className="text-[9px] text-rose-500">Quarantined for disposal</span>
          </div>
        </div>
      </div>

      {/* Vaccine creation form */}
      {showForm && (
        <div className="bg-white p-5 rounded-2xl border border-blue-200 outline outline-4 outline-blue-50 shadow-md max-w-2xl mx-auto animate-fade-up">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-bold text-slate-800 font-display flex items-center gap-1.5">
              <Package size={15} className="text-blue-500" /> Catalog New Safe Vaccine Shipment
            </h3>
            <button 
              onClick={() => setShowForm(false)} 
              className="text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block uppercase">Pathogen Protection Category</label>
                <select
                  value={disease}
                  onChange={(e: any) => setDisease(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                >
                  {targetDiseases.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block uppercase">Vaccine Formulation Name *</label>
                <input
                  id="inv-name"
                  type="text"
                  required
                  placeholder="e.g. Salk IPV Premium"
                  value={vaccineName}
                  onChange={(e) => setVaccineName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block uppercase">Vial Barcode ID (Scan preview)</label>
                <input
                  id="inv-barcode"
                  type="text"
                  placeholder="Leave empty to auto-generate UPC barcode"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block uppercase block font-display">Vials Quantity *</label>
                <input
                  id="inv-qty"
                  type="number"
                  required
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block uppercase">Manufacturing Date (MFG)</label>
                <input
                  id="inv-mfg"
                  type="date"
                  required
                  value={mfgDate}
                  onChange={(e) => setMfgDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block uppercase">Expiry Date (EXP)</label>
                <input
                  id="inv-expiry"
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block uppercase">Temperature Storage Target</label>
                <select
                  value={tempRequired}
                  onChange={(e) => setTempRequired(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                >
                  <option value="+2°C to +8°C">+2°C to +8°C (Standard Cold Chain)</option>
                  <option value="-20°C to -10°C">-20°C to -10°C (Subzero Deep Freeze)</option>
                  <option value="-80°C to -60°C">-80°C to -60°C (Ultra Deep Freeze)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block uppercase font-display">Fridge Bin Allocation</label>
                <input
                  id="inv-bin"
                  type="text"
                  value={binLocation}
                  onChange={(e) => setBinLocation(e.target.value)}
                  placeholder="e.g. Cold Box-3 Tier B"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg cursor-pointer transition shadow-xs"
              >
                Log Into Warehouse Database
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="text-sm font-bold text-slate-800 font-display">Batch inventory files</h3>
          
          <div className="flex flex-wrap gap-1 bg-slate-100 p-0.5 rounded-lg w-full sm:w-auto">
            {(["All", "Safe", "Near Expiry", "Expired", "Low Stock"] as const).map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`flex-1 sm:flex-none px-2.5 py-1 text-[10px] font-bold rounded-md transition cursor-pointer ${
                  filterStatus === st 
                    ? "bg-white text-slate-800 shadow-3xs border border-slate-200" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Rows Grid */}
        <div className="space-y-3.5">
          {filteredInventory.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No matching storage batches found.
            </div>
          ) : (
            filteredInventory.map(batch => {
              const totalUsedPercent = Math.min(100, Math.round(((batch.reservedQty) / (batch.quantityInHand || 1)) * 100));
              
              const statusConfig = {
                "Safe": "bg-emerald-50 text-emerald-700 border-emerald-100",
                "Near Expiry": "bg-amber-50 text-amber-700 border-amber-100 animate-pulse",
                "Expired": "bg-rose-50 text-rose-700 border-rose-100 font-extrabold",
                "Low Stock": "bg-blue-50 text-blue-700 border-blue-100"
              };

              return (
                <div 
                  key={batch.id} 
                  id={`batch-row-${batch.id}`}
                  className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
                >
                  <div className="space-y-1 w-full md:w-1/3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-800 max-w-[200px] truncate block">
                        {batch.vaccineName}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${statusConfig[batch.status]}`}>
                        {batch.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-slate-400">
                      <span className="bg-slate-200/60 px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-600 font-bold shrink-0">
                        ID: {batch.id}
                      </span>
                      <span>• Pathology: <strong>{batch.disease}</strong></span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-1/2 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-mono">Stock Level</span>
                      <strong className="text-slate-800 font-bold block mt-0.5">{batch.quantityInHand} vials</strong>
                      <span className="text-[9px] text-slate-400">Bin: {batch.binLocation}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-mono">Preserve Temp</span>
                      <strong className="text-slate-800 font-bold block mt-0.5">{batch.temperatureRequired}</strong>
                      <span className="text-[9px] text-slate-400">Compliance safe</span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-mono">Barcode ID</span>
                      <code className="text-slate-500 font-mono text-[10px] block mt-0.5">{batch.barcode}</code>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-mono">Expiration Lock</span>
                      <strong className="text-slate-800 font-bold block mt-0.5 text-ellipsis overflow-hidden whitespace-nowrap">
                        {batch.expiryDate}
                      </strong>
                      <span className="text-[9px] text-slate-400">MFG: {batch.mfgDate}</span>
                    </div>
                  </div>

                  {/* Operation Actions */}
                  <div className="flex gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/50">
                    <button
                      onClick={() => onDeleteBatch(batch.id)}
                      className="p-1 px-2 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition border border-dashed border-rose-200 text-xs flex items-center gap-1"
                      title="Quarantine & Delete Batch"
                    >
                      <Trash2 size={12} /> Quarantine
                    </button>
                  </div>
                </div>
              );
            }))}
        </div>
      </div>
    </div>
  );
}
