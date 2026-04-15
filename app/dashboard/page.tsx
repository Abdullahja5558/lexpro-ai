"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Scale, Sparkles, Loader2, Square, 
  Settings, Gavel, BookOpen, ShieldCheck, RefreshCw,
  Moon, Sun, Cpu, Zap, Crown, Check, AlertCircle, Copy,
  UserCircle2, FileText
} from "lucide-react";
import { useRouter } from "next/navigation"; 

// --- Sub-Components ---

const Typewriter = ({ text, speed = 10 }: { text: string; speed?: number }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return <span>{displayedText}</span>;
};

const PromptCard = ({ p, isDark, onClick }: any) => (
  <motion.div 
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`p-4 md:p-5 rounded-[24px] md:rounded-[28px] border shadow-sm cursor-pointer transition-all flex items-center md:flex-col md:items-start gap-3 md:gap-4 md:min-h-[150px] md:justify-between overflow-hidden ${
      isDark ? "bg-white/5 border-white/10 hover:bg-white/10 text-white" : "bg-white/70 backdrop-blur-xl border-white/50 hover:bg-white text-slate-800"
    }`}
  >
    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 transition-all ${isDark ? "bg-white text-black" : "bg-[#1a1a1a] text-white"}`}>
      {p.icon}
    </div>
    <div className="flex flex-col overflow-hidden w-full">
      <p className="font-bold text-[12px] md:text-[14px] uppercase tracking-wider line-clamp-1 mb-0.5 md:mb-1 leading-tight">{p.title}</p>
      <p className={`text-[11px] md:text-[12px] font-medium line-clamp-2 leading-snug ${isDark ? "text-slate-400" : "text-slate-500"}`}>{p.desc}</p>
    </div>
  </motion.div>
);

// --- Constants ---
const initialPrompts = [
  { title: "Article 199", desc: "High Court's Writ Jurisdiction.", icon: <Gavel size={18}/>, query: "Explain the scope of Writ Jurisdiction under Article 199 of the Constitution of Pakistan." },
  { title: "Article 3 (QSO)", desc: "Competency of Witness.", icon: <FileText size={18}/>, query: "Who is a competent witness according to Article 3 of Qanun-e-Shahadat Order 1984?" },
  { title: "Bail (CrPC 497)", desc: "Procedure for Grant of Bail.", icon: <Scale size={18}/>, query: "Explain the law and procedure for the grant of bail in bailable and non-bailable offences under Section 497 of CrPC." },
];

const extraPrompts = [
  { title: "PPC Section 302", desc: "Punishment for Qatl-i-Amd.", icon: <ShieldCheck size={18}/>, query: "What are the essential ingredients and punishments under PPC Section 302?" },
  { title: "Article 163 (QSO)", desc: "Deciding case on Oath.", icon: <BookOpen size={18}/>, query: "What is the procedure and importance of Article 163 of QSO regarding decision on the basis of Oath?" },
  { title: "Dying Declaration", desc: "Article 46(1) QSO.", icon: <FileText size={18}/>, query: "What is a Dying Declaration and its evidentiary value under Article 46(1) of Qanun-e-Shahadat Order?" },
  { title: "Identification Parade", desc: "Article 22 QSO.", icon: <ShieldCheck size={18}/>, query: "Explain the concept and legal requirements of Identification Parade under Article 22 of QSO." },
  { title: "CrPC Section 154", desc: "Registration of FIR procedure.", icon: <BookOpen size={18}/>, query: "What is the legal procedure for lodging an FIR under Section 154 of CrPC?" },
  { title: "Article 184(3)", desc: "Supreme Court's Suo Moto.", icon: <Gavel size={18}/>, query: "Discuss the Suo Moto jurisdiction of the Supreme Court under Article 184(3)." },
];

export default function LexProFinal() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [prompts, setPrompts] = useState(initialPrompts);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [theme, setTheme] = useState("light");
  const [mode, setMode] = useState("Pro");
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("lex-theme") || "light";
    const savedMode = localStorage.getItem("lex-mode") || "Pro";
    setTheme(savedTheme);
    setMode(savedMode);
    const handleDoubleClick = () => setIsSettingsOpen(false);
    window.addEventListener("dblclick", handleDoubleClick);
    return () => window.removeEventListener("dblclick", handleDoubleClick);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("lex-theme", newTheme);
  };

  const updateMode = (newMode: string) => {
    setMode(newMode);
    localStorage.setItem("lex-mode", newMode);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRefreshPrompts = () => {
    const combined = [...initialPrompts, ...extraPrompts];
    const shuffled = combined.sort(() => 0.5 - Math.random());
    setPrompts(shuffled.slice(0, 3));
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, { role: "ai", text: "⚠️ You stopped the generation.", time, isStopped: true }]);
    }
  };

  const handleAsk = async (forcedQuery?: string) => {
    const activeQuery = forcedQuery || query;
    if (loading || !activeQuery.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { role: "user", text: activeQuery, time }]);
    setLoading(true);
    setQuery("");
    const controller = new AbortController();
    abortControllerRef.current = controller;
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: activeQuery, mode }),
        signal: controller.signal,
      });
      const data = await res.json();
      if (!controller.signal.aborted) {
        setMessages(prev => [...prev, { role: "ai", text: data.answer || data.error, time, isNew: true }]);
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        setMessages(prev => [...prev, { role: "ai", text: "Something went wrong. Please try again.", time }]);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        abortControllerRef.current = null;
      }
    }
  };

  const isDark = theme === "dark";

  return (
    <div className={`h-[100dvh] w-full transition-colors duration-700 flex flex-col font-sans overflow-hidden relative ${
      isDark ? "bg-[#0a0a0a] text-white" : "bg-[#f8f2f4] bg-gradient-to-br from-[#f8f2f4] via-[#fcf8f9] to-[#f4ebef] text-slate-900"
    }`}>
      
      {/* 1. Floating Side Logo */}
      <div className="fixed top-6 left-6 md:top-10 md:left-10 flex items-center gap-3 z-[100] pointer-events-none">
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shadow-lg transition-all ${isDark ? "bg-white text-black" : "bg-[#1a1a1a] text-white"}`}>
          <Scale size={20} />
        </div>
        <span className={`font-bold text-[14px] md:text-[16px] tracking-tight transition-colors ${isDark ? "text-white" : "text-slate-800"}`}>
          Lex Pro
        </span>
      </div>

      {/* --- PREMIUM ABOUT BUTTON (Top Right) --- */}
      <button 
        onClick={() => router.push("/about")}
        className="fixed top-6 right-6 md:top-10 md:right-10 flex items-center gap-2 z-[100] group active:scale-95 transition-all cursor-pointer pointer-events-auto"
      >
        <div className={`px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg backdrop-blur-xl border transition-all ${
          isDark ? "bg-white/5 border-white/10 hover:bg-white/10 text-white" : "bg-white/80 border-white text-slate-800 hover:bg-white"
        }`}>
          <UserCircle2 size={18} />
          <span className="text-[12px] md:text-[14px] font-bold uppercase tracking-widest hidden sm:inline">About</span>
        </div>
      </button>

      <main className="flex-1 flex flex-col relative px-4 md:px-6 z-10 overflow-hidden items-center justify-center">
        <AnimatePresence mode="wait">
          {messages.length === 0 ? (
            <motion.div 
  key="hero"
  initial={{ opacity: 0, scale: 0.98 }} 
  animate={{ opacity: 1, scale: 1 }} 
  exit={{ opacity: 0, y: -20 }} 
  /* -mt-12 ya -mt-20 add karne se ye upar shift ho jayega */
  className="w-full flex flex-col items-center justify-center text-center -mt-12 md:-mt-20"
>
  <motion.div 
    initial={{ rotate: -10, scale: 0.8 }} 
    animate={{ rotate: 0, scale: 1 }} 
    className={`w-12 h-12 md:w-16 md:h-16 rounded-[22px] md:rounded-[28px] flex items-center justify-center shadow-2xl mb-6 md:mb-1 transition-all ${isDark ? "bg-white text-black" : "bg-[#1a1a1a] text-white"}`}
  >
    <Sparkles size={28} />
  </motion.div>
  
  <h1 className={`text-3xl md:text-6xl font-bold tracking-tight mb-2 md:mb-2 ${isDark ? "text-white" : "text-[#1a1a1a]"}`}>
    Hi, there! 👋🏻
  </h1>
  
  <h2 className={`text-lg md:text-2xl font-semibold mb-2 md:mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
    How can I assist you today?
  </h2>
  
  <div className={`max-w-xs md:max-w-xl mx-auto p-4 md:p-5 rounded-2xl md:rounded-3xl border transition-all ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-100"}`}>
    <p className={`text-[13px] md:text-[15px] font-medium leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>
        Explore <span className="text-indigo-500 font-bold uppercase">Pakistan's Legal System</span>. Ask about <span className={isDark ? "text-white" : "text-black"}>PPC, QSO, CrPC, QANUN-E-SHAHADAT </span> or the <span className={isDark ? "text-white" : "text-black"}>Constitution</span>. Running in <span className="inline-flex items-center gap-1 bg-indigo-500 text-white px-2 py-0.5 rounded-full text-[10px] md:text-[12px] font-black">{mode} Mode</span>
    </p>
  </div>
</motion.div>
          ) : (
            <motion.div 
              key="chat"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              ref={chatContainerRef} 
              className="w-full max-w-4xl mx-auto h-full flex-1 overflow-y-auto no-scrollbar pt-24 pb-10 space-y-6 md:space-y-8 px-2"
            >
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 md:gap-5 ${m.role === 'user' ? 'flex-row-reverse' : 'justify-start'}`}>
                  <div className="shrink-0">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border shadow-sm transition-all ${m.role === 'user' ? (isDark ? 'bg-white border-white text-black' : 'bg-[#1a1a1a] border-black text-white') : (isDark ? 'bg-[#1a1a1a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-700')}`}>
                      {m.isStopped ? <AlertCircle size={14} className="text-red-500" /> : <Scale size={14} />}
                    </div>
                  </div>
                  <div className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} max-w-[88%] md:max-w-[80%] group`}>
                    <div className={`relative text-[14px] md:text-[15px] font-medium leading-relaxed p-4 md:p-5 rounded-[20px] md:rounded-[22px] shadow-sm transition-all ${m.role === 'user' ? (isDark ? 'bg-white text-black rounded-tr-none' : 'bg-[#1a1a1a] text-white rounded-tr-none') : (isDark ? 'bg-[#1a1a1a] border border-slate-800 text-slate-200 rounded-tl-none' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none')} ${m.isStopped ? 'border-red-500/50 italic opacity-80' : ''}`}>
                      {m.role === 'ai' && !m.isStopped && (
                        <button onClick={() => copyToClipboard(m.text, i)} className={`absolute top-2 right-2 p-1.5 rounded-lg transition-all opacity-0 md:group-hover:opacity-100 ${isDark ? "bg-white/10 text-white hover:bg-white/20" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                          {copiedId === i ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                        </button>
                      )}
                      {m.role === 'ai' && m.isNew && !m.isStopped ? <Typewriter text={m.text} /> : m.text}
                    </div>
                    <span className="text-[8px] md:text-[9px] font-bold text-slate-400 mt-2 px-1 uppercase tracking-widest">{m.time}</span>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-3 text-[9px] md:text-[11px] font-black text-indigo-500 uppercase tracking-widest ml-11 md:ml-14">
                  <Loader2 size={14} className="animate-spin" /> Analyzing Law...
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full pb-6 md:pb-12 flex flex-col items-center z-[80] px-4 md:px-6 relative shrink-0">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }} className="w-full max-w-4xl relative mb-4 md:mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {prompts.map((p, i) => (
                  <PromptCard key={i} p={p} isDark={isDark} onClick={() => handleAsk(p.query)} />
                ))}
              </div>
              <button onClick={handleRefreshPrompts} className={`absolute -right-2 -top-4 md:top-1/2 md:-translate-y-1/2 w-9 h-9 md:w-11 md:h-11 border shadow-xl rounded-full flex items-center justify-center active:scale-90 transition-all z-[90] ${isDark ? "bg-[#1a1a1a] border-slate-800 text-white" : "bg-white border-slate-100 text-slate-600"}`}>
                <RefreshCw size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`w-full max-w-3xl backdrop-blur-3xl border rounded-[25px] md:rounded-[35px] shadow-2xl flex items-center p-1.5 md:p-2 transition-all relative ${isDark ? "bg-black/60 border-white/10" : "bg-white/95 border-white"}`}>
          <div className="relative">
            <button onClick={(e) => { e.stopPropagation(); setIsSettingsOpen(!isSettingsOpen); }} className={`p-3 md:p-4 transition-colors ${isDark ? "text-slate-400 hover:text-white" : "text-slate-400 hover:text-black"}`}>
              <Settings size={18} className={isSettingsOpen ? "rotate-90 transition-transform" : "transition-transform"} />
            </button>
            <AnimatePresence>
              {isSettingsOpen && (
                <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: -12, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className={`absolute bottom-full left-0 mb-2 w-44 md:w-48 p-2 rounded-[20px] shadow-2xl border backdrop-blur-3xl z-[110] transition-all ${isDark ? "bg-black/80 border-white/10" : "bg-white/90 border-slate-100"}`}>
                    <div className="space-y-1">
                       <div className="flex p-1 bg-slate-500/10 rounded-xl mb-2">
                        <button onClick={() => toggleTheme('light')} className={`flex-1 flex items-center justify-center py-1.5 rounded-lg transition-all ${!isDark ? 'bg-white shadow-sm text-black' : 'text-slate-400'}`}><Sun size={13}/></button>
                        <button onClick={() => toggleTheme('dark')} className={`flex-1 flex items-center justify-center py-1.5 rounded-lg transition-all ${isDark ? 'bg-white shadow-sm text-black' : 'text-slate-400'}`}><Moon size={13}/></button>
                      </div>
                      {[{ id: 'Pro', icon: <Crown size={13} /> }, { id: 'Turbo', icon: <Zap size={13} /> }, { id: 'Lite', icon: <Cpu size={13} /> }].map((m) => (
                        <button key={m.id} onClick={() => { updateMode(m.id); setIsSettingsOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${mode === m.id ? 'bg-indigo-500 text-white' : (isDark ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50')}`}>
                          <div className="flex items-center gap-2">{m.icon} <span className="text-[11px] md:text-[12px] font-bold">{m.id}</span></div>
                          {mode === m.id && <Check size={11} />}
                        </button>
                      ))}
                    </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAsk()} placeholder="Ask Lex Pro..." className={`flex-1 bg-transparent px-2 md:px-4 outline-none text-[14px] md:text-[16px] font-semibold transition-colors ${isDark ? "text-white placeholder:text-slate-600" : "text-slate-800 placeholder:text-slate-300"}`} />
          <div className="flex items-center gap-1 md:gap-2 pr-1 md:pr-2">
              <button onClick={loading ? handleStop : () => handleAsk()} disabled={!query.trim() && !loading} className={`h-10 md:h-12 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 rounded-full ${loading ? 'w-10 md:w-12 px-0 bg-red-500 text-white hover:bg-red-600' : 'px-4 md:px-8 ' + (isDark ? "bg-white text-black hover:bg-slate-200" : "bg-[#1a1a1a] text-white hover:bg-black")} disabled:opacity-20`}>
                {loading ? <Square size={14} fill="white" /> : <Send size={16} className="rotate-[-45deg]" />}
                {!loading && <span className="hidden md:inline text-[14px] font-bold">Send</span>}
              </button>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        body, html { 
          overflow: hidden; height: 100dvh; margin: 0; 
          position: fixed; width: 100%; 
          background: ${isDark ? "#0a0a0a" : "#f8f2f4"};
          transition: background 0.7s ease;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}