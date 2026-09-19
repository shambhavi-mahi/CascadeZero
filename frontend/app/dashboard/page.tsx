"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Activity, ShieldAlert, Zap, Clock, CheckCircle2, AlertTriangle, ArrowRight, UploadCloud, Loader2, Play } from "lucide-react";
import UploadModal from "../components/UploadModal";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

type WorkflowPhase = "IDLE" | "UPLOAD_MODAL" | "ANALYZING_IMAGE" | "INCIDENT_DETECTED" | "PREDICTING_CASCADE" | "CASCADE_IDENTIFIED" | "ACTIVATING_RESPONSE" | "RESOLVED";

interface TimelineEvent {
  time: string;
  title: string;
  subtitle: string;
}

export default function DashboardPage() {
  const [phase, setPhase] = useState<WorkflowPhase>("IDLE");
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Helpers to add timeline events
  const addTimelineEvent = (title: string, subtitle: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTimeline(prev => [{ time, title, subtitle }, ...prev]);
  };

  // State Machine Effects
  useEffect(() => {
    if (phase === "ANALYZING_IMAGE") {
      addTimelineEvent("Incident reported", "Citizen upload received");
      setTimeout(() => {
        setPhase("INCIDENT_DETECTED");
      }, 2000);
    }
    else if (phase === "INCIDENT_DETECTED") {
      addTimelineEvent("Image analyzed", "Confidence 94% - Flooded Road");
    }
    else if (phase === "PREDICTING_CASCADE") {
      setTimeout(() => {
        setPhase("CASCADE_IDENTIFIED");
      }, 2500);
    }
    else if (phase === "CASCADE_IDENTIFIED") {
      addTimelineEvent("Cascade risk identified", "3 connected nodes at risk");
    }
    else if (phase === "ACTIVATING_RESPONSE") {
      addTimelineEvent("Response activated", "Rerouting via Route B");
      setTimeout(() => {
        setPhase("RESOLVED");
      }, 2000);
    }
    else if (phase === "RESOLVED") {
      addTimelineEvent("System stabilized", "Backup route fully operational");
    }
  }, [phase]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans h-screen overflow-hidden">
      
      {/* Top Navbar */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-3 font-bold text-xl text-slate-900">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Activity className="text-blue-600" size={20} />
          </div>
          CascadeZero
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            CITY STABLE
          </div>
          <button 
            onClick={() => setPhase("UPLOAD_MODAL")}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <UploadCloud size={16} />
            Citizen Upload
          </button>
        </div>
      </nav>

      {/* Main Content Grid */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        
        {/* LEFT COLUMN: Map & Status */}
        <div className="w-2/3 flex flex-col gap-4">
          {/* Map Section */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative">
            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-lg border border-slate-200 shadow-sm font-semibold text-slate-700 text-sm flex items-center gap-2">
              <Activity size={16} className="text-blue-600" />
              LIVE CITY GRID
            </div>
            <Map phase={phase} />
          </div>

          {/* Status Bar Section */}
          <div className="h-16 bg-white rounded-xl shadow-sm border border-slate-200 px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-800">127</span>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Nodes</span>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-emerald-600">121</span>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Stable</span>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-orange-500">
                  {["CASCADE_IDENTIFIED", "ACTIVATING_RESPONSE", "RESOLVED"].includes(phase) ? "5" : "0"}
                </span>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                  At Risk <AlertTriangle size={12} />
                </span>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-red-600">
                  {phase !== "IDLE" && phase !== "UPLOAD_MODAL" && phase !== "ANALYZING_IMAGE" ? "1" : "0"}
                </span>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                  Critical <ShieldAlert size={12} />
                </span>
              </div>
            </div>
            <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
              <Clock size={14} />
              Last updated: {currentTime}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Command Center */}
        <div className="w-1/3 flex flex-col gap-4">
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <Zap size={18} className="text-amber-500" />
                COMMAND CENTER
              </h2>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto space-y-8">
              
              {/* State: IDLE */}
              {phase === "IDLE" && (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <ShieldAlert size={48} className="opacity-20" />
                  <p>System monitoring active. No incidents detected.</p>
                </div>
              )}

              {/* State: Incident Details */}
              {phase !== "IDLE" && phase !== "UPLOAD_MODAL" && phase !== "ANALYZING_IMAGE" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5 animate-pulse"></div>
                    <div>
                      <h3 className="font-bold text-red-600 text-lg">INCIDENT DETECTED</h3>
                      <p className="text-slate-700 font-medium text-xl">FLOODED ROAD</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg p-4 grid grid-cols-2 gap-4 border border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-semibold">Severity</p>
                      <p className="font-bold text-slate-800">HIGH</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-semibold">Confidence</p>
                      <p className="font-bold text-blue-600">94%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-semibold">Affected</p>
                      <p className="font-bold text-slate-800">Road 01</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-semibold">Detected</p>
                      <p className="font-bold text-slate-800 font-mono text-sm">{currentTime}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* State: Cascade Risk */}
              {phase === "INCIDENT_DETECTED" && (
                <div className="pt-4 border-t border-slate-100 animate-in fade-in duration-500 delay-300">
                  <button 
                    onClick={() => setPhase("PREDICTING_CASCADE")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-200 group"
                  >
                    <Activity size={20} className="group-hover:animate-pulse" />
                    Predict Cascade Effect
                  </button>
                </div>
              )}

              {phase === "PREDICTING_CASCADE" && (
                <div className="pt-4 border-t border-slate-100 flex flex-col items-center justify-center py-8 text-blue-600 space-y-4 animate-in fade-in">
                  <Loader2 size={32} className="animate-spin" />
                  <p className="font-medium animate-pulse">Analyzing infrastructure dependencies...</p>
                </div>
              )}

              {(phase === "CASCADE_IDENTIFIED" || phase === "ACTIVATING_RESPONSE" || phase === "RESOLVED") && (
                <div className="pt-4 border-t border-slate-100 animate-in slide-in-from-bottom-4 duration-500">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <AlertTriangle size={18} className="text-orange-500" />
                    CASCADE RISK
                  </h3>
                  <p className="text-orange-600 font-medium mb-4 bg-orange-50 p-2 rounded-lg border border-orange-100 inline-block">
                    3 infrastructure nodes at risk
                  </p>
                  
                  <div className="pl-4 border-l-2 border-slate-200 space-y-4 relative mb-8">
                    <div className="relative">
                      <div className="absolute w-3 h-3 bg-red-500 rounded-full -left-[23px] top-1"></div>
                      <p className="font-bold text-slate-800">Road 01</p>
                    </div>
                    <div className="relative">
                      <div className="absolute w-3 h-3 bg-orange-500 rounded-full -left-[23px] top-1"></div>
                      <p className="font-bold text-slate-800">Traffic Junction 04</p>
                    </div>
                    <div className="relative">
                      <div className="absolute w-3 h-3 bg-orange-500 rounded-full -left-[23px] top-1"></div>
                      <p className="font-bold text-slate-800">Emergency Route 02</p>
                    </div>
                  </div>

                  {phase === "CASCADE_IDENTIFIED" && (
                    <button 
                      onClick={() => setPhase("ACTIVATING_RESPONSE")}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <Play size={20} />
                      Activate Response Plan
                    </button>
                  )}
                </div>
              )}

              {/* State: Response Plan */}
              {(phase === "ACTIVATING_RESPONSE" || phase === "RESOLVED") && (
                <div className="pt-4 border-t border-slate-100 animate-in slide-in-from-bottom-4 duration-500">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    RECOMMENDED RESPONSE
                  </h3>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2">
                    <p className="font-medium text-slate-800 flex items-center gap-2">
                      <ArrowRight size={16} className="text-blue-600" />
                      Redirect traffic via Route B
                    </p>
                    <p className="font-medium text-slate-800 flex items-center gap-2">
                      <ArrowRight size={16} className="text-blue-600" />
                      Protect Emergency Route 02
                    </p>
                  </div>
                  
                  {phase === "ACTIVATING_RESPONSE" ? (
                    <div className="mt-4 text-center text-blue-600 font-medium animate-pulse flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" /> Rerouting infrastructure...
                    </div>
                  ) : (
                    <div className="mt-4 text-center text-emerald-600 font-medium flex items-center justify-center gap-2">
                      <CheckCircle2 size={16} /> System Stable
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM ROW: Timeline */}
      <div className="h-40 bg-white border-t border-slate-200 shrink-0 p-4">
        <h3 className="font-bold text-slate-800 text-sm mb-4 px-2 uppercase tracking-wider flex items-center gap-2">
          <Clock size={16} className="text-blue-600" />
          Live Event Timeline
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-2 px-2 scrollbar-thin scrollbar-thumb-slate-200">
          {timeline.map((event, i) => (
            <div key={i} className="min-w-[200px] border-l-2 border-blue-600 pl-4 py-1 animate-in fade-in slide-in-from-right-4 duration-300">
              <p className="text-xs font-mono text-slate-400 mb-1">{event.time}</p>
              <p className="font-bold text-slate-800 text-sm">{event.title}</p>
              <p className="text-slate-600 text-xs">{event.subtitle}</p>
            </div>
          ))}
          {timeline.length === 0 && (
            <div className="text-slate-400 text-sm italic py-2">Waiting for events...</div>
          )}
        </div>
      </div>

      {/* Modals */}
      {phase === "UPLOAD_MODAL" && (
        <UploadModal 
          onClose={() => setPhase("IDLE")} 
          onUpload={() => {
            setPhase("ANALYZING_IMAGE");
          }} 
        />
      )}
    </div>
  );
}
