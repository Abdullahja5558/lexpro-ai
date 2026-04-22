"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  Cpu,
  Shield,
  Gavel,
  Users,
  Search,
  Activity,
  BookOpen,
  MessageSquare,
  ArrowLeft,
  Zap,
  Database,
  Lock,
  ShieldCheck,
  Award,
  Globe,
} from "lucide-react";

export default function AboutSection({ isDark }: { isDark: boolean }) {
  const START_DATE = new Date("2026-04-19").getTime();

  const [statsValues, setStatsValues] = useState({
    community: 1200,
    consultations: 85000,
    liveUsers: 422, // Starting at a more "random" looking number
  });

  useEffect(() => {
    const updateNumbers = () => {
      const now = new Date().getTime();
      const secondsElapsed = Math.floor((now - START_DATE) / 1000);
      const twoMinutesInSeconds = 120;

      // 1. Community: Growth logic preserved
      const communityGrowth = Math.floor(
        (secondsElapsed / twoMinutesInSeconds) * 23,
      );

      // 2. Legal: Growth logic preserved
      const legalGrowth = Math.floor(
        (secondsElapsed / twoMinutesInSeconds) * 132,
      );

      // 3. New "Jitter" Live Logic: Randomizes between 100 and 850 with sudden shifts
      const generateRandomLive = () => {
        const chance = Math.random();
        if (chance > 0.9) return Math.floor(Math.random() * (850 - 600) + 600); // Sudden Spike
        if (chance < 0.1) return Math.floor(Math.random() * (200 - 50) + 50); // Sudden Drop
        return Math.floor(Math.random() * (600 - 200) + 200); // Normal Range
      };

      setStatsValues((prev) => ({
        community: 1200 + communityGrowth,
        consultations: 85000 + legalGrowth,
        liveUsers: generateRandomLive(),
      }));
    };

    updateNumbers();
    // Setting interval to 3 seconds for more "active" feel
    const interval = setInterval(updateNumbers, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: "Community Members",
      value: statsValues.community,
      suffix: "+",
      icon: <Users size={20} />,
    },
    {
      label: "Legal Consultations",
      value: statsValues.consultations,
      suffix: "+",
      icon: <Search size={20} />,
    },
    {
      label: "Live Real-time",
      value: statsValues.liveUsers,
      icon: <Activity size={20} className="text-emerald-500 animate-pulse" />,
      isLive: true,
    },
  ];

  const textColor = isDark ? "text-white" : "text-slate-900";
  const descColor = isDark ? "text-slate-300" : "text-slate-700";
  const mutedColor = isDark ? "text-slate-500" : "text-slate-400";

  return (
    <div
      className={`w-full transition-colors duration-700 font-sans selection:bg-indigo-500 selection:text-white ${isDark ? "bg-[#0a0a0a]" : "bg-[#fcf8f9]"}`}
    >
      {/* --- BACK BUTTON --- */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => (window.location.href = "/dashboard")}
        className="fixed top-8 right-8 z-100 flex items-center gap-3 px-6 py-3 rounded-full bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all cursor-pointer group"
      >
        <ArrowLeft
          size={18}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="hidden md:inline">Back to Chat</span>
        <MessageSquare size={18} className="md:hidden" />
      </motion.button>

      {/* --- SECTION 1: HERO --- */}
      <section className="pt-32 pb-12 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-6"
            >
              <span className="h-px w-10 bg-indigo-500"></span>
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-indigo-500">
                The Legal Intelligence
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8 ${textColor}`}
            >
              The Future of <br />{" "}
              <span className="text-indigo-500 font-black">Justice.⚖️</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={`max-w-sm text-[16px] font-bold leading-relaxed pb-2 border-l-4 border-indigo-500 pl-6 ${descColor}`}
          >
            Lex Pro is an elite legal AI powerhouse designed to translate
            complex legal procedures into clear, actionable insights.
          </motion.div>
        </div>

        {/* --- STATS GRID --- */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-px overflow-hidden rounded-[40px] border mb-32 shadow-2xl transition-all ${isDark ? "bg-white/10 border-white/20" : "bg-slate-300 border-slate-200"}`}
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className={`p-10 md:p-16 flex flex-col items-center text-center transition-all ${isDark ? "bg-[#0a0a0a] hover:bg-white/3" : "bg-white hover:bg-slate-50"}`}
            >
              <div
                className={`mb-6 p-4 rounded-2xl ${isDark ? "bg-white/10 text-indigo-400" : "bg-indigo-100 text-indigo-600"}`}
              >
                {s.icon}
              </div>
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-4xl md:text-6xl font-black tracking-tighter ${textColor}`}
                >
                  <CountUp end={s.value} duration={1} separator="," />
                </span>
                {s.suffix && (
                  <span className="text-2xl font-black text-indigo-500">
                    {s.suffix}
                  </span>
                )}
              </div>
              <p
                className={`mt-4 text-[14px] font-black uppercase tracking-[0.2em] ${isDark ? "text-indigo-300" : "text-indigo-900"}`}
              >
                {s.label}
              </p>
              {s.isLive && (
                <div className="mt-4 flex items-center gap-2 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/30">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[11px] font-black text-emerald-500 uppercase tracking-tighter">
                    Live Real-time
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- SECTION 3: ENGINE --- */}
      <section
        className={`py-24 px-6 md:px-12 border-y ${isDark ? "bg-white/2 border-white/10" : "bg-indigo-50/50 border-indigo-100"}`}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h3
              className={`text-4xl md:text-6xl font-black tracking-tighter mb-8 ${textColor}`}
            >
              LEXPRO AI <br />
              ENGINE
            </h3>
            <p
              className={`text-[17px] mb-10 font-bold leading-relaxed ${descColor}`}
            >
              Lex Pro monitors and analyzes thousands of legal data points to
              ensure you get the most accurate constitutional guidance.
            </p>
            <div className="space-y-4">
              {[
                { title: "Constitutional Law", icon: <Shield size={20} /> },
                { title: "Criminal Code (PPC)", icon: <Gavel size={20} /> },
                {
                  title: "Civil Procedures (CPC)",
                  icon: <BookOpen size={20} />,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-5 p-5 rounded-3xl border transition-all hover:translate-x-2 ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}
                >
                  <div className="text-indigo-500">{item.icon}</div>
                  <span
                    className={`font-black text-[15px] uppercase tracking-wide ${textColor}`}
                  >
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`relative aspect-square rounded-[60px] overflow-hidden border-4 flex items-center justify-center ${isDark ? "bg-[#08090a] border-white/10" : "bg-slate-200 border-indigo-100 shadow-inner"}`}
          >
            <div className="absolute inset-0 ">
              <img
                className="w-full h-full object-cover"
                src="chip.png"
                alt=""
              />

              <svg width="100%" height="100%" className="absolute inset-0">
                <path
                  d="M0 100 H500 M0 200 H500 M0 300 H500 M100 0 V500 M200 0 V500 M300 0 V500"
                  stroke="#4F46E5"
                  strokeWidth="0.5"
                  fill="none"
                />

                <path
                  d="M50 50 L150 150 M450 50 L350 150 M50 450 L150 350 M450 450 L350 350"
                  stroke="#6366f1"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  fill="none"
                />

                <circle cx="150" cy="150" r="3" fill="#818cf8" />

                <circle cx="350" cy="150" r="3" fill="#818cf8" />

                <circle cx="150" cy="350" r="3" fill="#818cf8" />

                <circle cx="350" cy="350" r="3" fill="#818cf8" />
              </svg>
            </div>

            <div className="absolute w-64 h-64 bg-slate-900/50 rounded-[40px] border border-indigo-500/20 shadow-2xl"></div>
            <div className="relative z-10 w-56 h-56 bg-[#121212] rounded-2xl border-4 border-slate-800 flex items-center justify-center">
              {[0, 90, 180, 270].map((deg, i) => (
                <div
                  key={i}
                  className="absolute w-full h-full"
                  style={{ transform: `rotate(${deg}deg)` }}
                >
                  <div className="flex justify-around w-full -mt-4 px-6">
                    {[1, 2, 3, 4, 5].map((p) => (
                      <div
                        key={p}
                        className="w-2 h-5 bg-linear-to-b from-yellow-600 to-yellow-800 rounded-b-sm"
                      />
                    ))}
                  </div>
                </div>
              ))}
              <div className="w-[88%] h-[88%] bg-linear-to-br from-[#1e1e1e] to-[#0a0a0a] rounded-xl border border-white/5 p-1 flex items-center justify-center">
                <div className="w-full h-full rounded-lg bg-[#111] border border-indigo-500/10 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-500/5 blur-3xl opacity-50"></div>
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/5 relative z-10">
                    <Cpu
                      size={56}
                      className="text-indigo-500/80"
                      strokeWidth={1}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h3
            className={`text-3xl md:text-5xl font-black tracking-tighter ${textColor}`}
          >
            Engineered for Precision.
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Neural Indexing",
              desc: "Proprietary vector database for instant case law retrieval.",
              icon: <Database />,
            },
            {
              title: "Zero-Knowledge",
              desc: "Your data is encrypted. Even our AI doesn't 'know' your identity.",
              icon: <Lock />,
            },
            {
              title: "Real-time Sync",
              desc: "Updated hourly with the latest Supreme Court rulings.",
              icon: <Zap />,
            },
          ].map((feat, i) => (
            <div
              key={i}
              className={`p-8 rounded-4xl border transition-all group hover:-translate-y-2 ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-xl"}`}
            >
              <div className="mb-6 text-indigo-500 group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h4 className={`text-xl font-black mb-3 ${textColor}`}>
                {feat.title}
              </h4>
              <p className={`text-sm leading-relaxed ${descColor}`}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECTION 5: */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <p
          className={`text-[11px] font-bold uppercase tracking-[0.4em] mb-12 ${mutedColor} opacity-70`}
        >
          Official Legal Technology Partners
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
          {[
            { text: "SECURE", icon: <ShieldCheck size={20} /> },
            { text: "ISO CERTIFIED", icon: <Award size={20} /> },
            { text: "COMPLIANT", icon: <Lock size={20} /> },
            { text: "GLOBAL", icon: <Globe size={20} /> },
          ].map((badge, i) => (
            <div
              key={i}
              className={`group flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 ${isDark ? "bg-white/5 border-white/10 text-white/50" : "bg-slate-50 border-slate-200 text-slate-400"}`}
            >
              <span
                className={`${isDark ? "text-indigo-400" : "text-indigo-600"}`}
              >
                {badge.icon}
              </span>
              <span className="text-xs md:text-sm font-black tracking-widest uppercase">
                {badge.text}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
