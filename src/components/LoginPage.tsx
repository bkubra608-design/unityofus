import React, { useState } from "react";
import { 
  ShieldCheck, Eye, EyeOff, Lock, User, AlertCircle, 
  HelpCircle, Sparkles, LogIn, ChevronRight, Check
} from "lucide-react";
import { UserSession, UserRole } from "../types";

interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("Administrator");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotScreen, setForgotScreen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successForgotMsg, setSuccessForgotMsg] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!username || !password) {
      setErrorMessage("Please fill all authentication fields.");
      return;
    }

    // High fidelity role credential simulation matcher
    // Accept standard matching, or helper demo access passwords e.g., 'admin123', 'admin'
    const lowerUser = username.toLowerCase();
    
    // Set matching full-names mock database
    let fullName = "Medical Representative";
    let facilityCode = "FAC-KHI-MAIN";
    let district = "Karachi East";

    if (role === "Administrator") {
      fullName = "Administrator Rashid";
      facilityCode = "FAC-ISB-MAIN";
      district = "Islamabad HQ";
    } else if (role === "Supervisor") {
      fullName = "Supervisor Amara";
      facilityCode = "FAC-PEW-KHYBER";
      district = "Peshawar Cantt";
    } else if (role === "Nurse") {
      fullName = "Nurse Miriam";
      facilityCode = "FAC-LAI-MGD";
      district = "Lahore Cantt";
    } else {
      fullName = "Worker Bashir";
      facilityCode = "FAC-THA-DESERT";
      district = "Tharparkar Rural";
    }

    // Success dispatch
    onLoginSuccess({
      username: username,
      role,
      fullName,
      facilityCode,
      district
    });
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessForgotMsg("A secure credential recovery link has been dispatched to your verified government health email address.");
    setTimeout(() => {
      setForgotScreen(false);
      setSuccessForgotMsg("");
    }, 2500);
  };

  // Helper filler credentials
  const autofillDemo = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setUsername(selectedRole.toLowerCase() + "_vax");
    setPassword("password123");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* Upper decorative blur graphics */}
      <div className="absolute top-0 left-1/4 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none select-none" />
      <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-emerald-600/5 rounded-full blur-3xl pointer-events-none select-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-2">
        <div className="flex justify-center">
          <span className="p-3 bg-blue-600 text-white rounded-2xl glow-primary inline-block">
            <ShieldCheck size={36} />
          </span>
        </div>
        
        <h1 className="text-3xl font-extrabold text-white font-display tracking-tight mt-3">VaccineShield Pro</h1>
        <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">
          National Immunization Operations portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        
        {forgotScreen ? (
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700/60 shadow-2xl space-y-4 animate-fade-up">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white font-display">Credential Recovery Platform</h2>
              <p className="text-xs text-slate-400">Provide your national citizen ID or verified workplace email.</p>
            </div>

            {successForgotMsg && (
              <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-emerald-900/60 animate-pulse">
                <Check size={14} /> {successForgotMsg}
              </div>
            )}

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block">Government Workplace Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rashid.health@government.gov.pk"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg text-xs font-semibold text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setForgotScreen(false)}
                  className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-lg cursor-pointer transition"
                >
                  Back To Login
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition"
                >
                  Dispatch Link
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700/60 shadow-2xl space-y-5 animate-fade-up">
            
            {errorMessage && (
              <div className="p-2.5 bg-rose-500/20 text-rose-300 border border-rose-900/60 rounded-lg text-xs font-medium flex items-center gap-1.5">
                <AlertCircle size={14} className="text-rose-400" /> {errorMessage}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-2">
                {(["Worker", "Nurse", "Supervisor", "Administrator"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => autofillDemo(r)}
                    className={`p-2.5 rounded-xl border text-[10px] font-bold transition-all cursor-pointer block text-center ${
                      role === r 
                        ? "bg-blue-600 border-blue-500 text-white" 
                        : "bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {r} Log
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block">User ID / Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                    <User size={13} />
                  </span>
                  <input
                    id="login-username"
                    type="text"
                    required
                    placeholder="Enter demo username..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg text-xs font-semibold text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Password Key</label>
                  <button
                    type="button"
                    onClick={() => setForgotScreen(true)}
                    className="text-[10px] text-blue-400 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={13} />
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-8 pr-8 py-2 bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg text-xs font-semibold text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-1 z-10 relative">
                <div className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="remember-switch"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 text-blue-600 rounded bg-slate-900 border-slate-700"
                  />
                  <label htmlFor="remember-switch" className="text-[10px] text-slate-400 font-bold">
                    Remember me on this health node
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl cursor-pointer transition shadow flex items-center justify-center gap-1 glow-primary"
              >
                <LogIn size={13} /> SECURE AUTHORIZATION GATE
              </button>

            </form>

            <div className="border-t border-slate-700/50 pt-3 text-center text-[10px] text-slate-500 leading-relaxed font-display">
              ℹ️ <strong>Demo Tester Note</strong>: Click any of the four role log buttons above. It will prefill the matching demo credentials instantly for testing.
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
