import React, { useState } from "react";
import { 
  BellRing, Mail, MessageSquare, ShieldCheck, Compass, 
  Send, Trash2, Clock, AlertCircle, Plus, Sparkles
} from "lucide-react";
import { NotificationLog, Patient, DiseaseType } from "../types";
import { smsTemplates } from "../data/mockData";

interface NotificationsPageProps {
  notifications: NotificationLog[];
  patients: Patient[];
  onAddNotification: (notif: NotificationLog) => void;
  onDispatchNotification: (id: string) => void;
  onClearQueue: () => void;
}

export default function NotificationsPage({
  notifications,
  patients,
  onAddNotification,
  onDispatchNotification,
  onClearQueue
}: NotificationsPageProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(smsTemplates[0].type);
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || "");
  const [channel, setChannel] = useState<"SMS" | "Email" | "WhatsApp">("SMS");
  const [customMsgText, setCustomMsgText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const targetPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Compile template preview text based on recipient parameters
  const getCompiledMessage = () => {
    if (!targetPatient) return "No recipient loaded.";
    const activeTemplate = smsTemplates.find(t => t.type === selectedTemplate)?.template || "";
    
    // Replace parameters
    return activeTemplate
      .replace("{childName}", targetPatient.childName)
      .replace("{vaccineName}", "Pentavalent (HepB)")
      .replace("{doseNumber}", "2")
      .replace("{facility}", "Gulshan Health Point")
      .replace("{disease}", "Hepatitis B")
      .replace("{district}", targetPatient.district)
      .replace("{date}", "2026-06-03");
  };

  // Dispatch campaign submit
  const handleQueueCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!targetPatient) {
      setErrorMessage("No child selected to construct invite.");
      return;
    }

    const compiledText = customMsgText || getCompiledMessage();

    const newNotif: NotificationLog = {
      id: `N-${Math.floor(100 + Math.random() * 900)}`,
      patientId: targetPatient.id,
      patientName: targetPatient.childName,
      contactNumber: targetPatient.guardianContact,
      disease: "Hepatitis B",
      channel,
      message: compiledText,
      scheduledTime: new Date().toISOString(),
      status: "Queued"
    };

    onAddNotification(newNotif);
    setCustomMsgText(""); // Reset
  };

  const handleDispatchMsg = (id: string) => {
    onDispatchNotification(id);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Intro Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
            <BellRing size={20} className="text-blue-500 animate-swing" /> National Immunization SMS Gateway
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Bulk outreach and personal follow-up campaign engine. Remind guardians of missed, upcoming, or mandatory vaccine doses.
          </p>
        </div>
        
        <button
          onClick={onClearQueue}
          className="px-3.5 py-1.5 hover:bg-rose-50 text-rose-600 rounded-xl cursor-pointer transition border border-dashed border-rose-200 text-xs flex items-center gap-1"
        >
          <Trash2 size={12} /> Clear Queue Archive
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Campaign Builder */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-display pb-2 border-b border-slate-50">
            Campaign Builder Panel
          </h3>

          {errorMessage && (
            <div className="p-2.5 bg-rose-50 text-rose-800 rounded-lg text-xs font-semibold flex items-center gap-1.5">
              <AlertCircle size={14} className="text-rose-500" /> {errorMessage}
            </div>
          )}

          <form onSubmit={handleQueueCampaign} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase block">Recipient Child</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:bg-white"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.childName} ({p.id}) • Contact: {p.guardianContact}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase block">Transmission Channel</label>
              <div className="grid grid-cols-3 gap-2">
                {(["SMS", "Email", "WhatsApp"] as const).map(ch => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setChannel(ch)}
                    className={`py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition flex items-center justify-center gap-1 border ${
                      channel === ch 
                        ? "bg-slate-900 border-slate-900 text-white" 
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    {ch === "SMS" ? "SMS" : ch === "WhatsApp" ? "WhatsApp" : "Email"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase block">Select Preset Campaign Template</label>
              <select
                value={selectedTemplate}
                onChange={(e) => {
                  setSelectedTemplate(e.target.value);
                  setCustomMsgText(""); // clear manually written
                }}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
              >
                {smsTemplates.map(t => (
                  <option key={t.type} value={t.type}>{t.type}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">Compiled Output Preview</label>
                <span className="text-[9px] text-blue-600 flex items-center gap-0.5 font-bold">
                  <Sparkles size={10} /> Auto-Calculated
                </span>
              </div>
              
              <textarea
                id="msg-preview-area"
                rows={4}
                value={customMsgText || getCompiledMessage()}
                onChange={(e) => setCustomMsgText(e.target.value)}
                placeholder="Compiled preview values are generated dynamically using WHO registers..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl text-xs leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer transition shadow flex items-center justify-center gap-1.5"
            >
              <Send size={12} /> Place Message In Queue
            </button>
          </form>
        </div>

        {/* Live SMS Queue List */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-display pb-2 border-b border-slate-50 mb-3">
            Active Campaign Dispatch Queue
          </h3>

          <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No outbound reminders currently queued in gateway transmission.
              </div>
            ) : (
              notifications.map((notif) => {
                const isSent = notif.status === "Sent";
                
                return (
                  <div 
                    key={notif.id} 
                    id={`notif-${notif.id}`}
                    className={`p-3.5 rounded-xl border flex flex-col sm:flex-row justify-between items-start gap-4 ${
                      isSent ? "bg-emerald-50/20 border-emerald-100" : "bg-blue-50/20 border-blue-100/60"
                    }`}
                  >
                    <div className="space-y-1.5 w-full">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">{notif.patientName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({notif.patientId})</span>
                        </div>

                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                          notif.channel === "SMS" 
                            ? "bg-blue-100 text-blue-800" 
                            : notif.channel === "WhatsApp" 
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-700"
                        }`}>
                          {notif.channel}
                        </span>
                      </div>

                      <p className="text-slate-600 text-[11px] leading-relaxed italic pr-2 font-display">
                        &quot;{notif.message}&quot;
                      </p>

                      <div className="flex justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-200/40">
                        <span>Contact: <strong>{notif.contactNumber}</strong></span>
                        <span className="font-mono text-[9px]">{new Date(notif.scheduledTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>

                    <div className="shrink-0 pt-1">
                      {isSent ? (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md flex items-center gap-1 shadow-3xs border border-emerald-200">
                          <ShieldCheck size={11} /> Sent
                        </span>
                      ) : (
                        <button
                          onClick={() => handleDispatchMsg(notif.id)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-semibold rounded-md cursor-pointer transition flex items-center gap-0.5 shadow-xs"
                        >
                          <Send size={10} /> Dispatch
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
