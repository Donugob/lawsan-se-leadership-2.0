"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  MapPin,
  Calendar,
  Globe,
  Shield,
  Scale,
  Users,
  MessageSquare,
  GraduationCap
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="bg-cream min-h-screen selection:bg-gold-500 selection:text-white scroll-pt-32 md:scroll-pt-40">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/70 backdrop-blur-xl border border-forest-100/50 px-8 py-4 rounded-3xl shadow-sm">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 transition-transform group-hover:scale-110">
              <img src="https://i.postimg.cc/kg9csQNq/logo2.png" alt="LAWSAN SE" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-heading font-bold text-forest-950 tracking-tight text-xl block leading-none">LAWSAN SE</span>
              <span className="text-[10px] text-forest-500 uppercase tracking-widest font-bold">Leadership 2.0</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {['About', 'Vision', 'Venue', 'FAQ'].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-xs font-bold uppercase tracking-widest text-forest-700 hover:text-gold-600 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          <Link
            href="/register"
            className="bg-forest-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-forest-800 hover:scale-105 transition-all shadow-xl shadow-forest-900/10"
          >
            Register Now
          </Link>
        </div>
      </nav>

      {/* Hero Section - Split Layout */}
      <section className="relative min-h-screen flex items-center pt-40 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 px-6 items-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="relative z-10"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 border border-gold-500/30 px-5 py-2 rounded-full text-gold-600 text-[10px] font-bold tracking-widest uppercase mb-8 bg-gold-500/5">
              <span className="w-2 h-2 bg-gold-500 rounded-full animate-pulse" />
              The Council of Chapter Presidents Presents
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-6xl md:text-8xl font-heading font-bold text-forest-950 leading-[0.9] mb-8">
              Emerging <br />
              <span className="text-gold-500 italic">Lawyers</span> <br />
              Emerging <br />
              <span className="text-forest-800">Realities</span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-xl text-forest-600 max-w-lg leading-relaxed font-light mb-10">
              A monumental convergence in the heart of the South East. Bypassing political noise to focus on the raw future of legal excellence.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-6">
              <Link href="/register" className="group bg-forest-900 text-white px-8 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-forest-950 transition-all shadow-2xl shadow-forest-900/20">
                Secure Your Pass
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <div className="flex items-center gap-4 px-6">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-forest-100 overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Attendee" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-forest-400 font-bold uppercase tracking-widest">
                  800+ Registered
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            style={{ y: y1, opacity }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-3xl">
              <div className="absolute inset-0 bg-forest-900/10 mix-blend-overlay" />
              <img
                src="https://i.postimg.cc/NfXJpGWX/about-mission.jpg"
                alt="Law"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 to-transparent" />

              <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
                <div className="text-white">
                  <p className="text-[10px] uppercase tracking-widest font-bold opacity-60 mb-2">Host Institution</p>
                  <p className="text-2xl font-heading font-bold">Godfrey Okoye University</p>
                </div>
                <div className="w-16 h-16 bg-gold-500 rounded-3xl flex items-center justify-center rotate-12 shadow-xl">
                  <Scale className="w-8 h-8 text-forest-900" />
                </div>
              </div>
            </div>

            {/* Abstract Elements */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-gold-100/50 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-forest-100 rounded-[3rem] -z-10 rotate-12" />
          </motion.div>
        </div>

        {/* Ghost Text */}
        <div className="absolute bottom-10 left-10 text-[15rem] font-heading font-bold text-forest-900/[0.02] select-none leading-none -z-10 pointer-events-none">
          LAWSAN
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="bg-forest-900 py-16 px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: "Host City", val: "Enugu", icon: MapPin },
            { label: "Delegates Expected", val: "1k+", icon: Users },
            { label: "Status", val: "Live", icon: Globe },
            { label: "Registration", val: "Ongoing", icon: Calendar },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              // 1. Swapped default ease for a snappy spring animation
              transition={{ type: "spring", stiffness: 100, damping: 12, delay: i * 0.1 }}
              // 2. Added a string variant trigger for the child icon
              whileHover="hover"
              className="flex items-center gap-5 cursor-default group"
            >
              <motion.div
                // 3. Icon pops up and does a quick dial rotation on hover
                variants={{
                  hover: { scale: 1.15, rotate: [0, -15, 10, -5, 0] }
                }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 rounded-2xl bg-forest-800 flex items-center justify-center border border-forest-700 group-hover:border-gold-500/50 group-hover:bg-forest-700 transition-colors"
              >
                <item.icon className="w-5 h-5 text-gold-400 group-hover:text-gold-300 transition-colors" />
              </motion.div>
              <div>
                <p className="text-[10px] text-forest-400 uppercase tracking-widest font-bold group-hover:text-forest-300 transition-colors">
                  {item.label}
                </p>
                <motion.p
                  variants={{ hover: { x: 3 } }}
                  className="text-xl font-heading font-bold text-white group-hover:text-gold-400 transition-all"
                >
                  {item.val}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The Council Section - Editorial Layout */}
      <section id="about" className="py-40 px-6 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5 space-y-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                <div className="inline-block px-4 py-1.5 rounded-full bg-forest-50 text-forest-900 text-xs font-bold tracking-widest uppercase mb-8">
                  The Visionaries
                </div>
                <h2 className="text-5xl md:text-7xl font-heading font-bold text-forest-950 leading-[1.1] mb-8">
                  Orchestrated <br />
                  by the <span className="text-gold-500 italic">Council</span>
                </h2>
                <div className="space-y-6 text-xl text-forest-600 font-light leading-relaxed">
                  <p>
                    This edition bypasses traditional structures. Orchestrated exclusively by the esteemed <span className="text-forest-950 font-bold">Council of Chapter Presidents</span>, we focus purely on the raw future of legal growth.
                  </p>
                  <p>
                    It is a testament to unified leadership. A convergence designed for law students and for the visionaries of the modern world.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-10 bg-forest-50 rounded-[3rem] border border-forest-100 relative"
              >
                <div className="absolute top-0 right-0 p-8">
                  <Users className="w-12 h-12 text-forest-200" />
                </div>
                <p className="text-3xl font-heading font-bold text-forest-900 mb-4">Value First.</p>
                <p className="text-forest-500 leading-relaxed">
                  Every session and keynote is curated to deliver immediate professional value.
                </p>
              </motion.div>
            </div>

            <div className="lg:col-span-7 mt-20 lg:mt-0">
              <div className="relative h-[500px] md:h-auto grid grid-cols-2 gap-6 md:gap-10 items-start">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="space-y-6 relative z-20 md:pt-24 lg:pt-32"
                >
                  <div className="aspect-[3/4] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-forest-900 relative shadow-2xl rotate-[-2deg] md:rotate-0 hover:rotate-0 transition-transform duration-500">
                    <img src="https://i.postimg.cc/fTQSnS7d/hero-bg.jpg" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Law" />
                    <div className="absolute inset-0 bg-forest-950/20" />
                  </div>
                  <div className="p-2 md:p-4">
                    <p className="text-[10px] font-bold text-gold-600 uppercase tracking-widest mb-1 md:mb-2">Conference Pillar</p>
                    <p className="text-xl md:text-2xl font-heading font-bold text-forest-950">Ethical Leadership</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="space-y-6 relative z-10 -mt-12 md:mt-0"
                >
                  <div className="aspect-[3/4] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-forest-900 relative shadow-2xl rotate-[3deg] md:rotate-0 hover:rotate-0 transition-transform duration-500 translate-y-12 md:translate-y-0">
                    <img src="https://i.postimg.cc/hPnv3WgX/gavel-placeholder-2.jpg" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Law" />
                    <div className="absolute inset-0 bg-forest-950/20" />
                  </div>
                  <div className="p-2 md:p-4 translate-y-12 md:translate-y-0">
                    <p className="text-[10px] font-bold text-gold-600 uppercase tracking-widest mb-1 md:mb-2">Core Focus</p>
                    <p className="text-xl md:text-2xl font-heading font-bold text-forest-950">Innovation</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conference Pillars */}
      <section id="vision" className="py-40 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #dcc673 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl mb-24">
            <h2 className="text-5xl md:text-7xl font-heading font-bold text-forest-950 mb-8">
              Excellence in <br />
              <span className="text-gold-500">Motion.</span>
            </h2>
            <p className="text-xl text-forest-600 font-light leading-relaxed">
              We are defining the values that will shape the next generation of legal leaders in Nigeria.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Professional Growth",
                desc: "Equipping delegates with the mental and technical tools needed for a high-impact legal career.",
                icon: GraduationCap
              },
              {
                title: "Unified Advocacy",
                desc: "Strengthening the collective voice of law students across the South East through collaborative leadership.",
                icon: Users
              },
              {
                title: "Legal Innovation",
                desc: "Exploring the intersection of legal tradition and the future of justice in a digital world.",
                icon: Scale
              },
            ].map((track, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="p-10 bg-white border border-forest-100 rounded-[3rem] hover:shadow-xl transition-all group cursor-default"
              >
                {/* ICON ANIMATION WRAPPER */}
                <motion.div
                  initial={{ rotate: 6 }}
                  // Horizontal shake when scrolled into view
                  whileInView={{
                    x: [0, -8, 8, -5, 5, -2, 2, 0],
                    transition: { duration: 0.6, ease: "easeInOut", delay: 0.3 + (i * 0.1) }
                  }}
                  // Rotational wiggle on hover
                  whileHover={{
                    rotate: [6, -12, 15, -10, 10, 6],
                    transition: { duration: 0.4 }
                  }}
                  viewport={{ once: true }}
                  className="w-16 h-16 bg-gold-500 rounded-3xl flex items-center justify-center mb-10 shadow-lg origin-center"
                >
                  <track.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Changed heading to text-forest-950 */}
                <h3 className="text-2xl font-heading font-bold text-forest-950 mb-4 group-hover:text-gold-600 transition-colors">
                  {track.title}
                </h3>
                {/* Changed paragraph to text-forest-600 */}
                <p className="text-forest-600 leading-relaxed font-light">
                  {track.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Venue Section */}
      <section id="venue" className="py-40 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1 order-2 lg:order-1">
              <div className="relative">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  className="rounded-[4rem] overflow-hidden shadow-3xl"
                >
                  <img src="https://i.postimg.cc/6qNgwh5Y/GOU.jpg" alt="University" className="w-full aspect-video object-cover" />
                </motion.div>
                <div className="absolute -bottom-10 -right-10 bg-forest-900 text-white p-12 rounded-[3rem] shadow-2xl hidden md:block">
                  <p className="text-4xl font-heading font-bold text-gold-400 mb-2">Enugu</p>
                  <p className="text-sm font-bold uppercase tracking-widest opacity-60">The Coal City State</p>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-10 order-1 lg:order-2">
              <div className="inline-block px-4 py-1.5 rounded-full bg-forest-100 text-forest-900 text-xs font-bold tracking-widest uppercase">
                The Host City
              </div>
              <h2 className="text-5xl md:text-7xl font-heading font-bold text-forest-950 leading-tight">
                A Hub of <br />
                <span className="text-gold-600">Innovation.</span>
              </h2>
              <p className="text-xl text-forest-600 leading-relaxed font-light">
                Godfrey Okoye University, Enugu, serves as our visionary stage. A place where tradition meets the cutting edge of academic excellence.
              </p>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-forest-900 flex items-center justify-center text-gold-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-forest-950 font-bold">Thinker's Corner, Enugu</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-forest-900 flex items-center justify-center text-gold-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="text-forest-950 font-bold">2026 (Registration Live)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-40 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-heading font-bold text-forest-950 mb-6">Common Questions</h2>
            <p className="text-forest-500">Everything you need to know about the 2.0 experience.</p>
          </div>

          <div className="space-y-6">
            {[
              { q: "Who can attend the conference?", a: "The conference is open to all Law Students, Legal Professionals, and anyone interested in the intersection of law and technology." },
              { q: "What does the registration fee cover?", a: "Your ₦3,000 fee covers the conference pass, official delegate materials, and access to all sessions." },
              { q: "Will certificates be provided?", a: "Yes, all verified attendees will receive a Certificate of Participation signed by the Council of Chapter Presidents." },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 border border-forest-100 rounded-[2.5rem] hover:border-gold-300 transition-colors bg-forest-50/20"
              >
                <h4 className="text-lg font-bold text-forest-900 mb-4">{faq.q}</h4>
                <p className="text-forest-600 font-light leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-forest-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-3xl">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gold-500/20 to-transparent opacity-50" />
            <div className="relative z-10">
              <h2 className="text-5xl md:text-8xl font-heading font-bold text-white mb-10 leading-none">
                Be Part of <br />
                the <span className="text-gold-400 italic">Future.</span>
              </h2>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/register" className="bg-gold-500 text-forest-950 px-10 py-6 rounded-2xl font-bold text-xl hover:bg-gold-400 hover:scale-105 transition-all shadow-xl shadow-gold-500/20">
                  Register Now
                </Link>
                <Link href="#about" className="border-2 border-white/30 text-white px-10 py-6 rounded-2xl font-bold text-xl hover:bg-white/10 transition-all">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-32 pb-16 px-6 bg-[#FDFDFB] border-t border-forest-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
            <div className="max-w-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-xl shadow-forest-900/5 flex items-center justify-center border border-forest-50">
                  <img src="https://i.postimg.cc/kg9csQNq/logo2.png" alt="LAWSAN SE" className="w-9 h-9 object-contain" />
                </div>
                <div>
                  <span className="font-heading font-bold text-forest-950 text-2xl block leading-none">LAWSAN SE</span>
                  <span className="text-[10px] text-gold-600 uppercase tracking-[0.4em] font-bold">Leadership 2.0</span>
                </div>
              </div>
              <p className="text-forest-500 text-sm leading-relaxed font-light">
                The premier gathering of legal minds in the South East. Empowering the next generation of legal excellence through innovation and leadership.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-20">
              <div className="space-y-6">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-forest-900">Navigation</h4>
                <div className="flex flex-col gap-4">
                  {['About', 'Vision', 'Venue', 'FAQ'].map((item) => (
                    <Link key={item} href={`#${item.toLowerCase()}`} className="text-sm text-forest-500 hover:text-gold-600 transition-colors">
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-forest-900">Contact</h4>
                <div className="flex flex-col gap-4">
                  <span className="text-sm text-forest-500">Enugu, Nigeria</span>
                  <span className="text-sm text-forest-500">info@lawsanse.org</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-forest-50 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-forest-300">
                © 2026 LAWSAN SE Zone. All Rights Reserved.
              </span>
            </div>

            <div className="flex items-center gap-2 group">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-forest-300">Crafted with precision by</span>
              <Link 
                href="https://build-with-ugob.com.ng/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#06160b] text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gold-500 hover:text-[#06160b] transition-all shadow-xl shadow-forest-900/10 flex items-center gap-2"
              >
                UGO.B
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
