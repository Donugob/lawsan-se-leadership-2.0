"use client";

import { motion } from "framer-motion";
import { CheckCircle, Download, Calendar, MapPin, Share2, Home } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-cream flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background celebration accents */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.2, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-200 rounded-full blur-[100px]" 
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.1, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-forest-200 rounded-full blur-[100px]" 
        />
      </div>

      <div className="max-w-2xl w-full z-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-forest-50"
        >
          {/* Header section with icon */}
          <div className="bg-forest-900 p-12 text-center relative">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
              className="w-24 h-24 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-gold-500/20"
            >
              <CheckCircle className="w-12 h-12 text-forest-950" strokeWidth={2.5} />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">Registration Confirmed</h1>
            <p className="text-forest-200">You are officially a delegate for Leadership Conference 2.0</p>
          </div>

          <div className="p-8 md:p-12 space-y-8">
            {/* Event Summary Card */}
            <div className="bg-forest-50 p-8 rounded-3xl border border-forest-100 flex flex-col md:flex-row gap-8 justify-between items-center">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-forest-800">
                  <Calendar className="w-5 h-5 text-gold-600" />
                  <span className="font-semibold text-lg">Enugu 2026</span>
                </div>
                <div className="flex items-center gap-3 text-forest-800">
                  <MapPin className="w-5 h-5 text-gold-600" />
                  <span className="font-medium">South East Zone, Nigeria</span>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-xs text-forest-500 uppercase tracking-widest mb-1">Registration ID</p>
                <p className="text-xl font-heading font-bold text-forest-900">#LAW-26-4829</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-forest-900">What's Next?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-forest-700 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-2 shrink-0" />
                  <span>A copy of your digital ticket and receipt has been sent to your email.</span>
                </li>
                <li className="flex items-start gap-3 text-forest-700 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-2 shrink-0" />
                  <span>Join the official attendee portal to start networking with other delegates.</span>
                </li>
                <li className="flex items-start gap-3 text-forest-700 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-2 shrink-0" />
                  <span>Follow @LAWSAN_SE_ZONE for live updates and preparatory materials.</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <button className="flex items-center justify-center gap-2 bg-forest-900 text-gold-100 py-4 rounded-2xl font-bold hover:bg-forest-800 transition-colors shadow-lg shadow-forest-900/10">
                <Download className="w-5 h-5" />
                Download Ticket
              </button>
              <button className="flex items-center justify-center gap-2 border border-forest-200 text-forest-800 py-4 rounded-2xl font-bold hover:bg-forest-50 transition-colors">
                <Share2 className="w-5 h-5" />
                Share Attendance
              </button>
            </div>

            <Link href="/" className="flex items-center justify-center gap-2 text-forest-500 hover:text-forest-900 transition-colors text-sm font-medium pt-4">
              <Home className="w-4 h-4" />
              Return to Homepage
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
