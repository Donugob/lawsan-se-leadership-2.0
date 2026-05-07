"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, CheckCircle2, AlertCircle, ArrowRight, User, School, Mail, Phone, Briefcase } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const registrationSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  university: z.string().optional(),
  profession: z.string().optional(),
  isStudent: z.boolean().default(true),
});

type RegistrationData = z.infer<typeof registrationSchema>;

export default function RegisterPage() {
  const [isStudent, setIsStudent] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { isStudent: true }
  });

  const onSubmit = async (data: RegistrationData) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Create registration record in database
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed");
      }

      // 2. Initialize Paystack payment
      const PaystackPop = (window as any).PaystackPop;
      const handler = PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: data.email,
        amount: isStudent ? 500000 : 1000000, // Amount in kobo (N5000 or N10000)
        currency: "NGN",
        ref: result.regId + "_" + Date.now(),
        metadata: {
          custom_fields: [
            { display_name: "Registration ID", variable_name: "reg_id", value: result.regId },
            { display_name: "Name", variable_name: "name", value: `${data.firstName} ${data.lastName}` }
          ]
        },
        callback: function(response: any) {
          // Success! Redirect to success page with the ACTUAL regId
          router.push(`/success?regId=${result.regId}&ref=${response.reference}`);
        },
        onClose: function() {
          setError("Payment window closed. Please try again.");
          setIsLoading(false);
        }
      });
      handler.openIframe();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-heading font-bold text-forest-950 mb-3">Conference Registration</h1>
          <p className="text-forest-600">Join the Lawsan SE Leadership Conference 2.0. Fill out the details below to secure your spot.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-forest-950/5 border border-forest-100 overflow-hidden">
          {/* Category Toggle */}
          <div className="flex p-2 bg-forest-50/50 border-b border-forest-100">
            <button 
              onClick={() => { setIsStudent(true); setValue('isStudent', true); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all ${isStudent ? 'bg-white text-forest-900 shadow-sm border border-forest-100' : 'text-forest-400 hover:text-forest-600'}`}
            >
              <School className="w-4 h-4" />
              Student Delegate (N5,000)
            </button>
            <button 
              onClick={() => { setIsStudent(false); setValue('isStudent', false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all ${!isStudent ? 'bg-white text-forest-900 shadow-sm border border-forest-100' : 'text-forest-400 hover:text-forest-600'}`}
            >
              <Briefcase className="w-4 h-4" />
              Professional Delegate (N10,000)
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-forest-900 uppercase tracking-widest flex items-center gap-2">
                  <User className="w-3 h-3 text-gold-500" /> First Name
                </label>
                <input 
                  {...register("firstName")}
                  placeholder="John" 
                  className={`w-full px-4 py-3 bg-forest-50 border ${errors.firstName ? 'border-red-300 ring-1 ring-red-100' : 'border-forest-100'} rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all`}
                />
                {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-forest-900 uppercase tracking-widest flex items-center gap-2">
                  <User className="w-3 h-3 text-gold-500" /> Last Name
                </label>
                <input 
                  {...register("lastName")}
                  placeholder="Doe" 
                  className={`w-full px-4 py-3 bg-forest-50 border ${errors.lastName ? 'border-red-300 ring-1 ring-red-100' : 'border-forest-100'} rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all`}
                />
                {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-forest-900 uppercase tracking-widest flex items-center gap-2">
                  <Mail className="w-3 h-3 text-gold-500" /> Email Address
                </label>
                <input 
                  {...register("email")}
                  type="email"
                  placeholder="john@example.com" 
                  className={`w-full px-4 py-3 bg-forest-50 border ${errors.email ? 'border-red-300 ring-1 ring-red-100' : 'border-forest-100'} rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all`}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-forest-900 uppercase tracking-widest flex items-center gap-2">
                  <Phone className="w-3 h-3 text-gold-500" /> Phone Number
                </label>
                <input 
                  {...register("phone")}
                  placeholder="0801 234 5678" 
                  className={`w-full px-4 py-3 bg-forest-50 border ${errors.phone ? 'border-red-300 ring-1 ring-red-100' : 'border-forest-100'} rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all`}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
              </div>

              {isStudent ? (
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-forest-900 uppercase tracking-widest flex items-center gap-2">
                    <School className="w-3 h-3 text-gold-500" /> University / Institution
                  </label>
                  <input 
                    {...register("university")}
                    placeholder="e.g. University of Nigeria" 
                    className="w-full px-4 py-3 bg-forest-50 border border-forest-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                  />
                </div>
              ) : (
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-forest-900 uppercase tracking-widest flex items-center gap-2">
                    <Briefcase className="w-3 h-3 text-gold-500" /> Professional Affiliation / Firm
                  </label>
                  <input 
                    {...register("profession")}
                    placeholder="e.g. Law Firm ABC" 
                    className="w-full px-4 py-3 bg-forest-50 border border-forest-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-forest-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-forest-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-forest-900/10 active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Proceed to Secure Payment <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
            
            <p className="text-center text-xs text-forest-400">
              By clicking proceed, you agree to our terms of service and registration policies.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
