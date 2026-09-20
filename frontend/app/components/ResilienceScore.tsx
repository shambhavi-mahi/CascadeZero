"use client";
import { BarChart3 } from "lucide-react";

interface ResilienceProps {
  phase: string;
}

const dimensions = [
  { label: "Power", score: 90, color: "bg-blue-500" },
  { label: "Water", score: 82, color: "bg-cyan-500" },
  { label: "Roads", score: 55, color: "bg-orange-500" },
  { label: "Healthcare", score: 70, color: "bg-violet-500" },
  { label: "Emergency", score: 88, color: "bg-emerald-500" },
];

export default function ResilienceScore({ phase }: ResilienceProps) {
  const affected = ["INCIDENT_DETECTED", "PREDICTING_CASCADE", "CASCADE_IDENTIFIED", "ACTIVATING_RESPONSE"].includes(phase);
  const resolved = phase === "RESOLVED";

  const scores = dimensions.map(d => ({
    ...d,
    score: affected && d.label === "Roads" ? 28 : resolved && d.label === "Roads" ? 72 : d.score,
  }));

  const avg = Math.round(scores.reduce((a, b) => a + b.score, 0) / scores.length);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
          <BarChart3 size={16} className="text-blue-600" />
          City Resilience Score
        </h3>
        <div className="text-right">
          <span className={`text-2xl font-bold ${avg >= 80 ? "text-emerald-600" : avg >= 60 ? "text-orange-500" : "text-red-600"}`}>{avg}</span>
          <span className="text-slate-400 text-sm">/100</span>
        </div>
      </div>

      <div className="space-y-2">
        {scores.map((dim) => (
          <div key={dim.label}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs text-slate-500 font-medium">{dim.label}</span>
              <span className="text-xs font-mono font-bold text-slate-700">{dim.score}</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${dim.color}`}
                style={{ width: `${dim.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
