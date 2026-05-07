"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Download, ArrowRight, Mail, Share2, Calendar, MapPin } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const regId = searchParams.get("regId") || "PENDING";
  const reference = searchParams.get("ref") || "---";

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Hero Success Card */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-forest-950/10 border border-forest-100 overflow-hidden">
        <div className="bg-forest-950 p-12 text-center relative overflow-hidden">
          {/* Abstract pattern bg */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full border-[1px] border-white/20 rotate-45 scale-150" />
            <div className="absolute top-0 left-0 w-full h-full border-[1px] border-white/20 -rotate-45 scale-150" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-gold-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-gold-500/20 ring-8 ring-white/5 animate-bounce-subtle">
              <CheckCircle2 className="w-10 h-10 text-forest-950" />
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2 uppercase tracking-tight">Registration Confirmed</h1>
            <p className="text-forest-200 text-lg">Your delegate spot has been successfully secured.</p>
          </div>
        </div>

        <div className="p-8 md:p-12">
          {/* Ticket ID Box */}
          <div className="bg-forest-50/50 rounded-3xl p-8 border border-forest-100 flex flex-col items-center justify-center text-center mb-8">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-forest-400 mb-2">Your Registration ID</span>
            <span className="text-5xl md:text-6xl font-heading font-bold text-forest-900 tracking-tighter">#{regId}</span>
            <div className="mt-4 flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border border-forest-100 text-[10px] font-mono text-forest-500">
              REF: {reference}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex gap-4 p-5 bg-white border border-forest-100 rounded-2xl">
              <Calendar className="w-6 h-6 text-gold-500 shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-forest-400 mb-0.5">Date & Time</p>
                <p className="text-sm font-bold text-forest-900">May 24th - 26th, 2026</p>
                <p className="text-[10px] text-forest-500">Starts 9:00 AM Daily</p>
              </div>
            </div>
            <div className="flex gap-4 p-5 bg-white border border-forest-100 rounded-2xl">
              <MapPin className="w-6 h-6 text-gold-500 shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-forest-400 mb-0.5">Venue Location</p>
                <p className="text-sm font-bold text-forest-900">Law Faculty Auditorium</p>
                <p className="text-[10px] text-forest-500">Enugu State University</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href={`/api/ticket/download?regId=${regId}`}
              className="flex-1 bg-forest-950 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-forest-800 transition-all shadow-xl shadow-forest-900/10 active:scale-95 group"
            >
              <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
              Download Ticket (PDF)
            </a>
            <button className="flex-1 bg-white border-2 border-forest-950 text-forest-950 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-forest-50 transition-all active:scale-95">
              <Share2 className="w-5 h-5" />
              Share Registration
            </button>
          </div>
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-gold-50/50 border border-gold-100 p-6 rounded-3xl flex gap-4 items-start">
        <div className="bg-gold-500/20 p-2 rounded-xl">
          <Mail className="w-5 h-5 text-gold-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-forest-900 mb-1">Check your inbox</p>
          <p className="text-xs text-forest-600 leading-relaxed">
            We've sent a digital copy of your ticket and registration receipt to your registered email address. 
            If you don't see it, please check your spam folder.
          </p>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link href="/" className="inline-flex items-center gap-2 text-forest-400 hover:text-forest-950 font-bold text-sm transition-colors group">
          Return to Homepage
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-cream-50 pt-32 pb-16 px-4">
      <Suspense fallback={
        <div className="max-w-3xl mx-auto flex items-center justify-center p-20">
          <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
