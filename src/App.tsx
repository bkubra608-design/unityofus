import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, LayoutDashboard, UserPlus, Syringe, QrCode, 
  Thermometer, ClipboardCheck, BellRing, HeartHandshake, FilePieChart, 
  Settings, LogOut, Sun, Moon, Search, Wifi, WifiOff, AlertTriangle, Menu, X, Clock
} from "lucide-react";

import { 
  Patient, InventoryBatch, ColdChainRefrigerator, FieldFeedback, 
  AuditLog, NotificationLog, UserSession, UserRole, VaccinationRecord
} from "./types";

import { 
  initialPatients, initialInventory, initialColdChain, 
  mockFeedback, initialAuditLogs, initialNotifications 
} from "./data/mockData";

// Tabs Page Components
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";
import POSPage from "./components/POSPage";
import InventoryPage from "./components/InventoryPage";
import ColdChainPage from "./components/ColdChainPage";
import ScannerPage from "./components/ScannerPage";
import ReconciliationPage from "./components/ReconciliationPage";
import NotificationsPage from "./components/NotificationsPage";
import TestimonialsPage from "./components/TestimonialsPage";
import ReportsPage from "./components/ReportsPage";
import SettingsPage from "./components/SettingsPage";

export default function App() {
  // Global App States
  const [session, setSession] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  // Storage Databases
  const [patients, setPatients] = useState<Patient[]>([]);
  const [inventory, setInventory] = useState<InventoryBatch[]>([]);
  const [coldChain, setColdChain] = useState<ColdChainRefrigerator[]>([]);
  const [feedbacks, setFeedbacks] = useState<FieldFeedback[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);

  // Simulated Offline Modes
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [offlineBuffer, setOfflineBuffer] = useState<Patient[]>([]);

  // Live Clock Counter
  const [currentTime, setCurrentTime] = useState(new Date());

  // Init/load state on boot
  useEffect(() => {
    // Session load check
    const storedSession = localStorage.getItem("vax_session");
    if (storedSession) {
      setSession(JSON.parse(storedSession));
    }

    // Load values or fallback to rich seed data
    const dPatients = localStorage.getItem("vax_patients");
    setPatients(dPatients ? JSON.parse(dPatients) : initialPatients);

    const dInventory = localStorage.getItem("vax_inventory");
    setInventory(dInventory ? JSON.parse(dInventory) : initialInventory);

    const dColdChain = localStorage.getItem("vax_cold_chain");
    setColdChain(dColdChain ? JSON.parse(dColdChain) : initialColdChain);

    const dFeedback = localStorage.getItem("vax_feedback");
    setFeedbacks(dFeedback ? JSON.parse(dFeedback) : mockFeedback);

    const dAudits = localStorage.getItem("vax_audit_logs");
    setAuditLogs(dAudits ? JSON.parse(dAudits) : initialAuditLogs);

    const dNotifications = localStorage.getItem("vax_notifications");
    setNotifications(dNotifications ? JSON.parse(dNotifications) : initialNotifications);

    // Dark mode check
    const storedDark = localStorage.getItem("vax_dark_mode");
    if (storedDark === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Sync to localStorage when states update
  useEffect(() => {
    if (patients.length) localStorage.setItem("vax_patients", JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    if (inventory.length) localStorage.setItem("vax_inventory", JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    if (coldChain.length) localStorage.setItem("vax_cold_chain", JSON.stringify(coldChain));
  }, [coldChain]);

  useEffect(() => {
    if (feedbacks.length) localStorage.setItem("vax_feedback", JSON.stringify(feedbacks));
  }, [feedbacks]);

  useEffect(() => {
    if (auditLogs.length) localStorage.setItem("vax_audit_logs", JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    if (notifications.length) localStorage.setItem("vax_notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Live ticking clock callback
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Add Log helper
  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      user: session ? session.fullName : "System",
      role: session ? session.role : "Worker",
      action,
      details,
      ipAddress: "127.0.0.1"
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Auth logins handler
  const handleLogin = (userSession: UserSession) => {
    setSession(userSession);
    localStorage.setItem("vax_session", JSON.stringify(userSession));
    
    // Create login audit trail
    const newLog: AuditLog = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      user: userSession.fullName,
      role: userSession.role,
      action: "System Session Authorization",
      details: `Successful sign-on as ${userSession.role} key. Verified at unit ${userSession.facilityCode}.`,
      ipAddress: "127.0.0.1"
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleLogout = () => {
    addAuditLog("System Sign-out", "Active operator security session terminated gracefully.");
    setSession(null);
    localStorage.removeItem("vax_session");
  };

  // State update handles
  const handleAddPatient = (newPatient: Patient) => {
    if (isOfflineMode) {
      // Buffer offline action
      setOfflineBuffer(prev => [...prev, newPatient]);
      addAuditLog("Intake Offline Cached", `In transition offline node. Buffered profile ${newPatient.childName} (${newPatient.id}) locally.`);
    } else {
      setPatients(prev => [newPatient, ...prev]);
      addAuditLog("Patient Account Registered", `Logged child profile ${newPatient.childName} with ID ${newPatient.id} in registry.`);
    }
  };

  const handleAdministerVaccine = (patientId: string, record: VaccinationRecord) => {
    // 1. Debit Stock count from matching batch index
    setInventory(prev => {
      return prev.map(item => {
        if (item.id === record.batchNumber) {
          const newQty = Math.max(0, item.quantityInHand - 1);
          return {
            ...item,
            quantityInHand: newQty,
            status: newQty < 50 ? "Low Stock" : item.status
          };
        }
        return item;
      });
    });

    // 2. Append completed vaccination record to child profile
    setPatients(prev => {
      return prev.map(p => {
        if (p.id === patientId) {
          return {
            ...p,
            vaccinations: [...p.vaccinations, record]
          };
        }
        return p;
      });
    });

    // 3. Queue subsequent SMS campaign alert automatically
    const reminderId = `N-${Math.floor(100 + Math.random() * 900)}`;
    const newAlert: NotificationLog = {
      id: reminderId,
      patientId: patientId,
      patientName: patients.find(p => p.id === patientId)?.childName || "Recipient",
      contactNumber: patients.find(p => p.id === patientId)?.guardianContact || "+92 321 0000000",
      disease: record.disease,
      channel: "SMS",
      message: `Correction alert: Protection completed. Schedule registered for subsequent booster dose on ${record.nextDueDate}.`,
      scheduledTime: record.nextDueDate || new Date().toISOString(),
      status: "Queued"
    };
    setNotifications(prev => [newAlert, ...prev]);

    addAuditLog("Vaccine Dose Administered", `Logged completed target protection code ${record.vaccineName} dose #${record.doseNumber}. Batch ${record.batchNumber}.`);
  };

  // Add inventory stock helper
  const handleAddStock = (newBatch: InventoryBatch) => {
    setInventory(prev => [newBatch, ...prev]);
    addAuditLog("Inventory Replenished", `Cataloged shipment of ${newBatch.quantityInHand} vials of ${newBatch.vaccineName}. Batch ID: ${newBatch.id}.`);
  };

  const handleDeleteBatch = (id: string) => {
    setInventory(prev => prev.filter(b => b.id !== id));
    addAuditLog("Vial Batch Quarantined", `Removed supply of batch ID ${id} from cold-chain assets.`);
  };

  const handleUpdateCoolerTemp = (id: string, newTemp: number) => {
    setColdChain(prev => {
      return prev.map(ref => {
        if (ref.id === id) {
          let status: "Safe" | "Warning" | "Critical" = "Safe";
          if (newTemp > ref.targetTempRange.max || newTemp < ref.targetTempRange.min) {
            status = "Critical";
          } else if (newTemp > ref.targetTempRange.max - 1.5 || newTemp < ref.targetTempRange.min + 1) {
            status = "Warning";
          }
          return { ...ref, currentTemp: newTemp, status };
        }
        return ref;
      });
    });
  };

  // Feedback additions callback
  const handleAddFeedback = (newFee: FieldFeedback) => {
    setFeedbacks(prev => [newFee, ...prev]);
    addAuditLog("Outpost Critique Submitted", `Logged feedback from outreach nurse ${newFee.name}. Rating: ${newFee.rating} stars.`);
  };

  const handleAddNotification = (newNotif: NotificationLog) => {
    setNotifications(prev => [newNotif, ...prev]);
    addAuditLog("Remind Outbox Enqueued", `Vaccine invite text placed in active dispatch queue. Recipient: ${newNotif.patientName}.`);
  };

  const handleDispatchNotification = (notifId: string) => {
    setNotifications(prev => {
      return prev.map(n => {
        if (n.id === notifId) {
          return { ...n, status: "Sent" };
        }
        return n;
      });
    });
    addAuditLog("Campaign Invite Sent", `SMS text dispatched cleanly through cellular gateway node.`);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    addAuditLog("Gateway Cleaned", "Queue history logs empty.");
  };

  const handleCompleteReconciliation = (info: any) => {
    addAuditLog("Shift Closure Certified", `Shift audited with zero variance. Supervisor ${info.supervisorName} authorized sign-off.`);
  };

  const handleClearDatabase = () => {
    if (!window.confirm("CRITICAL ADMIN RESET: Are you sure you want to wipe all local browser database modifications?")) {
      return;
    }
    localStorage.removeItem("vax_patients");
    localStorage.removeItem("vax_inventory");
    localStorage.removeItem("vax_cold_chain");
    localStorage.removeItem("vax_feedback");
    localStorage.removeItem("vax_audit_logs");
    localStorage.removeItem("vax_notifications");
    
    setPatients(initialPatients);
    setInventory(initialInventory);
    setColdChain(initialColdChain);
    setFeedbacks(mockFeedback);
    setNotifications(initialNotifications);
    setAuditLogs(initialAuditLogs);

    addAuditLog("System Data Wiped", "Cleared sandboxed state database back to WHO baseline parameters.");
    alert("Database baseline restored successfully!");
  };

  // Toggle offline off-grid simulator mode
  const handleToggleOffline = () => {
    if (isOfflineMode) {
      // Transitioning BACK ONLINE - Sync offline entries buffer
      setIsOfflineMode(false);
      
      if (offlineBuffer.length > 0) {
        setPatients(prev => [...offlineBuffer, ...prev]);
        addAuditLog("Synchronized Outpost Caches", `Reconnected back to cloud. Merged ${offlineBuffer.length} child registrations successfully.`);
        alert(`🛰️ Connectivity restored!\nSynchronized ${offlineBuffer.length} buffered registrations from Tharparkar Outpost cleanly!`);
        setOfflineBuffer([]);
      } else {
        addAuditLog("Network Session Restoration", "System connected to high-speed fiber.");
      }
    } else {
      setIsOfflineMode(true);
      addAuditLog("Outpost Disconnected Mode", "Simulated un-connected rural ward session. Buffers active.");
    }
  };

  // Global Search everywhere trigger
  const handleGlobalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalSearch) return;

    // Direct user back to Intake page to show searches
    setActiveTab("patient-intake");
    setMobileMenuOpen(false);
  };

  // Core navigation configurations
  const menuItems = [
    { id: "dashboard", label: "Executive Dashboard", icon: LayoutDashboard },
    { id: "patient-intake", label: "Registered Intake POS", icon: UserPlus },
    { id: "inventory", label: "Vaccine Warehouse", icon: Syringe },
    { id: "cold-chain", label: "Cold Chain Status", icon: Thermometer },
    { id: "scanner", label: "Vial Barcode Scan", icon: QrCode },
    { id: "reconciliation", label: "EOD Reconciliation", icon: ClipboardCheck },
    { id: "notifications", label: "Outbox SMS Gateway", icon: BellRing },
    { id: "testimonials", label: "Outpost Testimonials", icon: HeartHandshake },
    { id: "reports", label: "Reports & Audit Hub", icon: FilePieChart },
    { id: "settings", label: "Configurations Core", icon: Settings },
  ];

  // Dark mode trigger toggler
  const handleDarkModeToggle = () => {
    if (darkMode) {
      setDarkMode(false);
      localStorage.setItem("vax_dark_mode", "false");
      document.documentElement.classList.remove("dark");
    } else {
      setDarkMode(true);
      localStorage.setItem("vax_dark_mode", "true");
      document.documentElement.classList.add("dark");
    }
  };

  // 1. Force Login Check
  if (!session) {
    return <LoginPage onLoginSuccess={handleLogin} />;
  }

  // Active view router matcher
  const renderSelectedTab = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardPage 
            patients={patients} 
            inventory={inventory} 
            coldChain={coldChain} 
            auditLogs={auditLogs}
            onNavigate={(view) => setActiveTab(view)}
          />
        );
      case "patient-intake":
        return (
          <POSPage 
            patients={patients} 
            inventory={inventory} 
            currentSession={session}
            onAddPatient={handleAddPatient}
            onAdministerVaccine={handleAdministerVaccine}
          />
        );
      case "inventory":
        return (
          <InventoryPage 
            inventory={inventory} 
            currentSession={session}
            onAddStock={handleAddStock}
            onDeleteBatch={handleDeleteBatch}
          />
        );
      case "cold-chain":
        return (
          <ColdChainPage 
            coldChain={coldChain} 
            onUpdateCoolerTemp={handleUpdateCoolerTemp}
          />
        );
      case "scanner":
        return (
          <ScannerPage 
            inventory={inventory} 
            onAddStock={handleAddStock}
          />
        );
      case "reconciliation":
        return (
          <ReconciliationPage 
            inventory={inventory} 
            currentSession={session}
            onCompleteReconciliation={handleCompleteReconciliation}
          />
        );
      case "notifications":
        return (
          <NotificationsPage 
            notifications={notifications} 
            patients={patients}
            onAddNotification={handleAddNotification}
            onDispatchNotification={handleDispatchNotification}
            onClearQueue={handleClearNotifications}
          />
        );
      case "testimonials":
        return (
          <TestimonialsPage 
            feedbacks={feedbacks} 
            onAddFeedback={handleAddFeedback}
          />
        );
      case "reports":
        return (
          <ReportsPage 
            patients={patients} 
            inventory={inventory} 
            coldChain={coldChain}
          />
        );
      case "settings":
        return (
          <SettingsPage 
            currentSession={session} 
            onChangeUserRole={(role) => setSession({ ...session, role })}
            onClearDatabase={handleClearDatabase}
            isOfflineMode={isOfflineMode}
            onToggleOffline={handleToggleOffline}
            offlineBufferCount={offlineBuffer.length}
          />
        );
      default:
        return <div className="text-center p-12 text-slate-400 text-xs">Tab node under build</div>;
    }
  };

  return (
    <div id="vax-root-layout" className={`min-h-screen bg-slate-50 flex ${darkMode ? "dark bg-slate-950 text-slate-100" : "text-slate-900"}`}>
      
      {/* 2. Side navigation board */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-300 shrink-0 sticky top-0 h-screen justify-between z-30">
        <div>
          {/* Logo container details */}
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <span className="p-1.5 bg-blue-600 rounded-lg text-white">
              <ShieldCheck size={18} />
            </span>
            <div>
              <span className="text-sm font-bold text-white tracking-wide block font-display">VaccineShield Pro</span>
              <span className="text-[9px] uppercase tracking-wider block text-slate-400">IMMUNIZATION POS</span>
            </div>
          </div>

          {/* Nav list */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition cursor-pointer ${
                    isSelected 
                      ? "bg-blue-600 font-bold text-white shadow-md shadow-blue-900/10" 
                      : "hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon size={15} /> {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer profile log details */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-xs text-slate-400 space-y-2.5">
          <div className="flex justify-between items-center bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/60">
            <div className="truncate pr-1">
              <span className="block font-bold text-white truncate text-[11px]">{session.fullName}</span>
              <span className="block text-[9px] text-slate-500 font-mono italic">{session.role} credentials</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 hover:bg-red-800 hover:text-white rounded-lg transition shrink-0 cursor-pointer text-slate-400"
              title="Terminate session security"
            >
              <LogOut size={13} />
            </button>
          </div>
          <p className="text-[8px] font-mono tracking-wide text-center text-slate-600 uppercase">SYS CERTIFICATION: SECURE REG</p>
        </div>
      </aside>

      {/* 3. Mobile Navigation dropdown header */}
      <div className="lg:hidden">
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-slate-905 bg-opacity-80 z-40" onClick={() => setMobileMenuOpen(false)} />
        )}
        <div className={`fixed inset-y-0 left-0 max-w-xs w-full bg-slate-900 z-50 transform transition duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div className="p-5 border-b border-slate-800 flex justify-between items-center">
            <span className="text-white font-bold text-sm tracking-wider font-display shrink-0">🛡️ VaccineShield Pro</span>
            <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
              <X size={18} />
            </button>
          </div>
          
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition cursor-pointer ${
                    isSelected 
                      ? "bg-blue-600 font-extrabold text-white" 
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Icon size={15} /> {item.label}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800 absolute bottom-0 left-0 right-0">
            <button
              onClick={handleLogout}
              className="w-full py-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <LogOut size={13} /> Terminate session
            </button>
          </div>
        </div>
      </div>

      {/* 4. Main Body space container */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Sticky top executive Header */}
        <header className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 z-20 px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <Menu size={18} />
            </button>
            
            {/* Search Everywhere Bar Form */}
            <form onSubmit={handleGlobalSearchSubmit} className="hidden sm:flex items-center relative w-60 lg:w-72">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search size={14} />
              </span>
              <input
                id="search-everywhere-input"
                type="text"
                placeholder="Search everywhere..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs font-medium focus:bg-white"
              />
            </form>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Safe connectivity alerts */}
            {isOfflineMode ? (
              <span className="px-2 py-1 bg-red-50 text-red-700 text-[10px] font-bold border border-red-100 rounded-lg flex items-center gap-1">
                <WifiOff size={11} className="animate-pulse" /> Off-grid Outpost Mode (Tharparkar)
              </span>
            ) : (
              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100 rounded-lg flex items-center gap-1">
                <Wifi size={11} /> National Sync Active
              </span>
            )}

            {/* Simulated Live System Clock */}
            <span className="hidden md:flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[10px] text-slate-500">
              <Clock size={11} />
              {currentTime.toUTCString().replace("GMT", "UTC")}
            </span>

            {/* Dark & Light toggle */}
            <button
              onClick={handleDarkModeToggle}
              className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition shadow-3xs"
            >
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </header>

        {/* 5. Fluid responsive content tab container */}
        <div className="p-4 lg:p-7 max-w-7xl mx-auto w-full space-y-6">
          {renderSelectedTab()}
        </div>

      </main>

    </div>
  );
}
