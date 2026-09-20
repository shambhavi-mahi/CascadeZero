"use client";
import { Navigation, AlertTriangle, CheckCircle2, Minus } from "lucide-react";
import type { Route } from "../types";

const routes: Route[] = [
  { id: "a", name: "Route A", distance: "4.2 km", risk: "HIGH", score: 87, recommended: false },
  { id: "b", name: "Route B", distance: "5.1 km", risk: "LOW", score: 23, recommended: true },
  { id: "c", name: "Route C", distance: "4.8 km", risk: "MEDIUM", score: 55, recommended: false },
];

const riskStyle: Record<Route["risk"], { badge: string; bar: string; icon: JSX.Element }> = {
  HIGH: { badge: "bg-red-100 text-red-700 border-red-200", bar: "bg-red-500", icon: <AlertTriangle size={12} /> },
  MEDIUM: { badge: "bg-orange-100 text-orange-700 border-orange-200", bar: "bg-orange-500", icon: <Minus size={12} /> },
  LOW: { badge: "bg-emerald-100 text-emerald-700 border-emerald-200", bar: "bg-emerald-500", icon: <CheckCircle2 size={12} /> },
};

interface RouteOptimizerProps {
  visible: boolean;
}

export default function RouteOptimizer({ visible }: RouteOptimizerProps) {
  if (!visible) return null;

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 delay-200">
      <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
        <Navigation size={16} className="text-blue-600" />
        Emergency Route Optimizer
      </h3>
      <p className="text-xs text-slate-500 mb-4">
        Score = distance + congestion + incident risk + road accessibility
      </p>

      <div className="space-y-3">
        {routes.map((route) => {
          const style = riskStyle[route.risk];
          return (
            <div
              key={route.id}
              className={`rounded-xl border p-3 ${route.recommended ? "border-emerald-300 bg-emerald-50 ring-1 ring-emerald-200" : "border-slate-100 bg-slate-50"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 text-sm">{route.name}</span>
                  {route.recommended && (
                    <span className="text-xs bg-emerald-600 text-white px-1.5 py-0.5 rounded font-semibold">RECOMMENDED</span>
                  )}
                </div>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${style.badge}`}>
                  {style.icon}
                  {route.risk} RISK
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-14 shrink-0">{route.distance}</span>
                <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${route.score}%` }} />
                </div>
                <span className="text-xs font-mono text-slate-400 w-14 text-right shrink-0">Score {route.score}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
