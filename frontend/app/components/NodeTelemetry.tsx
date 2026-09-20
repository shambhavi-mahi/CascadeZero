"use client";
import { Zap, Droplets, Car, Building2, MapPin } from "lucide-react";

interface NodeTelemetryProps {
  node: any;
}

export default function NodeTelemetry({ node }: NodeTelemetryProps) {
  if (!node) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center border-2 border-dashed border-slate-200 rounded-xl">
        <MapPin size={32} className="mb-2 opacity-50" />
        <p className="text-sm font-medium">Select a node in the Digital Twin to view live telemetry data.</p>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'power': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'water': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'hospital': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'shelter': return 'text-violet-600 bg-violet-50 border-violet-200';
      case 'transit': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'dispatch': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'normal': return 'text-emerald-600';
      case 'warning': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      case 'backup': return 'text-blue-600';
      default: return 'text-slate-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full animate-in fade-in duration-300">
      
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <Activity size={16} className="text-blue-600" />
          Node Telemetry Inspector
        </h3>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getTypeColor(node.type)}`}>
          {node.type}
        </span>
      </div>

      <div className="p-5 space-y-6 overflow-y-auto flex-1">
        
        {/* Identifier */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Node Identifier</p>
          <p className="text-lg font-bold text-slate-800">{node.label}</p>
          <p className="text-xs text-slate-500 font-mono mt-1 flex items-center gap-1">
            <MapPin size={10} />
            Lat {((node.x * 20) + 20).toFixed(4)}° N, Long -{((node.y * 20) + 70).toFixed(4)}° W
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Operational Load</p>
            <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
               {node.load ? `${node.load}% Active` : "Idle"}
            </p>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">System Status</p>
             <p className={`text-sm font-bold capitalize flex items-center gap-1.5 ${getStatusColor(node.status)}`}>
               <div className={`w-2 h-2 rounded-full bg-current ${node.status !== 'normal' ? 'animate-pulse' : ''}`} />
               {node.status}
             </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Capacity / Resources</p>
            <p className="text-sm font-bold text-slate-800">
              {node.capacity || "Nominal"}
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Uptime</p>
             <p className="text-sm font-bold text-slate-800 font-mono">
               99.9%
             </p>
          </div>
        </div>

        {/* Cascade State */}
        <div className="bg-slate-900 rounded-xl p-4 text-white">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Cascade Rewrite State</p>
          
          {node.status === "normal" && (
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 p-2 rounded-lg border border-emerald-400/20 text-sm font-medium">
              <CheckCircle2 size={16} /> Standard Mode (No Fault)
            </div>
          )}
          {node.status === "warning" && (
            <div className="flex items-center gap-2 text-orange-400 bg-orange-400/10 p-2 rounded-lg border border-orange-400/20 text-sm font-medium">
              <AlertTriangle size={16} /> Elevated Risk Detected
            </div>
          )}
          {node.status === "critical" && (
            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-2 rounded-lg border border-red-400/20 text-sm font-medium animate-pulse">
              <AlertTriangle size={16} /> Critical Failure Mode
            </div>
          )}
          {node.status === "backup" && (
            <div className="flex items-center gap-2 text-blue-400 bg-blue-400/10 p-2 rounded-lg border border-blue-400/20 text-sm font-medium">
               <Zap size={16} /> Backup Flow Active
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Add these missing imports at the top
import { Activity, CheckCircle2, AlertTriangle } from "lucide-react";
