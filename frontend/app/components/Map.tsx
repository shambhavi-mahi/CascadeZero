"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons in Next.js
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

export default function Map({ infrastructure }: { infrastructure: any }) {
  if (typeof window === "undefined") {
    return <div>Loading map...</div>;
  }

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden border border-slate-200 shadow-sm relative z-0">
      <MapContainer
        center={[16.51, 80.64]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {infrastructure?.hospitals?.map((h: any) => (
          <Marker key={h.id} position={[h.latitude, h.longitude]}>
            <Popup>
              <strong>{h.name}</strong><br />
              Type: {h.type}<br />
              Priority: {h.priority}
            </Popup>
          </Marker>
        ))}

        {infrastructure?.power_nodes?.map((p: any) => (
          <Marker key={p.id} position={[p.latitude, p.longitude]}>
            <Popup>
              <strong>{p.name}</strong><br />
              Type: {p.type}<br />
              Priority: {p.priority}
            </Popup>
          </Marker>
        ))}

        {infrastructure?.water_plants?.map((w: any) => (
          <Marker key={w.id} position={[w.latitude, w.longitude]}>
            <Popup>
              <strong>{w.name}</strong><br />
              Type: {w.type}<br />
              Priority: {w.priority}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
