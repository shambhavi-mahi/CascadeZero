"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Activity, Camera, MapPin, Zap, ShieldAlert, Cpu, ArrowLeft } from "lucide-react";
import Link from "next/link";

const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-slate-100 animate-pulse rounded-lg border border-slate-200 flex flex-col items-center justify-center text-slate-400"><MapPin className="mb-2 opacity-50" size={32} />Loading City Grid...</div>
});

export default function Dashboard() {
  const [infrastructure, setInfrastructure] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // App State
  const [activeIncident, setActiveIncident] = useState<any>(null);
  const [cascadeResult, setCascadeResult] = useState<any>(null);
  const [responsePlan, setResponsePlan] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  useEffect(() => {
    fetch("http://localhost:8000/api/infrastructure")
      .then(res => res.json())
      .then(data => {
        setInfrastructure(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load infrastructure data", err);
        setLoading(false);
      });
  }, []);

  const simulateIncidentUpload = async () => {
    setIsAnalyzing(true);
    setCascadeResult(null);
    setResponsePlan(null);
    
    // Simulate AI Vision delay
    setTimeout(async () => {
      try {
        const res = await fetch("http://localhost:8000/api/analyze-incident", { method: "POST" });
        const data = await res.json();
        setActiveIncident(data);
      } catch(e) {
        console.error(e);
      }
      setIsAnalyzing(false);
    }, 1500);
  };

  const calculateCascade = async () => {
    if (!activeIncident) return;
    
    try {
      const failedNode = activeIncident.affected_infrastructure[0];
      const res = await fetch("http://localhost:8000/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ node_id: failedNode, severity: activeIncident.severity })
      });
      const data = await res.json();
      setCascadeResult(data);
    } catch(e) {
      console.error(e);
    }
  };

  const generatePlan = async () => {
    if (!activeIncident || !cascadeResult) return;
    
    try {
      const res = await fetch("http://localhost:8000/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ incident: activeIncident, cascade: cascadeResult })
      });
      const data = await res.json();
      setResponsePlan(data.plan);
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <Activity className="text-blue-600" /> CascadeZero
              </h1>
              <p className="text-slate-500 mt-1 text-sm">Command Dashboard</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={simulateIncidentUpload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium text-sm shadow-sm"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? <span className="animate-spin text-white">⚙</span> : <Camera size={16} />}
              {isAnalyzing ? "AI Analyzing..." : "Citizen Upload"}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-lg font-semibold text-slate-800">Live City Grid</h2>
              <div className="flex gap-3 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div> Stable</span>
                <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div> At Risk</span>
                <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div> Critical</span>
              </div>
            </div>
            
            <div className="flex-grow">
              {loading ? (
                <div className="h-[600px] w-full bg-white animate-pulse rounded-lg border border-slate-200 shadow-sm"></div>
              ) : (
                <Map infrastructure={infrastructure} />
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex-grow flex flex-col">
              <h2 className="text-lg font-semibold border-b border-slate-100 pb-3 mb-4 flex items-center gap-2 text-slate-800">
                <ShieldAlert size={18} className="text-orange-500" />
                Command Center
              </h2>
              
              {!activeIncident && !isAnalyzing && (
                <div className="flex-grow flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50 rounded-lg border border-slate-200 border-dashed">
                  <Activity size={32} className="mb-3 opacity-30" />
                  <p className="text-sm text-slate-500">No active incidents.</p>
                  <p className="text-xs mt-1 text-slate-400">Waiting for reports...</p>
                </div>
              )}
              
              {activeIncident && (
                <div className="space-y-5 flex-grow animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                    <h3 className="text-red-600 font-bold text-sm mb-1 uppercase tracking-wider flex items-center gap-1">
                      <Zap size={14} /> Incident Detected
                    </h3>
                    <p className="font-semibold text-lg text-slate-900">{activeIncident.incident_type.replace("_", " ").toUpperCase()}</p>
                    <p className="text-slate-600 text-sm mt-2">{activeIncident.description}</p>
                    <div className="mt-3 text-xs bg-white border border-slate-100 p-2 rounded text-slate-500 flex justify-between shadow-sm">
                      <span>Confidence: {(activeIncident.confidence * 100).toFixed(0)}%</span>
                      <span>Target Node: {activeIncident.affected_infrastructure[0]}</span>
                    </div>
                  </div>
                  
                  {!cascadeResult && (
                    <button 
                      onClick={calculateCascade}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-md"
                    >
                      <Activity size={16} /> Predict Cascade Effect
                    </button>
                  )}
                  
                  {cascadeResult && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 animate-in zoom-in-95 duration-300">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-sm text-slate-800">Risk Assessment</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          cascadeResult.risk_assessment.level === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                          cascadeResult.risk_assessment.level === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {cascadeResult.risk_assessment.level} ({cascadeResult.risk_assessment.score}/100)
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-slate-600 mb-4">
                        <div className="flex justify-between border-b border-slate-200 pb-1">
                          <span>Nodes Affected:</span>
                          <span className="font-bold text-slate-900">{cascadeResult.total_affected}</span>
                        </div>
                      </div>

                      {!responsePlan ? (
                         <button 
                          onClick={generatePlan}
                          className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Cpu size={16} /> Generate Response Plan
                        </button>
                      ) : (
                        <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 mt-4 text-xs font-mono text-emerald-400 whitespace-pre-wrap shadow-inner animate-in fade-in duration-700">
                          {responsePlan}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
