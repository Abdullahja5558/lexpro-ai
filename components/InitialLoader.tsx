"use client";

import { motion } from "framer-motion";
import { Scale } from "lucide-react";

const InitialLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.1, // Thora sa zoom out ho kar gayab hoga
        transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] } 
      }}
      className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-white"
    >
      {/* Premium Animated Icon Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ 
          scale: [0.9, 1, 0.9], 
          opacity: 1,
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="relative w-20 h-20 md:w-28 md:h-28 flex items-center justify-center"
      >
        {/* Subtle Soft Shadow Glow */}
        <div className="absolute inset-0 bg-indigo-500/5 blur-[30px] rounded-full" />
        
        {/* The White Glass Box */}
        <div className="relative w-full h-full bg-white border border-slate-100 rounded-[24px] md:rounded-[32px] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <Scale size={36} className="text-indigo-600 md:size-12" />
        </div>
      </motion.div>

      {/* Brand Identity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mt-8 flex flex-col items-center"
      >
        <h1 className="text-slate-900 text-xl md:text-2xl font-bold tracking-tight">
          Lex Pro
        </h1>
        
        {/* Minimal Progress Bar */}
        <div className="mt-4 w-32 md:w-40 h-[3px] bg-slate-100 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InitialLoader;