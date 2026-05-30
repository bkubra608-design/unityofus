import React, { useState } from "react";
import { 
  HeartHandshake, Star, Plus, CheckCircle2, MessageSquare, 
  MapPin, Compass, ShieldAlert, Sparkles
} from "lucide-react";
import { FieldFeedback, UserRole } from "../types";

interface TestimonialsPageProps {
  feedbacks: FieldFeedback[];
  onAddFeedback: (feedback: FieldFeedback) => void;
}

export default function TestimonialsPage({ feedbacks, onAddFeedback }: TestimonialsPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("Nurse");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [facility, setFacility] = useState("");
  const [successStory, setSuccessStory] = useState(false);

  // Aggregate stats
  const totalComments = feedbacks.length;
  const averageRating = totalComments > 0
    ? Math.round((feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalComments) * 10) / 10
    : 5;

  // Star analytics counters
  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  feedbacks.forEach(f => {
    const r = f.rating as 5|4|3|2|1;
    if (starCounts[r] !== undefined) starCounts[r]++;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment || !facility) {
      alert("Please fill name, comment, and facility parameters.");
      return;
    }

    const newFeedback: FieldFeedback = {
      id: `F-${Math.floor(100 + Math.random() * 900)}`,
      name,
      role,
      rating,
      comment,
      date: new Date().toISOString().split("T")[0],
      facility,
      successStory
    };

    onAddFeedback(newFeedback);
    setShowForm(false);
    
    // reset
    setName("");
    setComment("");
    setFacility("");
    setSuccessStory(false);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Intro Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
            <HeartHandshake size={20} className="text-blue-500" /> Vaccine Outreach Field Testimonials
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Collect real critiques, mobile campaign reports, and qualitative performance feedback from healthcare workers operating in rural wards.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl cursor-pointer transition shadow flex items-center gap-1.5"
        >
          <Plus size={14} /> Submit Field Story
        </button>
      </div>

      {/* Grid: Feedback Analytics and Feed List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column rating analytics */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-display pb-2 border-b border-slate-50">
            Operations satisfaction
          </h3>

          {/* Average Rating big Card */}
          <div className="text-center p-5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">{averageRating} / 5</span>
            <div className="flex justify-center gap-0.5 mt-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  fill={i < Math.round(averageRating) ? "currentColor" : "none"} 
                />
              ))}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Derived from {totalComments} verified field logs</p>
          </div>

          {/* Scale distribution lists with progress bars */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(stars => {
              const count = starCounts[stars as 5|4|3|2|1] || 0;
              const percent = totalComments > 0 ? (count / totalComments) * 100 : 0;
              
              return (
                <div key={stars} className="flex items-center gap-2.5 text-xs">
                  <span className="w-8 font-semibold text-slate-600 font-mono flex items-center gap-0.5 shrink-0">
                    {stars} <Star size={11} className="text-amber-400" />
                  </span>
                  
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <span className="w-4 text-right font-mono font-medium text-slate-400">{count}</span>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-200/40 text-[11px] text-slate-500 leading-relaxed font-display">
            🌿 <strong>System Health Indicator</strong>: Active worker satisfaction matches peak WHO standards. Standardizer compliance metrics show full administrative support.
          </div>
        </div>

        {/* Right column reviews catalog */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Submit Story form conditional */}
          {showForm && (
            <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-md animate-fade-up">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 mb-3">
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest font-display flex items-center gap-1">
                  <MessageSquare size={13} className="text-blue-500" /> Catalog Field Review comments
                </h3>
                <button 
                  onClick={() => setShowForm(false)} 
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block">Your Full Name *</label>
                    <input
                      id="rev-name"
                      type="text"
                      required
                      placeholder="e.g. Dr. Amara Saeed"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:bg-white focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block">Outpost Facility / Camp *</label>
                    <input
                      id="rev-fac"
                      type="text"
                      required
                      placeholder="e.g. Mayo Town Mobile Outpost"
                      value={facility}
                      onChange={(e) => setFacility(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block">Clinic Role Status</label>
                    <select
                      value={role}
                      onChange={(e: any) => setRole(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                    >
                      <option value="Worker">Health Worker</option>
                      <option value="Nurse">Field Nurse</option>
                      <option value="Supervisor">Supervisor</option>
                      <option value="Administrator">Administrator</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block">Star rating (1 - 5)</label>
                    <input
                      id="rev-rating"
                      type="number"
                      required
                      min="1"
                      max="5"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1 font-display">
                  <div className="flex gap-2.5 items-center">
                    <input
                      type="checkbox"
                      id="rev-story"
                      checked={successStory}
                      onChange={(e) => setSuccessStory(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded bg-slate-50 border-slate-300"
                    />
                    <label htmlFor="rev-story" className="text-xs text-slate-600 font-bold select-none cursor-pointer">
                      🛡️ Tag as "Field Success Story" (Highlight story badge)
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Commentary narrative</label>
                  <textarea
                    id="rev-comment"
                    required
                    placeholder="Describe how VaccineShield Pro software assisted during local campaign checks..."
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg cursor-pointer hover:bg-blue-700 transition"
                  >
                    Post Field Feedback
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Testimonial card listings */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {feedbacks.map(fee => (
              <div 
                key={fee.id} 
                className={`p-4 rounded-xl border space-y-2.5 shadow-3xs ${
                  fee.successStory 
                    ? "bg-slate-50 border-blue-200/50 outline outline-4 outline-blue-50/10" 
                    : "bg-white border-slate-100"
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                      {fee.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">{fee.name}</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[8px] text-slate-500 font-bold">{fee.role}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 mt-0.5 flex items-center gap-0.5">
                        <MapPin size={10} /> {fee.facility} • {fee.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex text-amber-400 gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={11} 
                        fill={i < fee.rating ? "currentColor" : "none"} 
                      />
                    ))}
                  </div>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed italic pr-2 font-display">
                  &quot;{fee.comment}&quot;
                </p>

                {fee.successStory && (
                  <span className="text-[8px] uppercase tracking-widest text-emerald-700 font-extrabold bg-emerald-100/60 p-1 px-2 rounded-md inline-flex items-center gap-1 select-none">
                    <Sparkles size={10} /> Verified Outpost Campaign Success Story
                  </span>
                )}
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
