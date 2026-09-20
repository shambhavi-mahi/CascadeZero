"use client";
import { Users, Building2, School, Siren, Radio } from "lucide-react";

interface ImpactProps {
  visible: boolean;
}

const impacts = [
  { label: "Residents", value: "18,420", icon: <Users size={16} className="text-slate-500" /> },
  { label: "Hospitals", value: "2", icon: <Building2 size={16} className="text-red-500" /> },
  { label: "Schools", value: "3", icon: <School size={16} className="text-orange-500" /> },
  { label: "Emergency Corridors", value: "1", icon: <Siren size={16} className="text-red-500" /> },
  { label: "Traffic Signals", value: "6", icon: <Radio size={16} className="text-amber-500" /> },
];

export default function PopulationImpact({ visible }: ImpactProps) {
  if (!visible) return null;

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 delay-300">
      <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
        <Users size={16} className="text-violet-600" />
        Population Impact
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {impacts.map((item) => (
          <div key={item.label} className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex items-center gap-3">
            {item.icon}
            <div>
              <p className="font-bold text-slate-800 text-sm">{item.value}</p>
              <p className="text-xs text-slate-500">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
