import React, { useState } from "react";
import { 
  Plus, Search, UserPlus, Calendar, Mail, Compass, ShieldCheck, 
  ChevronRight, Printer, AlertCircle, Syringe, Trash2, Check, Clock
} from "lucide-react";
import { Patient, VaccinationRecord, InventoryBatch, DiseaseType, UserSession } from "../types";

interface POSPageProps {
  patients: Patient[];
  inventory: InventoryBatch[];
  currentSession: UserSession;
  onAddPatient: (patient: Patient) => void;
  onAdministerVaccine: (patientId: string, record: VaccinationRecord) => void;
}

export default function POSPage({ 
  patients, 
  inventory, 
  currentSession, 
  onAddPatient, 
  onAdministerVaccine 
}: POSPageProps) {
  // Navigation & States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(patients[0] || null);
  const [showRegForm, setShowRegForm] = useState(false);
  
  // Registration Form Values
  const [childName, setChildName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [guardianContact, setGuardianContact] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState(currentSession.district);
  const [unionCouncil, setUnionCouncil] = useState("");

  // Administer Form Values
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState<DiseaseType>("Polio");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [doseNumber, setDoseNumber] = useState(1);
  const [errorAdmin, setErrorAdmin] = useState("");
  const [successAdmin, setSuccessAdmin] = useState("");

  // Printable Slip Settings
  const [printSlipRecord, setPrintSlipRecord] = useState<VaccinationRecord | null>(null);
  const [printSlipPatient, setPrintSlipPatient] = useState<Patient | null>(null);

  // Search filter
  const filteredPatients = patients.filter(p => {
    const q = searchQuery.toLowerCase();
    return (
      p.childName.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.fatherName.toLowerCase().includes(q) ||
      p.guardianContact.includes(q)
    );
  });

  // Suggest match if typing
  const searchSuggestion = searchQuery.length > 1 && filteredPatients.length > 0 ? filteredPatients[0] : null;

  // Handle Register Patient Submit
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName || !fatherName || !guardianContact || !dateOfBirth || !unionCouncil) {
      alert("Please fill all required child validation parameters.");
      return;
    }

    const uniqueId = `VAX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPatient: Patient = {
      id: uniqueId,
      childName,
      fatherName,
      motherName,
      guardianContact,
      dateOfBirth,
      gender,
      address,
      district,
      unionCouncil,
      registrationDate: new Date().toISOString().split("T")[0],
      avatarSeed: Math.floor(Math.random() * 100),
      vaccinations: [
        {
          id: `VR-${Math.floor(Math.random() * 10000)}`,
          disease: "Tuberculosis (BCG)",
          vaccineName: "BCG",
          doseNumber: 1,
          administeredDate: "",
          administeredBy: "",
          batchNumber: "",
          status: "Pending",
          nextDueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split("T")[0], // Within a week
          facility: ""
        },
        {
          id: `VR-${Math.floor(Math.random() * 10000)}`,
          disease: "Polio",
          vaccineName: "OPV",
          doseNumber: 1,
          administeredDate: "",
          administeredBy: "",
          batchNumber: "",
          status: "Pending",
          nextDueDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split("T")[0], // Within 2 weeks
          facility: ""
        }
      ]
    };

    onAddPatient(newPatient);
    setSelectedPatient(newPatient);
    setShowRegForm(false);
    
    // Reset form
    setChildName("");
    setFatherName("");
    setMotherName("");
    setGuardianContact("");
    setDateOfBirth("");
    setAddress("");
    setUnionCouncil("");
  };

  // Find active batches for selected disease
  const availableBatches = inventory.filter(b => b.disease === selectedDisease && b.quantityInHand > 0);

  // Handle Administer Submit
  const handleAdminister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorAdmin("");
    setSuccessAdmin("");

    if (!selectedPatient) return;
    if (!selectedBatchId) {
      setErrorAdmin("Please select an active vaccine batch.");
      return;
    }

    const batch = inventory.find(b => b.id === selectedBatchId);
    if (!batch) {
      setErrorAdmin("Invalid batch selected.");
      return;
    }

    if (batch.quantityInHand <= 0) {
      setErrorAdmin("This physical batch is currently out of stock!");
      return;
    }

    if (batch.status === "Expired") {
      setErrorAdmin("Bio-Safety Halt: Selected batch is expired and locked!");
      return;
    }

    // Record immunization and calculate automatic next 4-week appointment offset
    const d = new Date();
    const todayStr = d.toISOString().split("T")[0];
    
    d.setDate(d.getDate() + 28);
    const nextDueStr = d.toISOString().split("T")[0];

    const newRecord: VaccinationRecord = {
      id: `VR-${Math.floor(1000 + Math.random() * 9000)}`,
      disease: selectedDisease,
      vaccineName: batch.vaccineName,
      doseNumber: Number(doseNumber),
      administeredDate: todayStr,
      administeredBy: currentSession.fullName,
      batchNumber: batch.id,
      status: "Completed",
      nextDueDate: nextDueStr,
      facility: currentSession.facilityCode
    };

    // Callback to update parent state
    onAdministerVaccine(selectedPatient.id, newRecord);
    setSuccessAdmin(`Successfully recorded dose of ${batch.vaccineName}!`);

    // Assign print record
    setPrintSlipPatient(selectedPatient);
    setPrintSlipRecord(newRecord);

    // Refresh selected patient values
    const updatedPatient = {
      ...selectedPatient,
      vaccinations: [...selectedPatient.vaccinations, newRecord]
    };
    setSelectedPatient(updatedPatient);

    // Auto close
    setTimeout(() => {
      setShowAdminForm(false);
      setSuccessAdmin("");
      setSelectedBatchId("");
    }, 2000);
  };

  // Helper function: get weeks since birth
  const getAgeInWeeks = (dob: string) => {
    const birthday = new Date(dob);
    const today = new Date();
    const diffMs = today.getTime() - birthday.getTime();
    const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks < 0 ? 0 : diffWeeks;
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Search Header and Quick POS Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            id="vax-search-input"
            type="text"
            placeholder="Search immunization profile by VAX ID, Name, Father's Name or Contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl shadow-xs text-sm font-medium transition"
          />
          {searchSuggestion && (
            <div className="absolute left-0 right-0 top-full mt-1.5 p-3 bg-blue-50 border border-blue-200/60 rounded-xl shadow-md z-40 flex items-center justify-between text-xs text-blue-900">
              <span className="font-semibold">
                Quick suggestion: {searchSuggestion.childName} ({searchSuggestion.id}) • DOB: {searchSuggestion.dateOfBirth}
              </span>
              <button 
                id="btn-quick-suggest-select"
                onClick={() => {
                  setSelectedPatient(searchSuggestion);
                  setSearchQuery("");
                }}
                className="px-2.5 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer font-bold transition-all text-[11px]"
              >
                Select Profile
              </button>
            </div>
          )}
        </div>
        
        <div className="md:col-span-4 flex gap-2">
          <button
            id="btn-show-reg"
            onClick={() => setShowRegForm(!showRegForm)}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition shadow-md glow-primary"
          >
            <UserPlus size={16} /> Register New Child
          </button>
          
          {selectedPatient && (
            <button
              id="btn-show-dose"
              onClick={() => {
                setShowAdminForm(true);
                setSelectedDisease("Polio");
                setSelectedBatchId("");
              }}
              className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition shadow-md glow-success"
            >
              <Syringe size={16} /> Quick Immunize
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Registration Form OR Patient Profiles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Hand: Search Result Profiles list */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 font-display mb-3">
              Matched Children ({filteredPatients.length})
            </h3>
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredPatients.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No registered immunization database profiles found matching query.
                </div>
              ) : (
                filteredPatients.map((p) => {
                  const weeks = getAgeInWeeks(p.dateOfBirth);
                  const isSelected = selectedPatient?.id === p.id;
                  
                  return (
                    <div
                      key={p.id}
                      id={`patient-card-${p.id}`}
                      onClick={() => setSelectedPatient(p)}
                      className={`p-3.5 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? "bg-blue-50/60 border-blue-400" 
                          : "bg-slate-50 hover:bg-slate-100 border-slate-200/50"
                      }`}
                    >
                      <div className="flex gap-3 items-center">
                        <div className={`w-9 h-9 rounded-full font-bold flex items-center justify-center text-xs shadow-2xs ${
                          p.gender === "Female" ? "bg-pink-100 text-pink-700" : "bg-sky-100 text-sky-700"
                        }`}>
                          {p.childName.charAt(0)}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-slate-800">{p.childName}</h4>
                          <span className="text-[10px] text-slate-500 block">Father: {p.fatherName}</span>
                          <span className="text-[9px] font-mono text-slate-400 block">ID: {p.id} • {weeks} weeks old</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="px-1.5 py-0.5 rounded bg-white font-mono text-[9px] border border-slate-200 font-bold block">
                          {p.vaccinations.filter(v => v.status === "Completed").length} Done
                        </span>
                        <ChevronRight size={14} className="text-slate-400 ml-auto mt-1" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            ℹ️ Select a patient profile to view detailed history card, calculate pending doses, and print receipts.
          </div>
        </div>

        {/* Right Hand: Detailed immunization card OR registration form */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Registration Form Overlay or Screen */}
          {showRegForm ? (
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm animate-fade-up">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
                  <UserPlus size={18} className="text-blue-600" /> New Child Registration Profile
                </h3>
                <button
                  onClick={() => setShowRegForm(false)}
                  className="p-1 px-2 text-xs hover:bg-slate-100 text-slate-500 rounded-lg cursor-pointer font-bold"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block uppercase">Child Name *</label>
                    <input
                      id="ip-child-name"
                      type="text"
                      required
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="e.g. Zainab Ali"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-lg text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block uppercase">Date of Birth *</label>
                    <input
                      id="ip-dob"
                      type="date"
                      required
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-lg text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block uppercase">Father Name *</label>
                    <input
                      id="ip-father-name"
                      type="text"
                      required
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      placeholder="e.g. Ali Muhammad"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-lg text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block uppercase">Mother Name</label>
                    <input
                      id="ip-mother-name"
                      type="text"
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      placeholder="e.g. Sana Ali"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-lg text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block uppercase">Guardian Contact *</label>
                    <input
                      id="ip-guardian-contact"
                      type="tel"
                      required
                      value={guardianContact}
                      onChange={(e) => setGuardianContact(e.target.value)}
                      placeholder="e.g. +92 321 4567891"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-lg text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block uppercase font-display">Gender *</label>
                    <select
                      id="ip-gender"
                      value={gender}
                      onChange={(e: any) => setGender(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-lg text-xs font-semibold"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block uppercase">District</label>
                    <input
                      id="ip-district"
                      type="text"
                      disabled
                      value={district}
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 text-slate-500 rounded-lg text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block uppercase">Union Council (UC) *</label>
                    <input
                      id="ip-uc"
                      type="text"
                      required
                      value={unionCouncil}
                      onChange={(e) => setUnionCouncil(e.target.value)}
                      placeholder="e.g. UC-12 Ward A"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-lg text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block uppercase">Residential Address</label>
                  <textarea
                    id="ip-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Provide full landmarks for outdoor mobilisers followups..."
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-lg text-xs"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition shadow-xs cursor-pointer"
                  >
                    Authorize & Register
                  </button>
                </div>
              </form>
            </div>
          ) : selectedPatient ? (
            <div className="space-y-6">
              
              {/* Patient Core details Panel */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row gap-5 items-start justify-between">
                <div className="flex gap-4 items-start">
                  <div className={`w-12 h-12 rounded-full font-bold flex items-center justify-center text-base shadow-xs shrink-0 ${
                    selectedPatient.gender === "Female" ? "bg-pink-100 text-pink-700" : "bg-sky-100 text-sky-700"
                  }`}>
                    {selectedPatient.childName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                      {selectedPatient.childName} 
                      <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[9px] font-mono border border-blue-100 font-bold">
                        {selectedPatient.id}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Born: <strong>{selectedPatient.dateOfBirth}</strong> ({getAgeInWeeks(selectedPatient.dateOfBirth)} weeks old) • Gender: {selectedPatient.gender}
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                      <span>Father: <strong className="text-slate-600">{selectedPatient.fatherName}</strong></span>
                      <span>Mother: <strong className="text-slate-600">{selectedPatient.motherName || "N/A"}</strong></span>
                      <span>Contact: <strong className="text-slate-600">{selectedPatient.guardianContact}</strong></span>
                      <span>UC: <strong className="text-slate-600">{selectedPatient.unionCouncil}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0 bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Doses Status</span>
                  <span className="text-lg font-extrabold text-slate-800 block">
                    {selectedPatient.vaccinations.filter(v => v.status === "Completed").length} / {selectedPatient.vaccinations.length}
                  </span>
                  <span className="text-[9px] text-emerald-600 font-semibold block">
                    {selectedPatient.vaccinations.every(v => v.status === "Completed") ? "🛡️ Fully Protected" : "⏳ Active Protect cycle"}
                  </span>
                </div>
              </div>

              {/* Immunization History Card & Check-in Checklist */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                  <h3 className="text-sm font-bold text-slate-800 font-display">
                    Immunization Record Card for Disease pathogens
                  </h3>
                  <button
                    onClick={() => {
                      setShowAdminForm(true);
                      setSelectedDisease("Polio");
                      setSelectedBatchId("");
                    }}
                    className="p-1.5 px-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold rounded-lg cursor-pointer transition flex items-center gap-1"
                  >
                    <Plus size={12} /> Log Immunization Shot
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedPatient.vaccinations.map((vac) => {
                    const isDone = vac.status === "Completed";
                    return (
                      <div 
                        key={vac.id} 
                        className={`p-3 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                          isDone ? "bg-emerald-50/20 border-emerald-100" : "bg-amber-50/20 border-amber-100"
                        }`}
                      >
                        <div className="flex gap-2.5 items-start">
                          <span className={`p-2 rounded-lg block ${
                            isDone ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                          }`}>
                            <Syringe size={14} />
                          </span>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-slate-800">{vac.vaccineName}</span>
                              <span className="text-[10px] text-slate-400 font-medium">({vac.disease})</span>
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[8px] font-mono">Dose #{vac.doseNumber}</span>
                            </div>
                            {isDone ? (
                              <p className="text-[10px] text-slate-500 mt-1">
                                Administered: <strong>{vac.administeredDate}</strong> By: {vac.administeredBy} | Facility code: {vac.facility} | Batch: {vac.batchNumber}  
                              </p>
                            ) : (
                              <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                                <Clock size={10} className="text-amber-500" /> Planned schedule target: <strong>{vac.nextDueDate}</strong>
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 items-center justify-end w-full sm:w-auto shrink-0">
                          {isDone ? (
                            <>
                              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/70 p-1 px-2 rounded-md">
                                Clean Shield
                              </span>
                              <button
                                onClick={() => {
                                  setPrintSlipPatient(selectedPatient);
                                  setPrintSlipRecord(vac);
                                }}
                                className="p-1 px-1.5 hover:bg-slate-100 text-slate-600 rounded-md border border-slate-200 cursor-pointer shadow-3xs"
                                title="Print Slip"
                              >
                                <Printer size={12} />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedDisease(vac.disease);
                                setShowAdminForm(true);
                              }}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-semibold rounded-md cursor-pointer transition"
                            >
                              Dispatch Shot
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-100 rounded-2xl p-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
              <Compass size={32} className="text-slate-300" />
              <span>Select or register a child to load the Immunization POS checkdesk.</span>
            </div>
          )}

          {/* Quick Dose Administration Modal Overlay */}
          {showAdminForm && selectedPatient && (
            <div className="bg-white p-5 rounded-2xl border border-blue-200 outline outline-4 outline-blue-50 shadow-md animate-fade-up">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-bold text-slate-800 font-display flex items-center gap-2">
                  <Syringe size={15} className="text-blue-500" /> Log Dose Administration Event
                </h3>
                <button
                  onClick={() => setShowAdminForm(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {errorAdmin && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2.5 rounded-lg text-xs font-medium mb-3 flex items-center gap-2">
                  <AlertCircle size={14} className="text-rose-500" /> {errorAdmin}
                </div>
              )}

              {successAdmin && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-lg text-xs font-medium mb-3 flex items-center gap-2">
                  <Check size={14} className="text-emerald-500 animate-pulse" /> {successAdmin}
                </div>
              )}

              <form onSubmit={handleAdminister} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-500 block uppercase">Target Disease Group</label>
                    <select
                      value={selectedDisease}
                      onChange={(e: any) => setSelectedDisease(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                    >
                      <option value="Polio">Polio</option>
                      <option value="Measles">Measles</option>
                      <option value="Tuberculosis (BCG)">Tuberculosis (BCG)</option>
                      <option value="Hepatitis B">Hepatitis B</option>
                      <option value="Rotavirus Diarrhea">Rotavirus Diarrhea</option>
                      <option value="Pneumococcal Pneumonia">Pneumococcal Pneumonia</option>
                      <option value="Typhoid">Typhoid</option>
                      <option value="Rubella">Rubella</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-500 block uppercase">Dose Cycle Number</label>
                    <select
                      value={doseNumber}
                      onChange={(e) => setDoseNumber(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                    >
                      <option value={1}>Dose #1 (Primary)</option>
                      <option value={2}>Dose #2 (Secondary)</option>
                      <option value={3}>Dose #3 (Completion)</option>
                      <option value={4}>Dose #4 (Booster)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-500 block uppercase">Select Active Cold Batch Vials</label>
                  <select
                    value={selectedBatchId}
                    onChange={(e) => setSelectedBatchId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg text-xs font-semibold"
                  >
                    <option value="">-- Choose active vaccine stock with secure custody --</option>
                    {availableBatches.length === 0 ? (
                      <option value="" disabled>⚠️ No safe sterile vials in custody! Check inventory</option>
                    ) : (
                      availableBatches.map(b => (
                        <option key={b.id} value={b.id}>
                          {b.vaccineName} [Batch: {b.id}] - Qty: {b.quantityInHand} vials ({b.temperatureRequired})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-[11px] text-slate-500 leading-relaxed">
                  🛡️ <strong>Safety Check</strong>: Logging this will debit 1 vial from batch stock, update child records, register the medical personnel, and automatically calculate a 4-week recall text alert queue.
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg transition shadow-xs cursor-pointer"
                  >
                    Confirm Injection
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Printable Slip Receipt simulator modal */}
          {printSlipRecord && printSlipPatient && (
            <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-xl overflow-hidden animate-fade-up">
              <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-200 mb-4">
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Vaccine Receipt Voucher</span>
                <button
                  onClick={() => {
                    setPrintSlipRecord(null);
                    setPrintSlipPatient(null);
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Dismiss Slip
                </button>
              </div>

              {/* Thermal paper receipt visual style */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-700 space-y-4 max-w-sm mx-auto shadow-2xs relative">
                
                {/* Visual thermal cutouts top and bottom */}
                <div className="absolute top-0 inset-x-0 h-1 bg-[radial-gradient(circle,_#ccc_2px,_transparent_0)] bg-[length:6px_4px] bg-repeat-x opacity-40" />

                <div className="text-center space-y-1">
                  <h4 className="text-xs font-extrabold text-slate-900 leading-none">⚔️ VACCINESHIELD PRO ⚔️</h4>
                  <p className="text-[9px] text-slate-400">IMMUNIZATION FIELD POS SLIP</p>
                  <p className="text-[9px] text-slate-400">Date: {printSlipRecord.administeredDate} • {new Date().toLocaleTimeString()}</p>
                </div>

                <div className="border-t border-b border-dashed border-slate-200 py-2 space-y-1">
                  <div>PATIENT : <strong className="text-slate-900">{printSlipPatient.childName}</strong></div>
                  <div>PASS_ID : <strong className="text-slate-900">{printSlipPatient.id}</strong></div>
                  <div>CONTACT : {printSlipPatient.guardianContact}</div>
                  <div>FACILITY: {printSlipRecord.facility || currentSession.facilityCode}</div>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-slate-900">VACCINE RECORD DETAILS:</div>
                  <div>DISEASE : {printSlipRecord.disease}</div>
                  <div>VACCINE : {printSlipRecord.vaccineName}</div>
                  <div>BATCH_ID: {printSlipRecord.batchNumber}</div>
                  <div>DOSE_NUM: #{printSlipRecord.doseNumber} (Primary Shot)</div>
                  <div>CLINICIAN: {printSlipRecord.administeredBy}</div>
                </div>

                <div className="bg-white p-2.5 rounded border border-slate-200 text-center font-bold text-[10px] text-emerald-700 border-dashed">
                  STATUS: SECURED SHIELD COMPLETED
                </div>

                <div className="border-t border-dashed border-slate-200 pt-2 space-y-2">
                  <div className="text-[9px] text-amber-600 font-bold uppercase">NEXT APPOINTMENT OFFSET:</div>
                  <div>DUE DATE: <strong className="text-slate-900">{printSlipRecord.nextDueDate}</strong></div>
                </div>

                {/* Simulated QR Code rendering */}
                <div className="flex flex-col items-center justify-center pt-2 space-y-1.5">
                  <div className="bg-white p-1.5 border border-slate-200 rounded shadow-3xs inline-block">
                    {/* Retro blocky vector SVG representation of a vaccine QR code */}
                    <svg width="60" height="60" viewBox="0 0 10 10" className="shape-rendering-crisp">
                      <rect width="10" height="10" fill="#ffffff" />
                      <rect x="0" y="0" width="3" height="3" fill="#0f172a" />
                      <rect x="7" y="0" width="3" height="3" fill="#0f172a" />
                      <rect x="0" y="7" width="3" height="3" fill="#0f172a" />
                      <rect x="1" y="1" width="1" height="1" fill="#ffffff" />
                      <rect x="8" y="1" width="1" height="1" fill="#ffffff" />
                      <rect x="1" y="8" width="1" height="1" fill="#ffffff" />
                      <rect x="4" y="2" width="2" height="1" fill="#0f172a" />
                      <rect x="5" y="4" width="1" height="3" fill="#0f172a" />
                      <rect x="3" y="6" width="3" height="1" fill="#0f172a" />
                      <rect x="7" y="7" width="2" height="2" fill="#0f172a" />
                    </svg>
                  </div>
                  <span className="text-[8px] text-slate-400 font-mono tracking-wider">SECURE-DIGITAL-PROOF-{printSlipRecord.id}</span>
                </div>

                <div className="absolute bottom-0 inset-x-0 h-1 bg-[radial-gradient(circle,_#ccc_2px,_transparent_0)] bg-[length:6px_4px] bg-repeat-x opacity-40" />
              </div>

              <div className="flex justify-center mt-4">
                <button
                  onClick={() => alert("Connecting to system ESC-POS printer... Simulated Print Successful!")}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Printer size={13} /> Print Physical Receipt
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
