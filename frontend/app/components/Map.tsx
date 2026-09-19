"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then(mod => mod.Polyline), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then(mod => mod.CircleMarker), { ssr: false });

// Helper to create custom HTML markers
const createCustomIcon = (colorClass: string, isPulsing: boolean = false) => {
  return L.divIcon({
    className: "custom-leaflet-icon",
    html: `<div class="relative w-4 h-4">
             ${isPulsing ? `<div class="absolute inset-0 rounded-full bg-${colorClass}-500 opacity-50 animate-ping"></div>` : ''}
             <div class="absolute inset-0 rounded-full border-2 border-white shadow-md bg-${colorClass}-500"></div>
           </div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

interface MapProps {
  phase: string;
}

export default function Map({ phase }: MapProps) {
  if (typeof window === "undefined") {
    return <div className="h-full w-full bg-slate-900 animate-pulse"></div>;
  }

  // Pre-defined coordinates for our scenario (Road 01 -> Junction 04 -> Route 02)
  const nodes = {
    incident: { pos: [16.51, 80.64], name: "Road 01 (Flooded)" },
    junction: { pos: [16.515, 80.635], name: "Traffic Junction 04" },
    critical: { pos: [16.52, 80.63], name: "Emergency Route 02" },
    backup1: { pos: [16.50, 80.645], name: "Route B" },
    backup2: { pos: [16.52, 80.645], name: "Route B Join" },
    other1: { pos: [16.512, 80.65], name: "Stable Node" },
    other2: { pos: [16.525, 80.635], name: "Stable Node" },
  };

  const isDetected = ["INCIDENT_DETECTED", "PREDICTING_CASCADE", "CASCADE_IDENTIFIED", "ACTIVATING_RESPONSE", "RESOLVED"].includes(phase);
  const isCascade = ["CASCADE_IDENTIFIED", "ACTIVATING_RESPONSE", "RESOLVED"].includes(phase);
  const isBackup = ["ACTIVATING_RESPONSE", "RESOLVED"].includes(phase);

  return (
    <div className="flex-1 h-full w-full relative z-0 bg-slate-900 min-h-0">
      <MapContainer
        center={[16.515, 80.64]}
        zoom={14}
        style={{ height: "100%", width: "100%", background: "#0f172a" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />

        {/* Stable Network Lines */}
        <Polyline positions={[nodes.incident.pos, nodes.other1.pos] as any} color="#334155" weight={2} opacity={0.5} />
        <Polyline positions={[nodes.critical.pos, nodes.other2.pos] as any} color="#334155" weight={2} opacity={0.5} />
        <Polyline positions={[nodes.backup1.pos, nodes.other1.pos] as any} color="#334155" weight={2} opacity={0.5} />

        {/* Primary Route (At Risk / Failing) */}
        {isCascade ? (
          <Polyline positions={[nodes.incident.pos, nodes.junction.pos, nodes.critical.pos] as any} color="#f97316" weight={4} dashArray="5, 10" className="animate-pulse" />
        ) : (
          <Polyline positions={[nodes.incident.pos, nodes.junction.pos, nodes.critical.pos] as any} color="#3b82f6" weight={3} opacity={0.5} />
        )}

        {/* Backup Route */}
        {isBackup && (
          <Polyline positions={[nodes.incident.pos, nodes.backup1.pos, nodes.backup2.pos, nodes.critical.pos] as any} color="#0ea5e9" weight={5} />
        )}

        {/* Nodes */}
        <Marker position={nodes.other1.pos as any} icon={createCustomIcon("slate")} />
        <Marker position={nodes.other2.pos as any} icon={createCustomIcon("slate")} />
        <Marker position={nodes.backup1.pos as any} icon={createCustomIcon(isBackup ? "blue" : "slate")} />
        <Marker position={nodes.backup2.pos as any} icon={createCustomIcon(isBackup ? "blue" : "slate")} />
        
        {/* Incident Node */}
        {isDetected ? (
          <>
            <CircleMarker center={nodes.incident.pos as any} radius={30} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.2, weight: 1 }} />
            <Marker position={nodes.incident.pos as any} icon={createCustomIcon("red", true)}>
              <Popup><strong>INCIDENT</strong><br/>Flooded Road</Popup>
            </Marker>
          </>
        ) : (
          <Marker position={nodes.incident.pos as any} icon={createCustomIcon("green")} />
        )}

        {/* Junction Node */}
        <Marker position={nodes.junction.pos as any} icon={createCustomIcon(isCascade ? "orange" : "green", isCascade)} />
        
        {/* Critical Node */}
        <Marker position={nodes.critical.pos as any} icon={createCustomIcon(isCascade ? "orange" : "green")} />

      </MapContainer>
      
      {/* CSS overrides for Leaflet in dark mode */}
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-container { background: #0f172a !important; }
        .custom-leaflet-icon { background: none; border: none; }
        .map-tiles {
          filter: invert(100%) hue-rotate(180deg) brightness(85%) contrast(110%) saturate(80%);
        }
      `}} />
    </div>
  );
}
