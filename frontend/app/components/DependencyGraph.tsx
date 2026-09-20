"use client";
import { Cpu, Zap, Droplets, Car, Building2, Ambulance } from "lucide-react";

interface DependencyGraphProps {
  visible: boolean;
}

const nodes = [
  { id: "power", label: "Power Station", icon: Zap, x: 50, y: 10, status: "critical" },
  { id: "hospital", label: "City Hospital", icon: Building2, x: 15, y: 50, status: "at_risk" },
  { id: "traffic", label: "Traffic Signals", icon: Car, x: 50, y: 50, status: "at_risk" },
  { id: "water", label: "Water Pump", icon: Droplets, x: 82, y: 50, status: "stable" },
  { id: "icu", label: "ICU", icon: Building2, x: 5, y: 85, status: "at_risk" },
  { id: "route", label: "Emergency Route", icon: Ambulance, x: 35, y: 85, status: "at_risk" },
  { id: "supply", label: "Water Supply", icon: Droplets, x: 82, y: 85, status: "stable" },
];

const edges = [
  ["power", "hospital"],
  ["power", "traffic"],
  ["power", "water"],
  ["hospital", "icu"],
  ["traffic", "route"],
  ["water", "supply"],
];

const statusColor: Record<string, string> = {
  critical: "#ef4444",
  at_risk: "#f97316",
  stable: "#10b981",
  backup: "#0ea5e9",
};

export default function DependencyGraph({ visible }: DependencyGraphProps) {
  if (!visible) return null;

  return (
    <div className="animate-in fade-in duration-500">
      <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
        <Cpu size={16} className="text-blue-600" />
        Infrastructure Dependency Graph
      </h3>
      <div className="bg-slate-900 rounded-xl overflow-hidden relative" style={{ height: 200 }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {edges.map(([from, to], i) => {
            const a = nodes.find(n => n.id === from)!;
            const b = nodes.find(n => n.id === to)!;
            return (
              <line
                key={i}
                x1={a.x} y1={a.y + 5} x2={b.x} y2={b.y - 1}
                stroke="#334155" strokeWidth="0.5"
              />
            );
          })}
          {nodes.map((node) => (
            <g key={node.id}>
              <circle cx={node.x} cy={node.y} r={4} fill={statusColor[node.status]} opacity={0.9} />
              <text x={node.x} y={node.y + 8} textAnchor="middle" fontSize="2.8" fill="#94a3b8">
                {node.label.length > 10 ? node.label.slice(0, 10) + "…" : node.label}
              </text>
            </g>
          ))}
        </svg>
        {/* Legend */}
        <div className="absolute bottom-2 right-2 flex flex-col gap-1">
          {[["critical", "Critical"], ["at_risk", "At Risk"], ["stable", "Stable"]].map(([k, l]) => (
            <div key={k} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor[k] }} />
              <span className="text-[9px] text-slate-400">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
