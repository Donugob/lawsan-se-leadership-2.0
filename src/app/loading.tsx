"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-cream z-[100] flex flex-col items-center justify-center">
      <div className="relative">
        {/* Animated Rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 border-2 border-forest-100 border-t-gold-500 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 border-2 border-forest-50 border-b-forest-800 rounded-full"
        />
        
        {/* Logo/Letter Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-forest-900 font-heading font-bold text-2xl">L</span>
        </div>
      </div>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-forest-800 font-medium tracking-widest uppercase text-xs"
      >
        Initializing Experience
      </motion.p>
    </div>
  );
}
