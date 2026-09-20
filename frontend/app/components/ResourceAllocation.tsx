"use client";
import { Zap, Ambulance, Droplets, Users, ArrowRight } from "lucide-react";

interface ResourceAllocationProps {
  visible: boolean;
}

const resources = [
  { id: "gen1", name: "Generator 1", type: "generator" as const, assignedTo: "City Hospital A", icon: Zap },
  { id: "gen2", name: "Generator 2", type: "generator" as const, assignedTo: "Water Treatment Plant", icon: Zap },
  { id: "amb1", name: "Ambulance 1", type: "ambulance" as const, assignedTo: "Emergency Route 02", icon: Ambulance },
  { id: "amb2", name: "Ambulance 2", type: "ambulance" as const, assignedTo: "City Hospital A", icon: Ambulance },
  { id: "tank1", name: "Water Tanker 1", type: "water_tanker" as const, assignedTo: "Hospital A", icon: Droplets },
  { id: "team1", name: "Response Team Alpha", type: "team" as const, assignedTo: "Road 01 (Flood Zone)", icon: Users },
];

const typeColor: Record<string, string> = {
  generator: "bg-amber-100 text-amber-700 border-amber-200",
  ambulance: "bg-red-100 text-red-700 border-red-200",
  water_tanker: "bg-blue-100 text-blue-700 border-blue-200",
  team: "bg-violet-100 text-violet-700 border-violet-200",
};

export default function ResourceAllocation({ visible }: ResourceAllocationProps) {
  if (!visible) return null;

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 delay-150">
      <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
        <Zap size={16} className="text-amber-500" />
        Resource Allocation
      </h3>
      <div className="space-y-2">
        {resources.map((res) => {
          const Icon = res.icon;
          return (
            <div key={res.id} className="flex items-center gap-2 bg-slate-50 rounded-lg p-2 border border-slate-100">
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded border shrink-0 ${typeColor[res.type]}`}>
                <Icon size={11} />
                {res.name}
              </span>
              <ArrowRight size={12} className="text-slate-400 shrink-0" />
              <span className="text-xs text-slate-600 font-medium truncate">{res.assignedTo}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
