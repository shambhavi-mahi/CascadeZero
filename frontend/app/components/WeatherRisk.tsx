"use client";
import { CloudRain, Wind, Thermometer, TrendingUp } from "lucide-react";

interface WeatherProps {
  phase: string;
}

export default function WeatherRisk({ phase }: WeatherProps) {
  const floodRisk = phase === "IDLE" ? 34 : 71;
  const isHighRisk = floodRisk > 50;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
        <CloudRain size={16} className="text-blue-500" />
        Weather-Aware Risk
      </h3>

      <div className="flex items-start gap-3 mb-4 bg-blue-50 border border-blue-100 rounded-lg p-3">
        <CloudRain size={20} className="text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-slate-800 text-sm">Heavy Rain Forecast</p>
          <p className="text-xs text-slate-500 mt-0.5">Drainage capacity reduced — Flood probability elevated</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
          <Thermometer size={14} className="text-slate-400 mx-auto mb-1" />
          <p className="font-bold text-slate-800 text-sm">26°C</p>
          <p className="text-xs text-slate-400">Temp</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
          <Wind size={14} className="text-slate-400 mx-auto mb-1" />
          <p className="font-bold text-slate-800 text-sm">32 km/h</p>
          <p className="text-xs text-slate-400">Wind</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
          <CloudRain size={14} className="text-blue-400 mx-auto mb-1" />
          <p className="font-bold text-slate-800 text-sm">87%</p>
          <p className="text-xs text-slate-400">Humidity</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className={isHighRisk ? "text-red-500" : "text-orange-500"} />
            <span className="text-xs font-semibold text-slate-600">Flood Risk</span>
          </div>
          <span className={`text-sm font-bold ${isHighRisk ? "text-red-600" : "text-orange-500"}`}>{floodRisk}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${isHighRisk ? "bg-red-500" : "bg-orange-400"}`}
            style={{ width: `${floodRisk}%` }}
          />
        </div>
        {phase !== "IDLE" && (
          <p className="text-xs text-red-600 mt-2 font-medium">
            Flood risk increased from 34% → 71% due to forecast rainfall.
          </p>
        )}
      </div>
    </div>
  );
}
