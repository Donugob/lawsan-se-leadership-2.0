"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Building, User, CreditCard, Briefcase, GraduationCap, ShieldCheck, AlertCircle } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),

  isStudent: z.boolean(),
  isLawStudent: z.boolean().optional(),
  isSouthEast: z.boolean().optional(),

  // Student fields
  university: z.string().optional(),
  level: z.string().optional(),

  // Professional fields
  profession: z.string().optional(),
  organization: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.isStudent) {
    if (!data.university || data.university.length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "University is required", path: ["university"] });
    }
    if (!data.level) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Level is required", path: ["level"] });
    }
  } else {
    if (!data.profession || data.profession.length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Profession is required", path: ["profession"] });
    }
  }
});

type FormData = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load Paystack Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const { register, handleSubmit, formState: { errors }, trigger, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isStudent: true,
      isLawStudent: true,
      isSouthEast: true,
    }
  });

  const isStudent = watch("isStudent");

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ["firstName", "lastName", "email", "phone"];
    if (step === 2) {
      fieldsToValidate = isStudent ? ["university", "level"] : ["profession"];
    }

    const isStepValid = await trigger(fieldsToValidate as any);
    if (isStepValid) {
      setStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Save registration intent to our backend
      const regResponse = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await regResponse.json();

      if (!regResponse.ok) {
        throw new Error(result.error || "Failed to initialize registration");
      }

      // 2. Initialize Paystack Inline Checkout
      const PaystackPop = (window as any).PaystackPop;
      if (!PaystackPop) {
        throw new Error("Payment system not loaded. Please refresh.");
      }

      const handler = PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: data.email,
        amount: isStudent ? 500000 : 1000000, // Amount in kobo
        currency: 'NGN',
        ref: result.regId + "_" + Date.now(),
        metadata: {
          custom_fields: [
            { display_name: "Registration ID", variable_name: "reg_id", value: result.regId },
            { display_name: "Name", variable_name: "name", value: `${data.firstName} ${data.lastName}` },
            { display_name: "Is Student", variable_name: "is_student", value: data.isStudent }
          ]
        },
        callback: function (response: any) {
          setIsSubmitting(false);
          // Success! Redirect to success page with the ACTUAL regId and ref
          router.push(`/success?regId=${result.regId}&ref=${response.reference}`);
        },
        onClose: function () {
          setIsSubmitting(false);
          setError("Payment window closed. Please try again.");
        },
      });
      handler.openIframe();
    } catch (e: any) {
      setIsSubmitting(false);
      setError(e.message || 'Error initializing registration. Please try again.');
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <main className="min-h-screen bg-forest-900 flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjEyLCAxNzUsIDU1LCAwLjE1KSIvPjwvc3ZnPg==')]" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold-600 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-forest-500 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      <div className="w-full max-w-xl z-10 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-forest-200 hover:text-gold-400 mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
          <div className="bg-forest-950 p-6 md:p-8 text-center relative border-b border-forest-800">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-gold-400 mb-2">Register Now</h1>
            <p className="text-forest-200 text-sm md:text-base">Secure your seat for Leadership Conference 2.0</p>

            {/* Progress Bar */}
            <div className="flex justify-center items-center gap-3 md:gap-4 mt-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-500 shadow-sm ${step >= item ? 'bg-gold-500 text-forest-900 shadow-gold-500/20' : 'bg-forest-800 text-forest-400'}`}>
                    {item < step ? <CheckCircle2 className="w-5 h-5" /> : item}
                  </div>
                  {item < 3 && (
                    <div className={`w-8 md:w-12 h-1 rounded-full mx-1 md:mx-2 transition-colors duration-500 ${step > item ? 'bg-gold-500' : 'bg-forest-800'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-10 bg-cream-50/50">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {/* STEP 1 */}
                {step === 1 && (
                  <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-5 md:space-y-6">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-forest-100">
                      <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-gold-700" />
                      </div>
                      <h2 className="text-xl font-bold text-forest-900">Personal Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                      <div>
                        <label className="block text-xs font-bold text-forest-900 uppercase tracking-widest mb-2">First Name</label>
                        <input {...register("firstName")} className="w-full px-4 py-3.5 rounded-2xl bg-white border border-forest-200 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all shadow-sm" placeholder="John" />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.firstName.message}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-forest-900 uppercase tracking-widest mb-2">Last Name</label>
                        <input {...register("lastName")} className="w-full px-4 py-3.5 rounded-2xl bg-white border border-forest-200 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all shadow-sm" placeholder="Doe" />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.lastName.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-forest-900 uppercase tracking-widest mb-2">Email Address</label>
                      <input {...register("email")} type="email" className="w-full px-4 py-3.5 rounded-2xl bg-white border border-forest-200 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all shadow-sm" placeholder="john@example.com" />
                      {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-forest-900 uppercase tracking-widest mb-2">Phone Number</label>
                      <input {...register("phone")} type="tel" className="w-full px-4 py-3.5 rounded-2xl bg-white border border-forest-200 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all shadow-sm" placeholder="08012345678" />
                      {errors.phone && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.phone.message}</p>}
                    </div>

                    <div className="pt-6">
                      <button type="button" onClick={nextStep} className="w-full bg-forest-900 text-gold-100 py-4 rounded-2xl font-bold hover:bg-forest-800 transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 group">
                        Continue
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-5 md:space-y-6">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-forest-100">
                      <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center">
                        <Building className="w-5 h-5 text-gold-700" />
                      </div>
                      <h2 className="text-xl font-bold text-forest-900">Delegate Profile</h2>
                    </div>

                    {/* Dynamic Toggles */}
                    <div className="bg-white p-2 rounded-2xl border border-forest-100 flex shadow-sm mb-6">
                      <button
                        type="button"
                        onClick={() => setValue("isStudent", true)}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${isStudent ? 'bg-forest-900 text-white shadow-md' : 'text-forest-600 hover:bg-forest-50'}`}
                      >
                        <GraduationCap className="w-4 h-4" />
                        Student
                      </button>
                      <button
                        type="button"
                        onClick={() => setValue("isStudent", false)}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${!isStudent ? 'bg-forest-900 text-white shadow-md' : 'text-forest-600 hover:bg-forest-50'}`}
                      >
                        <Briefcase className="w-4 h-4" />
                        Professional
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {isStudent ? (
                        <motion.div key="student-fields" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-5">
                          <div className="flex flex-col md:flex-row gap-4 mb-4">
                            <label className="flex items-center gap-3 p-4 border border-forest-200 rounded-2xl cursor-pointer hover:bg-forest-50 transition-colors flex-1 bg-white">
                              <input type="checkbox" {...register("isLawStudent")} className="w-5 h-5 rounded text-gold-500 focus:ring-gold-500" />
                              <span className="font-medium text-forest-900 text-sm">I study Law</span>
                            </label>
                            <label className="flex items-center gap-3 p-4 border border-forest-200 rounded-2xl cursor-pointer hover:bg-forest-50 transition-colors flex-1 bg-white">
                              <input type="checkbox" {...register("isSouthEast")} className="w-5 h-5 rounded text-gold-500 focus:ring-gold-500" />
                              <span className="font-medium text-forest-900 text-sm">Based in South East</span>
                            </label>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-forest-900 uppercase tracking-widest mb-2">University / Institution</label>
                            <input {...register("university")} className="w-full px-4 py-3.5 rounded-2xl bg-white border border-forest-200 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all shadow-sm" placeholder="e.g. Godfrey Okoye University" />
                            {errors.university && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.university.message}</p>}
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-forest-900 uppercase tracking-widest mb-2">Level of Study</label>
                            <select {...register("level")} className="w-full px-4 py-3.5 rounded-2xl bg-white border border-forest-200 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all appearance-none shadow-sm cursor-pointer">
                              <option value="">Select Level</option>
                              <option value="100">100 Level</option>
                              <option value="200">200 Level</option>
                              <option value="300">300 Level</option>
                              <option value="400">400 Level</option>
                              <option value="500">500 Level</option>
                              <option value="Law School">Law School</option>
                              <option value="Other">Other</option>
                            </select>
                            {errors.level && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.level.message}</p>}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div key="prof-fields" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-5">
                          <div>
                            <label className="block text-xs font-bold text-forest-900 uppercase tracking-widest mb-2">Profession / Role</label>
                            <input {...register("profession")} className="w-full px-4 py-3.5 rounded-2xl bg-white border border-forest-200 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all shadow-sm" placeholder="e.g. Legal Practitioner, Entrepreneur" />
                            {errors.profession && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.profession.message}</p>}
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-forest-900 uppercase tracking-widest mb-2">Organization (Optional)</label>
                            <input {...register("organization")} className="w-full px-4 py-3.5 rounded-2xl bg-white border border-forest-200 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all shadow-sm" placeholder="e.g. ABC Law Firm" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="pt-6 flex gap-4">
                      <button type="button" onClick={prevStep} className="w-1/3 py-4 rounded-2xl font-bold text-forest-800 bg-forest-100 hover:bg-forest-200 transition-colors">
                        Back
                      </button>
                      <button type="button" onClick={nextStep} className="w-2/3 bg-forest-900 text-gold-100 py-4 rounded-2xl font-bold hover:bg-forest-800 transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 group">
                        Proceed
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6 text-center pt-4">
                    <div className="w-20 h-20 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-gold-200">
                      <CreditCard className="w-10 h-10 text-gold-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-heading font-bold text-forest-900 mb-2">Complete Registration</h2>
                      <p className="text-forest-600 mb-8 max-w-sm mx-auto text-sm md:text-base">Click below to securely complete your payment via Paystack.</p>

                      <div className="bg-white p-6 rounded-2xl text-left border border-forest-200 mb-8 shadow-sm">
                        <div className="flex justify-between items-center py-3 border-b border-forest-100">
                          <span className="text-forest-600 font-medium text-sm">Ticket Type</span>
                          <span className="font-bold text-forest-900 text-sm">{isStudent ? 'Standard Delegate (Student)' : 'Professional Delegate'}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 pt-4">
                          <span className="text-forest-600 font-medium text-sm">Total Amount</span>
                          <span className="font-heading font-extrabold text-2xl text-forest-900">₦{isStudent ? '5,000' : '10,000'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-4">
                      <button type="button" onClick={prevStep} className="w-1/3 py-4 rounded-2xl font-bold text-forest-800 bg-forest-100 hover:bg-forest-200 transition-colors">
                        Back
                      </button>
                      <button type="submit" disabled={isSubmitting} className="w-2/3 bg-gold-500 text-forest-950 py-4 rounded-2xl font-bold hover:bg-gold-400 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-gold-500/20 hover:-translate-y-0.5 relative overflow-hidden">
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-forest-950/20 border-t-forest-950 rounded-full animate-spin" />
                            Processing...
                          </span>
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                            <span className="relative z-10 flex items-center gap-2">
                              Pay Now
                              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-6 text-xs text-forest-500 font-medium">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                      <span>Secured by <span className="font-bold">Paystack</span></span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
