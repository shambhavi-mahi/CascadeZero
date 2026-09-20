"use client";
import { AlertTriangle, Clock, Zap, Droplets, Car, Building2, Ambulance, ShieldCheck } from "lucide-react";
import type { CascadeNode } from "../types";

const nodeTypeIcon = (type: CascadeNode["type"]) => {
  switch (type) {
    case "road": return <Car size={14} />;
    case "junction": return <Zap size={14} />;
    case "hospital": return <Building2 size={14} />;
    case "power": return <Zap size={14} />;
    case "water": return <Droplets size={14} />;
    case "emergency": return <Ambulance size={14} />;
    default: return <ShieldCheck size={14} />;
  }
};

const statusColors: Record<CascadeNode["status"], string> = {
  stable: "bg-emerald-100 border-emerald-300 text-emerald-700",
  at_risk: "bg-orange-100 border-orange-300 text-orange-700",
  critical: "bg-red-100 border-red-300 text-red-700",
  backup: "bg-blue-100 border-blue-300 text-blue-700",
};

const dotColors: Record<CascadeNode["status"], string> = {
  stable: "bg-emerald-500",
  at_risk: "bg-orange-500 animate-pulse",
  critical: "bg-red-500 animate-pulse",
  backup: "bg-blue-500",
};

const cascadeNodes: CascadeNode[] = [
  { id: "1", name: "Road 01", type: "road", status: "critical", eta: "NOW" },
  { id: "2", name: "Traffic Junction 04", type: "junction", status: "at_risk", eta: "+15 min" },
  { id: "3", name: "Emergency Route 02", type: "emergency", status: "at_risk", eta: "+30 min" },
  { id: "4", name: "City Hospital", type: "hospital", status: "at_risk", eta: "+45 min" },
  { id: "5", name: "Water Treatment Plant", type: "water", status: "stable", eta: "+60 min" },
];

interface CascadeTimelineProps {
  visible: boolean;
}

export default function CascadeTimeline({ visible }: CascadeTimelineProps) {
  if (!visible) return null;

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
        <AlertTriangle size={16} className="text-orange-500" />
        Predictive Cascade Timeline
      </h3>

      <div className="space-y-0">
        {cascadeNodes.map((node, i) => (
          <div key={node.id} className="flex gap-3">
            {/* Timeline spine */}
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full shrink-0 mt-1 ${dotColors[node.status]}`} />
              {i < cascadeNodes.length - 1 && (
                <div className="w-px flex-1 bg-slate-200 my-1 min-h-[20px]" />
              )}
            </div>

            {/* Content */}
            <div className="pb-4 flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColors[node.status]}`}>
                  {nodeTypeIcon(node.type)}
                  {node.name}
                </span>
                <span className="flex items-center gap-1 text-xs font-mono text-slate-400">
                  <Clock size={11} />
                  {node.eta}
                </span>
              </div>
              <p className="text-xs text-slate-500 capitalize">{node.status.replace("_", " ")} — {node.type} infrastructure</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
