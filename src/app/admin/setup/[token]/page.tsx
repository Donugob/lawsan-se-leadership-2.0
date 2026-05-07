"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ShieldCheck, User, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function SetupPage() {
  const params = useParams();
  const router = useRouter();
  const [invitation, setInvitation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/admin/auth/setup/verify?token=${params.token}`);
        const data = await res.json();
        
        if (res.ok) {
          setInvitation(data.invitation);
        } else {
          toast.error(data.error || "Invalid or expired link");
        }
      } catch (err) {
        toast.error("An error occurred");
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [params.token]);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/auth/setup/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: params.token,
          name: formData.name,
          password: formData.password
        }),
      });

      if (res.ok) {
        toast.success("Account setup complete! You can now login.");
        router.push("/admin/login");
      } else {
        const data = await res.json();
        toast.error(data.error || "Setup failed");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-forest-950 flex flex-col items-center justify-center p-6">
        <Loader2 className="w-10 h-10 text-gold-500 animate-spin mb-4" />
        <p className="text-forest-400 font-bold text-[10px] uppercase tracking-widest">Verifying Secure Link...</p>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-forest-950 flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-white mb-2">Invalid Link</h1>
        <p className="text-forest-400 text-center max-w-xs mb-8">This setup link is either invalid, expired, or has already been used.</p>
        <button onClick={() => router.push("/")} className="text-gold-500 font-bold hover:underline">Return to site</button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-forest-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gold-500/20 blur-[120px]" />
      </div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-gold-500/20">
            <ShieldCheck className="w-8 h-8 text-forest-950" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2 tracking-tight">Complete Setup</h1>
          <p className="text-forest-300 text-sm italic">Joining the Lawsan SE Admin Team</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl">
          <p className="text-xs text-forest-400 mb-8 text-center bg-forest-900/50 p-4 rounded-xl border border-white/5">
            Setting up access for: <strong className="text-white">{invitation.email}</strong>
          </p>
          
          <form onSubmit={handleSetup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-forest-300 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-500 group-focus-within:text-gold-500 transition-colors" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-forest-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-forest-700 focus:outline-none focus:ring-2 focus:ring-gold-500/50 transition-all"
                  placeholder="Your Name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-forest-300 ml-1">Create Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-500 group-focus-within:text-gold-500 transition-colors" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-forest-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-forest-700 focus:outline-none focus:ring-2 focus:ring-gold-500/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-forest-300 ml-1">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-500 group-focus-within:text-gold-500 transition-colors" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full bg-forest-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-forest-700 focus:outline-none focus:ring-2 focus:ring-gold-500/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold py-4 rounded-2xl transition-all shadow-xl shadow-gold-500/10 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 group"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Complete Setup
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
