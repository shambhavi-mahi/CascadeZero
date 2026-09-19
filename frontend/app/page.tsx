"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, Activity, Zap, ShieldAlert, Cpu, Camera } from "lucide-react";

// Dynamically import the 3D component so it doesn't break SSR
const Hero3D = dynamic(() => import("./components/Hero3D"), { ssr: false });

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <Activity className="text-blue-600" />
            CascadeZero
          </div>
          <Link 
            href="/dashboard" 
            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
          >
            Open Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 overflow-hidden">
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold tracking-wide border border-blue-200">
              Hackathon MVP
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              The city has a <br/><span className="text-blue-600">backup plan.</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              CascadeZero is an intelligent urban infrastructure simulator. Upload incident photos, predict cascading failures in real-time, and generate AI-driven emergency response plans before the worst happens.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link 
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
              >
                Launch Simulator <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-full w-full flex items-center justify-center"
          >
            {/* The 3D Component */}
            <Hero3D />

            {/* Floating Glassmorphism UI Card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: [0, -10, 0], opacity: 1 }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-10 left-0 bg-white/70 backdrop-blur-xl border border-white p-4 rounded-2xl shadow-xl flex items-center gap-4 z-20"
            >
              <div className="bg-red-100 text-red-600 p-3 rounded-full">
                <Zap size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Cascade Risk Detected</p>
                <p className="text-xs text-slate-600">Critical infrastructure isolated.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative z-10 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">How it works</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">Our core loop transforms citizen reports into actionable city-wide emergency strategies.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="h-48 w-full overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=800" alt="Urban damage" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full backdrop-blur-sm shadow-sm text-blue-600">
                  <Camera size={20} />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">1. AI Vision Analysis</h3>
                <p className="text-slate-600">Citizens upload incident photos. Our AI instantly classifies the severity and identifies the exact affected infrastructure node.</p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="h-48 w-full overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" alt="City Map Grid" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full backdrop-blur-sm shadow-sm text-orange-500">
                  <Zap size={20} />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">2. Cascade Prediction</h3>
                <p className="text-slate-600">Using rapid graph-traversal algorithms, the system maps the incident to the city grid to predict cascading dependencies and risks.</p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="h-48 w-full overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800" alt="Emergency Responders" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full backdrop-blur-sm shadow-sm text-emerald-500">
                  <Cpu size={20} />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">3. Response Generation</h3>
                <p className="text-slate-600">LLMs analyze the predicted cascade to generate a prioritized, step-by-step emergency response and routing plan for first responders.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-900 py-12 border-t border-slate-800 text-center relative z-10">
        <p className="text-slate-500 font-medium flex items-center justify-center gap-2">
          <Activity size={18} className="text-blue-500" /> CascadeZero MVP
        </p>
      </footer>
    </main>
  );
}
