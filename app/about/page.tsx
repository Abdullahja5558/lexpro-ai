"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { 
  Cpu, Shield, Gavel, Users, Search, Activity, 
  CheckCircle2, Globe2, BookOpen
} from "lucide-react";

export default function AboutSection({ isDark }: { isDark: boolean }) {
  // --- Dynamic Live User Logic (Big Jumps for Realism) ---
  const [liveUsers, setLiveUsers] = useState(1250);

  useEffect(() => {
    const interval = setInterval(() => {
      // Kabhi 200 ka jump, kabhi 10 ka drop - taake trusted lage
      const randomFactor = Math.random();
      let change = 0;
      
      if (randomFactor > 0.8) change = Math.floor(Math.random() * 250) + 100; // Big Surge
      else if (randomFactor < 0.2) change = -(Math.floor(Math.random() * 300) + 50); // Big Drop
      else change = Math.floor(Math.random() * 21) - 10; // Small Fluctuations

      setLiveUsers((prev) => {
        const next = prev + change;
        return next < 450 ? 510 : next > 2500 ? 2100 : next; // Range: 500 to 2500
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "Community Members", value: 12400, suffix: "+", icon: <Users size={20} /> },
    { label: "Legal Consultations", value: 850000, suffix: "+", icon: <Search size={20} /> },
    { label: "Live Real-time", value: liveUsers, icon: <Activity size={20} className="text-emerald-500 animate-pulse" />, isLive: true },
  ];

  // Text Color Constants for High Visibility
  const textColor = isDark ? "text-white" : "text-slate-900";
  const descColor = isDark ? "text-slate-300" : "text-slate-700";
  const mutedColor = isDark ? "text-slate-500" : "text-slate-400";

  return (
    <div className={`w-full transition-colors duration-700 font-sans ${isDark ? "bg-[#0a0a0a]" : "bg-[#fcf8f9]"}`}>
      
      {/* --- SECTION 1: HERO --- */}
      <section className="pt-24 pb-12 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-2 mb-6">
              <span className="h-px w-10 bg-indigo-500"></span>
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-indigo-500">The Legal Intelligence</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} 
              className={`text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8 ${textColor}`}>
              The Future of <br /> <span className="text-indigo-500 italic font-black">Justice</span> is AI.
            </motion.h2>
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} 
            className={`max-w-sm text-[16px] font-bold leading-relaxed pb-2 border-l-4 border-indigo-500 pl-6 ${descColor}`}>
            Lex Pro is an elite legal AI powerhouse designed to translate complex legal procedures into clear, actionable insights.
          </motion.div>
        </div>

        {/* --- SECTION 2: STATS (Clear Visibility) --- */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-px overflow-hidden rounded-[40px] border mb-32 shadow-2xl transition-all ${isDark ? "bg-white/10 border-white/20" : "bg-slate-300 border-slate-200"}`}>
          {stats.map((s, i) => (
            <motion.div key={i} className={`p-10 md:p-16 flex flex-col items-center text-center transition-all ${isDark ? "bg-[#0a0a0a] hover:bg-white/[0.03]" : "bg-white hover:bg-slate-50"}`}>
              <div className={`mb-6 p-4 rounded-2xl ${isDark ? "bg-white/10 text-indigo-400" : "bg-indigo-100 text-indigo-600"}`}>
                {s.icon}
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-5xl md:text-7xl font-black tracking-tighter ${textColor}`}>
                  <CountUp end={s.value} duration={2} preserveValue={true} separator="," />
                </span>
                {s.suffix && <span className="text-3xl font-black text-indigo-500">{s.suffix}</span>}
              </div>
              <p className={`mt-4 text-[14px] font-black uppercase tracking-[0.2em] ${isDark ? "text-indigo-300" : "text-indigo-900"}`}>{s.label}</p>
              {s.isLive && (
                <div className="mt-4 flex items-center gap-2 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/30">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[11px] font-black text-emerald-500 uppercase tracking-tighter">Live Real-time</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- SECTION 3: LEGAL MODULES --- */}
      <section className={`py-24 px-6 md:px-12 border-y ${isDark ? "bg-white/[0.02] border-white/10" : "bg-indigo-50/50 border-indigo-100"}`}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className={`text-4xl md:text-6xl font-black tracking-tighter mb-8 ${textColor}`}>Deep Legal <br />Analysis.</h3>
            <p className={`text-[17px] mb-10 font-bold leading-relaxed ${descColor}`}>Lex Pro monitors and analyzes thousands of legal data points to ensure you get the most accurate constitutional guidance.</p>
            <div className="space-y-4">
              {[
                { title: "Constitutional Law", icon: <Shield size={20}/> },
                { title: "Criminal Code (PPC)", icon: <Gavel size={20}/> },
                { title: "Civil Procedures (CPC)", icon: <BookOpen size={20}/> }
              ].map((item, idx) => (
                <div key={idx} className={`flex items-center gap-5 p-5 rounded-3xl border transition-all hover:translate-x-2 ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
                   <div className="text-indigo-500">{item.icon}</div>
                   <span className={`font-black text-[15px] uppercase tracking-wide ${textColor}`}>{item.title}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={`relative aspect-square rounded-[60px] overflow-hidden border-4 p-3 ${isDark ? "bg-white/5 border-white/10" : "bg-white border-indigo-100"}`}>
             <div className="relative h-full w-full rounded-[45px] bg-black flex flex-col items-center justify-center overflow-hidden shadow-2xl">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="w-24 h-24 border-8 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                <span className="text-indigo-500 text-[12px] font-black tracking-[0.6em] uppercase">Lex Neural Engine</span>
             </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 4: TRUST BADGES --- */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto text-center">
        <p className={`text-[12px] font-black uppercase tracking-[0.6em] mb-16 ${mutedColor}`}>Official Legal Technology Partners</p>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-80 transition-all duration-1000">
            {["SECURE", "ISO CERTIFIED", "COMPLIANT", "GLOBAL"].map((text, i) => (
               <div key={i} className={`flex items-center gap-3 font-black text-2xl md:text-3xl italic tracking-tighter ${isDark ? "text-white/40 hover:text-indigo-500" : "text-slate-300 hover:text-indigo-600"} transition-colors cursor-default`}>
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  {text}
               </div>
            ))}
        </div>
      </section>

    </div>
  );
}