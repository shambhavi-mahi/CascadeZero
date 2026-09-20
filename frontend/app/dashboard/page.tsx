"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Activity, ShieldAlert, Zap, Clock, CheckCircle2, AlertTriangle,
  ArrowRight, UploadCloud, Loader2, Play, Radio, MessageSquareWarning,
  Cpu
} from "lucide-react";
import UploadModal from "../components/UploadModal";
import CascadeTimeline from "../components/CascadeTimeline";
import RouteOptimizer from "../components/RouteOptimizer";
import PopulationImpact from "../components/PopulationImpact";
import DependencyGraph from "../components/DependencyGraph";
import ResourceAllocation from "../components/ResourceAllocation";
import WeatherRisk from "../components/WeatherRisk";
import ResilienceScore from "../components/ResilienceScore";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

type WorkflowPhase =
  | "IDLE"
  | "UPLOAD_MODAL"
  | "ANALYZING_IMAGE"
  | "INCIDENT_DETECTED"
  | "PREDICTING_CASCADE"
  | "CASCADE_IDENTIFIED"
  | "ACTIVATING_RESPONSE"
  | "RESOLVED";

interface TimelineEvent {
  time: string;
  title: string;
  subtitle: string;
  type: "info" | "warning" | "critical" | "success";
}

const eventTypeStyle: Record<TimelineEvent["type"], string> = {
  info: "border-blue-500 text-blue-600",
  warning: "border-orange-500 text-orange-600",
  critical: "border-red-500 text-red-600",
  success: "border-emerald-500 text-emerald-600",
};

const tabs = ["Command Center", "Dependency Graph", "Resources"];

export default function DashboardPage() {
  const [phase, setPhase] = useState<WorkflowPhase>("IDLE");
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [currentTime, setCurrentTime] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addEvent = (title: string, subtitle: string, type: TimelineEvent["type"]) => {
    const time = new Date().toLocaleTimeString("en-US", { hour12: false });
    setTimeline((prev) => [{ time, title, subtitle, type }, ...prev]);
  };

  useEffect(() => {
    if (phase === "ANALYZING_IMAGE") {
      addEvent("Citizen upload received", "Image sent for AI analysis", "info");
      setTimeout(() => setPhase("INCIDENT_DETECTED"), 2200);
    } else if (phase === "INCIDENT_DETECTED") {
      addEvent("Incident confirmed", "Flooded Road — Confidence 94%", "critical");
    } else if (phase === "PREDICTING_CASCADE") {
      addEvent("Cascade analysis started", "Traversing infrastructure dependency graph", "warning");
      setTimeout(() => setPhase("CASCADE_IDENTIFIED"), 2500);
    } else if (phase === "CASCADE_IDENTIFIED") {
      addEvent("Cascade risk identified", "3 nodes at risk, 18,420 residents affected", "warning");
    } else if (phase === "ACTIVATING_RESPONSE") {
      addEvent("Response plan activated", "Rerouting traffic via Route B", "info");
      setTimeout(() => setPhase("RESOLVED"), 2200);
    } else if (phase === "RESOLVED") {
      addEvent("System stabilized", "Backup route operational — Incident contained", "success");
    }
  }, [phase]);

  const isIncidentActive = !["IDLE", "UPLOAD_MODAL", "ANALYZING_IMAGE"].includes(phase);
  const isCascadeKnown = ["CASCADE_IDENTIFIED", "ACTIVATING_RESPONSE", "RESOLVED"].includes(phase);
  const isResolved = phase === "RESOLVED";

  const cityStatus = isIncidentActive
    ? phase === "RESOLVED"
      ? { label: "BACKUP ACTIVE", color: "text-blue-600 bg-blue-50 border-blue-200" }
      : { label: "INCIDENT ACTIVE", color: "text-red-600 bg-red-50 border-red-200" }
    : { label: "CITY STABLE", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };

  return (
    <div className="h-screen bg-slate-50 flex flex-col text-slate-900 font-sans overflow-hidden">

      {/* ─── Top Navbar ─── */}
      <nav className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-3 font-bold text-lg text-slate-900">
          <div className="bg-blue-100 p-1.5 rounded-lg">
            <Activity className="text-blue-600" size={18} />
          </div>
          CascadeZero
          <span className="text-xs font-normal text-slate-400 border-l border-slate-200 pl-3 ml-1">
            Urban Infrastructure Intelligence
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Citizen Reports badge */}
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <MessageSquareWarning size={13} />
            23 citizen reports
          </div>

          {/* City status pill */}
          <div className={`flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full border transition-all duration-500 ${cityStatus.color}`}>
            <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
            {cityStatus.label}
          </div>

          <button
            onClick={() => setPhase("UPLOAD_MODAL")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-200"
          >
            <UploadCloud size={15} />
            Report Incident
          </button>
        </div>
      </nav>

      {/* ─── Main Grid ─── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ══ LEFT: Map column ══ */}
        <div className="flex flex-col flex-1 min-w-0 p-3 gap-3 overflow-hidden">

          {/* Map */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative min-h-0">
            <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm font-semibold text-slate-700 text-xs flex items-center gap-2">
              <Radio size={13} className="text-blue-600" />
              LIVE CITY GRID — Vijayawada, AP
            </div>
            <Map phase={phase} />
          </div>

          {/* Status Bar */}
          <div className="h-14 bg-white rounded-xl shadow-sm border border-slate-200 px-5 flex items-center justify-between shrink-0">
            {[
              { label: "Nodes", value: "127", color: "text-slate-800" },
              { label: "Stable", value: "121", color: "text-emerald-600" },
              { label: "At Risk", value: isCascadeKnown ? "5" : "0", color: "text-orange-500" },
              { label: "Critical", value: isIncidentActive ? "1" : "0", color: "text-red-600" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                {i > 0 && <div className="w-px h-7 bg-slate-200" />}
                <div className="flex flex-col">
                  <span className={`text-xl font-bold leading-none ${item.color}`}>{item.value}</span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">{item.label}</span>
                </div>
              </div>
            ))}
            <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5 ml-auto">
              <Clock size={12} />
              {currentTime}
            </div>
          </div>

          {/* ── Bottom: Timeline ── */}
          <div className="h-28 bg-white rounded-xl shadow-sm border border-slate-200 px-4 py-3 shrink-0 overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={13} className="text-blue-600" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Live Event Timeline</span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-none">
              {timeline.length === 0 && (
                <p className="text-xs text-slate-400 italic py-1">Waiting for events…</p>
              )}
              {timeline.map((evt, i) => (
                <div key={i} className={`min-w-[180px] border-l-2 pl-3 py-0.5 animate-in fade-in slide-in-from-right-4 duration-300 ${eventTypeStyle[evt.type]}`}>
                  <p className="text-[10px] font-mono text-slate-400">{evt.time}</p>
                  <p className="font-bold text-slate-800 text-xs">{evt.title}</p>
                  <p className="text-slate-500 text-[11px]">{evt.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ CENTER: Command Panel ══ */}
        <div className="w-80 flex flex-col border-x border-slate-200 bg-white overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 shrink-0">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${activeTab === i ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-400 hover:text-slate-600"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">

            {/* TAB 0: Command Center */}
            {activeTab === 0 && (
              <>
                {/* IDLE State */}
                {!isIncidentActive && phase !== "ANALYZING_IMAGE" && (
                  <div className="flex flex-col items-center justify-center h-48 text-slate-300 gap-4">
                    <ShieldAlert size={40} />
                    <p className="text-sm text-center text-slate-400">System monitoring active.<br />No incidents detected.</p>
                  </div>
                )}

                {/* Analyzing State */}
                {phase === "ANALYZING_IMAGE" && (
                  <div className="flex flex-col items-center justify-center h-48 text-blue-600 gap-4 animate-in fade-in">
                    <Loader2 size={36} className="animate-spin" />
                    <p className="font-medium animate-pulse text-sm">AI analyzing incident image…</p>
                  </div>
                )}

                {/* Incident Card */}
                {isIncidentActive && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1 animate-pulse shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Incident Detected</p>
                        <p className="font-bold text-slate-800 text-base">Flooded Road</p>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-2 text-xs">
                          <span className="text-slate-500">Severity <span className="font-bold text-slate-800">HIGH</span></span>
                          <span className="text-slate-500">Confidence <span className="font-bold text-blue-600">94%</span></span>
                          <span className="text-slate-500">Node <span className="font-bold text-slate-800">Road 01</span></span>
                          <span className="text-slate-500">At <span className="font-bold text-slate-800 font-mono">{currentTime}</span></span>
                        </div>
                      </div>
                    </div>

                    {/* Predict button */}
                    {phase === "INCIDENT_DETECTED" && (
                      <button
                        onClick={() => setPhase("PREDICTING_CASCADE")}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-200 text-sm"
                      >
                        <Activity size={16} />
                        Predict Cascade Effect
                      </button>
                    )}

                    {/* Predicting loader */}
                    {phase === "PREDICTING_CASCADE" && (
                      <div className="flex flex-col items-center justify-center py-8 text-blue-600 gap-3 animate-in fade-in">
                        <Loader2 size={28} className="animate-spin" />
                        <p className="font-medium animate-pulse text-sm">Analyzing infrastructure dependencies…</p>
                        <p className="text-xs text-slate-400">Traversing 127 node dependency graph</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Cascade Timeline */}
                <CascadeTimeline visible={isCascadeKnown} />

                {/* Population Impact */}
                <PopulationImpact visible={isCascadeKnown} />

                {/* Activate button */}
                {phase === "CASCADE_IDENTIFIED" && (
                  <button
                    onClick={() => setPhase("ACTIVATING_RESPONSE")}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md text-sm"
                  >
                    <Play size={16} />
                    Activate Response Plan
                  </button>
                )}

                {/* Response Plan */}
                {(phase === "ACTIVATING_RESPONSE" || isResolved) && (
                  <div className="animate-in slide-in-from-bottom-4 duration-500">
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                      <CheckCircle2 size={15} className="text-emerald-500" />
                      Response Plan
                    </h3>
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 space-y-2 mb-3">
                      <p className="font-medium text-slate-800 text-sm flex items-center gap-2">
                        <ArrowRight size={14} className="text-blue-600" />
                        Redirect traffic via Route B
                      </p>
                      <p className="font-medium text-slate-800 text-sm flex items-center gap-2">
                        <ArrowRight size={14} className="text-blue-600" />
                        Protect Emergency Route 02
                      </p>
                      <p className="font-medium text-slate-800 text-sm flex items-center gap-2">
                        <ArrowRight size={14} className="text-blue-600" />
                        Deploy Generator 1 → Hospital A
                      </p>
                    </div>
                    {phase === "ACTIVATING_RESPONSE" ? (
                      <div className="text-center text-blue-600 font-medium text-sm flex items-center justify-center gap-2 animate-pulse">
                        <Loader2 size={14} className="animate-spin" /> Rerouting infrastructure…
                      </div>
                    ) : (
                      <div className="text-center text-emerald-600 font-medium text-sm flex items-center justify-center gap-2">
                        <CheckCircle2 size={14} /> System Stable — Backup Route Active
                      </div>
                    )}
                  </div>
                )}

                {/* Route Optimizer */}
                <RouteOptimizer visible={isCascadeKnown} />
              </>
            )}

            {/* TAB 1: Dependency Graph */}
            {activeTab === 1 && (
              <div className="space-y-4">
                <DependencyGraph visible={true} />
                <p className="text-xs text-slate-400 italic">Click a node to see its dependency chain and failure impact.</p>

                {/* Priority Table */}
                <div>
                  <h3 className="font-bold text-slate-700 mb-2 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Cpu size={13} className="text-blue-600" />
                    Infrastructure Priority
                  </h3>
                  <div className="space-y-1">
                    {[
                      { name: "Hospital ICU", priority: "CRITICAL", color: "text-red-600 bg-red-50 border-red-200" },
                      { name: "Fire Station", priority: "CRITICAL", color: "text-red-600 bg-red-50 border-red-200" },
                      { name: "Water Treatment Plant", priority: "CRITICAL", color: "text-red-600 bg-red-50 border-red-200" },
                      { name: "Traffic Signals", priority: "HIGH", color: "text-orange-600 bg-orange-50 border-orange-200" },
                      { name: "School", priority: "MEDIUM", color: "text-amber-700 bg-amber-50 border-amber-200" },
                      { name: "Shopping Mall", priority: "LOW", color: "text-slate-500 bg-slate-50 border-slate-200" },
                    ].map((item) => (
                      <div key={item.name} className="flex items-center justify-between py-1.5 border-b border-slate-50">
                        <span className="text-xs text-slate-700">{item.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${item.color}`}>{item.priority}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Resources */}
            {activeTab === 2 && (
              <div className="space-y-6">
                <ResourceAllocation visible={true} />
                {/* What If Widget */}
                <div>
                  <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Zap size={15} className="text-violet-600" />
                    What If? Digital Twin
                  </h3>
                  <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 space-y-3">
                    <div>
                      <label className="text-xs text-slate-500 font-semibold block mb-1">Simulate Failure</label>
                      <select className="w-full text-sm border border-slate-200 rounded-lg p-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-300">
                        <option>Power Station Failure</option>
                        <option>Major Flood Event</option>
                        <option>Hospital Overload</option>
                        <option>Road Network Collapse</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white rounded p-2 border border-slate-100 text-center">
                        <p className="font-bold text-slate-800">72%</p>
                        <p className="text-slate-400">Area Affected</p>
                      </div>
                      <div className="bg-white rounded p-2 border border-slate-100 text-center">
                        <p className="font-bold text-slate-800">12,400</p>
                        <p className="text-slate-400">Population Exposed</p>
                      </div>
                      <div className="bg-white rounded p-2 border border-slate-100 text-center">
                        <p className="font-bold text-red-600">2</p>
                        <p className="text-slate-400">Hospitals</p>
                      </div>
                      <div className="bg-white rounded p-2 border border-slate-100 text-center">
                        <p className="font-bold text-orange-600">5</p>
                        <p className="text-slate-400">Roads Affected</p>
                      </div>
                    </div>
                    <button className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                      <Activity size={15} />
                      Simulate Cascade
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ══ RIGHT: Sidebar ══ */}
        <div className="w-64 flex flex-col gap-3 p-3 overflow-y-auto bg-slate-50 border-l border-slate-200 shrink-0">
          <WeatherRisk phase={phase} />
          <ResilienceScore phase={phase} />
        </div>

      </div>

      {/* Modals */}
      {phase === "UPLOAD_MODAL" && (
        <UploadModal
          onClose={() => setPhase("IDLE")}
          onUpload={() => setPhase("ANALYZING_IMAGE")}
        />
      )}
    </div>
  );
}
