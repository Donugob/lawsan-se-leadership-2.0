"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Download, ArrowRight, Mail, Share2, Calendar, MapPin, Loader2, AlertCircle, CreditCard } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

function SuccessContent() {
  const searchParams = useSearchParams();
  const regId = searchParams.get("regId");
  const email = searchParams.get("email");
  const reference = searchParams.get("ref") || "DIRECT_ACCESS";
  
  const [status, setStatus] = useState<"loading" | "confirmed" | "error">("loading");
  const [attempts, setAttempts] = useState(0);

  const checkStatus = useCallback(async () => {
    if (!regId) return;
    
    try {
      const res = await fetch(`/api/register/status?regId=${regId}&email=${encodeURIComponent(email || "")}`);
      const data = await res.json();
      
      if (data.status === "paid") {
        setStatus("confirmed");
      } else {
        // Continue polling if not too many attempts
        if (attempts < 20) { // ~60 seconds total (3s interval)
          setAttempts(prev => prev + 1);
        } else {
          setStatus("error");
          toast.error("Confirmation taking longer than expected. Please check your email or refresh later.");
        }
      }
    } catch (err) {
      console.error("Status check failed", err);
    }
  }, [regId, attempts]);

  useEffect(() => {
    if (!regId) {
      setStatus("error");
      return;
    }

    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [regId, checkStatus]);

  if (status === "loading") {
    return (
      <div className="max-w-xl mx-auto py-20 px-6 text-center space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-forest-100 flex flex-col items-center"
        >
          <div className="relative w-20 h-20 mb-8">
            <div className="absolute inset-0 border-4 border-forest-50 rounded-full" />
            <div className="absolute inset-0 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-forest-900" />
            </div>
          </div>
          <h1 className="text-2xl font-heading font-bold text-forest-900 mb-3">Confirming Payment</h1>
          <p className="text-forest-600 text-sm leading-relaxed mb-6">
            We're verifying your transaction with Paystack. This usually takes a few seconds. Please don't close this window.
          </p>
          <div className="w-full bg-forest-50 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              className="bg-gold-500 h-full"
              initial={{ width: "0%" }}
              animate={{ width: `${(attempts / 20) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-[10px] text-forest-400 mt-4 uppercase tracking-widest font-bold">Waiting for webhook response...</span>
        </motion.div>
      </div>
    );
  }

  if (status === "error" && !regId) {
    return (
      <div className="max-w-xl mx-auto py-20 px-6 text-center">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-red-100 flex flex-col items-center">
          <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
          <h1 className="text-2xl font-heading font-bold text-forest-900 mb-2">Something went wrong</h1>
          <p className="text-forest-600 text-sm mb-8">We couldn't find your registration. If you've already paid, please contact support.</p>
          <Link href="/register" className="bg-forest-900 text-white px-8 py-3 rounded-xl font-bold">Try Again</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 px-4">
      {/* Hero Success Card */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-forest-950/10 border border-forest-100 overflow-hidden">
        <div className="bg-forest-950 p-10 md:p-12 text-center relative overflow-hidden">
          {/* Abstract pattern bg */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full border-[1px] border-white/20 rotate-45 scale-150" />
            <div className="absolute top-0 left-0 w-full h-full border-[1px] border-white/20 -rotate-45 scale-150" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="w-20 h-20 bg-gold-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-gold-500/20 ring-8 ring-white/5"
            >
              <CheckCircle2 className="w-10 h-10 text-forest-950" />
            </motion.div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
            <div className="flex gap-4 p-5 bg-white border border-forest-100 rounded-2xl shadow-sm">
              <Calendar className="w-6 h-6 text-gold-500 shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-forest-400 mb-0.5">Date & Time</p>
                <p className="text-sm font-bold text-forest-900">4th June, 2026</p>
                <p className="text-[10px] text-forest-500 uppercase font-bold tracking-tighter">Starts 10:00 AM</p>
              </div>
            </div>
            <div className="flex gap-4 p-5 bg-white border border-forest-100 rounded-2xl shadow-sm">
              <MapPin className="w-6 h-6 text-gold-500 shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-forest-400 mb-0.5">Venue Location</p>
                <p className="text-sm font-bold text-forest-900">Godfrey Okoye University</p>
                <p className="text-[10px] text-forest-500">Thinker's Corner, Enugu</p>
              </div>
            </div>
          </div>

          {/* Official WhatsApp Group Card */}
          <div className="bg-forest-50/40 border border-forest-100 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row gap-6 items-center justify-between mb-8 animate-in fade-in slide-in-from-bottom duration-500 delay-200">
            <div className="flex gap-4 items-start text-left">
              <div className="bg-[#25D366]/10 p-3 rounded-2xl text-[#25D366] shrink-0">
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.288 1.498 4.76 1.499 5.485.002 9.947-4.461 9.95-9.95.002-2.66-1.033-5.159-2.914-7.04C16.562 1.781 14.07 1.745 11.4 1.745c-5.485 0-9.946 4.462-9.95 9.95-.001 1.924.5 3.791 1.453 5.427L1.879 21.84l4.768-1.25c.001 0 .001 0 0 0zM17.472 14.382c-.32-.16-1.89-.93-2.185-1.04-.294-.11-.51-.16-.724.16-.215.32-.832 1.04-1.02 1.255-.187.215-.375.24-.694.08-.32-.16-1.349-.497-2.57-1.587-.95-.847-1.59-1.892-1.777-2.213-.188-.32-.02-.492.14-.65.143-.142.32-.375.48-.562.16-.188.21-.32.32-.533.11-.215.06-.4-.02-.56-.08-.16-.724-1.745-.99-2.385-.26-.628-.524-.543-.724-.553l-.617-.01c-.215 0-.56.08-.853.4-.293.32-1.12 1.096-1.12 2.67 0 1.573 1.147 3.093 1.307 3.306.16.213 2.257 3.448 5.467 4.834.763.329 1.36.527 1.824.674.766.244 1.464.21 2.016.128.614-.092 1.89-.773 2.155-1.48.267-.708.267-1.312.188-1.438-.08-.125-.295-.205-.615-.365z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-forest-900 mb-1">Official Delegates Group Chat</h3>
                <p className="text-xs text-forest-600 leading-relaxed max-w-md">
                  Join the exclusive WhatsApp community for delegates. Connect with peers, receive immediate logistics updates, and participate in pre-conference networking.
                </p>
              </div>
            </div>
            <a 
              href="https://chat.whatsapp.com/HNV6XqgqXedH2iEIUNGVsC?mode=gi_t"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto px-6 py-3.5 bg-[#25D366] text-white hover:bg-[#20ba59] rounded-2xl font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-[#25D366]/20 transition-all hover:scale-[1.02] active:scale-95 shrink-0"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.288 1.498 4.76 1.499 5.485.002 9.947-4.461 9.95-9.95.002-2.66-1.033-5.159-2.914-7.04C16.562 1.781 14.07 1.745 11.4 1.745c-5.485 0-9.946 4.462-9.95 9.95-.001 1.924.5 3.791 1.453 5.427L1.879 21.84l4.768-1.25c.001 0 .001 0 0 0zM17.472 14.382c-.32-.16-1.89-.93-2.185-1.04-.294-.11-.51-.16-.724.16-.215.32-.832 1.04-1.02 1.255-.187.215-.375.24-.694.08-.32-.16-1.349-.497-2.57-1.587-.95-.847-1.59-1.892-1.777-2.213-.188-.32-.02-.492.14-.65.143-.142.32-.375.48-.562.16-.188.21-.32.32-.533.11-.215.06-.4-.02-.56-.08-.16-.724-1.745-.99-2.385-.26-.628-.524-.543-.724-.553l-.617-.01c-.215 0-.56.08-.853.4-.293.32-1.12 1.096-1.12 2.67 0 1.573 1.147 3.093 1.307 3.306.16.213 2.257 3.448 5.467 4.834.763.329 1.36.527 1.824.674.766.244 1.464.21 2.016.128.614-.092 1.89-.773 2.155-1.48.267-.708.267-1.312.188-1.438-.08-.125-.295-.205-.615-.365z" />
              </svg>
              Join Group Chat
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href={`/api/ticket/download?regId=${regId}&email=${encodeURIComponent(email || "")}`}
              className="flex-1 bg-[#06160b] text-white py-4 rounded-2xl font-extrabold flex items-center justify-center gap-3 transition-all shadow-xl shadow-forest-900/10 active:scale-95 group"
            >
              <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
              Download Ticket (PDF)
            </a>
            <button 
              onClick={() => {
                navigator.share?.({ title: 'Lawsan SE Leadership Conference', url: window.location.href });
              }}
              className="flex-1 bg-white border-2 border-[#06160b] text-[#06160b] py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-forest-50 transition-all active:scale-95"
            >
              <Share2 className="w-5 h-5" />
              Share Status
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
    <main className="min-h-screen bg-cream-50 pt-32 pb-16 px-4 flex items-center justify-center">
      <Suspense fallback={
        <div className="max-w-3xl mx-auto flex flex-col items-center justify-center p-20 space-y-4">
          <Loader2 className="w-10 h-10 text-gold-500 animate-spin" />
          <p className="text-forest-400 font-bold text-xs uppercase tracking-widest">Initialising Success Page...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
