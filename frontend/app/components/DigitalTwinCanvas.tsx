"use client";
import { useRef, useEffect, useState } from "react";

type LayerKey = "power" | "water" | "traffic" | "shelters";

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  type: "power" | "water" | "transit" | "hospital" | "shelter" | "dispatch";
  status: "normal" | "warning" | "critical" | "backup";
  load?: number;
  capacity?: string;
}

interface Edge {
  from: string;
  to: string;
  layer: LayerKey;
  animated?: boolean;
}

const NODE_COLOR: Record<Node["type"], string> = {
  power: "#f97316",
  water: "#0ea5e9",
  transit: "#a78bfa",
  hospital: "#10b981",
  shelter: "#8b5cf6",
  dispatch: "#ef4444",
};

const STATUS_RING: Record<Node["status"], string> = {
  normal: "rgba(16,185,129,0.35)",
  warning: "rgba(249,115,22,0.45)",
  critical: "rgba(239,68,68,0.6)",
  backup: "rgba(14,165,233,0.4)",
};

interface CanvasProps {
  phase: string;
  layers: Record<LayerKey, boolean>;
  onSelectNode: (node: Node | null) => void;
}

const NODES: Node[] = [
  { id: "wm1", x: 0.28, y: 0.28, label: "Water Main Valve #01", type: "water", status: "normal", load: 42 },
  { id: "wv1", x: 0.45, y: 0.38, label: "Water Valve 5th Ave", type: "water", status: "normal", load: 35 },
  { id: "ps1", x: 0.18, y: 0.52, label: "Power Substation Alpha", type: "power", status: "normal", load: 78 },
  { id: "h1",  x: 0.70, y: 0.26, label: "Memorial City Hospital", type: "hospital", status: "normal", load: 68, capacity: "240 beds" },
  { id: "tr1", x: 0.52, y: 0.62, label: "Central Transit Hub", type: "transit", status: "normal", load: 91 },
  { id: "sh1", x: 0.28, y: 0.72, label: "Central High School (Shelter)", type: "shelter", status: "normal", capacity: "850 Citizens" },
  { id: "dp1", x: 0.77, y: 0.65, label: "Emergency Dispatch Depot #4", type: "dispatch", status: "normal", load: 55 },
];

const EDGES: Edge[] = [
  { from: "wm1", to: "wv1", layer: "water" },
  { from: "wm1", to: "ps1", layer: "power" },
  { from: "wv1", to: "h1",  layer: "water" },
  { from: "ps1", to: "tr1", layer: "power" },
  { from: "tr1", to: "h1",  layer: "traffic" },
  { from: "tr1", to: "dp1", layer: "traffic" },
  { from: "sh1", to: "tr1", layer: "shelters" },
  { from: "ps1", to: "sh1", layer: "power" },
];

const LAYER_COLORS: Record<LayerKey, string> = {
  power: "#f97316",
  water: "#0ea5e9",
  traffic: "#a78bfa",
  shelters: "#10b981",
};

export default function DigitalTwinCanvas({ phase, layers, onSelectNode }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const pulseRef = useRef(0);
  const flowRef = useRef(0);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const isIncident = !["IDLE", "UPLOAD_MODAL", "ANALYZING_IMAGE"].includes(phase);
  const isCascade = ["CASCADE_IDENTIFIED", "ACTIVATING_RESPONSE", "RESOLVED"].includes(phase);
  const isBackup = ["ACTIVATING_RESPONSE", "RESOLVED"].includes(phase);

  // Get effective node statuses based on phase
  const getNodeStatus = (node: Node): Node["status"] => {
    if (node.id === "tr1" && isIncident) return "critical";
    if ((node.id === "h1" || node.id === "dp1") && isCascade) return "warning";
    if (node.id === "sh1" && isBackup) return "backup";
    return node.status;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      pulseRef.current += 0.04;
      flowRef.current += 0.015;

      // Light background
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, W, H);

      // Subtle dot-grid
      ctx.fillStyle = "rgba(148,163,184,0.4)";
      const gridSize = 28;
      for (let x = 0; x < W; x += gridSize) {
        for (let y = 0; y < H; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw edges
      EDGES.forEach((edge) => {
        if (!layers[edge.layer]) return;
        const from = NODES.find(n => n.id === edge.from)!;
        const to = NODES.find(n => n.id === edge.to)!;
        const fx = from.x * W, fy = from.y * H;
        const tx = to.x * W, ty = to.y * H;
        const color = LAYER_COLORS[edge.layer];

        // Edge line
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = color;
        ctx.lineWidth = edge.from === "tr1" || edge.to === "tr1" ? (isIncident ? 1 : 2) : 2;
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Animated flow dots
        const numDots = 4;
        for (let i = 0; i < numDots; i++) {
          const t = ((flowRef.current + i / numDots) % 1);
          const dx = fx + (tx - fx) * t;
          const dy = fy + (ty - fy) * t;
          ctx.beginPath();
          ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = isBackup && (edge.from === "sh1" || edge.to === "sh1") ? "#0ea5e9" : color;
          ctx.globalAlpha = 0.9;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      });

      // Incident ripple effect on transit hub
      if (isIncident) {
        const node = NODES.find(n => n.id === "tr1")!;
        const nx = node.x * W, ny = node.y * H;
        for (let r = 0; r < 3; r++) {
          const radius = ((pulseRef.current * 0.5 + r * 0.33) % 1) * 80 + 20;
          const alpha = 1 - radius / 100;
          ctx.beginPath();
          ctx.arc(nx, ny, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(239,68,68,${alpha * 0.5})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // Draw nodes
      NODES.forEach((node) => {
        const nx = node.x * W;
        const ny = node.y * H;
        const status = getNodeStatus(node);
        const color = NODE_COLOR[node.type];
        const isHovered = hoveredNode === node.id;
        const r = isHovered ? 14 : 11;

        // Outer glow
        const grd = ctx.createRadialGradient(nx, ny, 0, nx, ny, r * 2.5);
        grd.addColorStop(0, STATUS_RING[status]);
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(nx, ny, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Pulse ring for critical/warning
        if (status === "critical" || status === "warning") {
          const pr = r + 6 + Math.sin(pulseRef.current * 3) * 4;
          ctx.beginPath();
          ctx.arc(nx, ny, pr, 0, Math.PI * 2);
          ctx.strokeStyle = status === "critical" ? "rgba(239,68,68,0.7)" : "rgba(249,115,22,0.7)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(nx, ny, r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label
        ctx.font = "bold 11px 'Inter', sans-serif";
        ctx.fillStyle = "#1e293b"; // Dark slate for light theme
        ctx.textAlign = "center";
        ctx.fillText(node.label, nx, ny + r + 15);
      });

      animRef.current = requestAnimationFrame(draw);
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [phase, layers, hoveredNode]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    const hit = NODES.find(n => Math.hypot(n.x - mx, n.y - my) < 0.05);
    setHoveredNode(hit?.id ?? null);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    const hit = NODES.find(n => Math.hypot(n.x - mx, n.y - my) < 0.05);
    onSelectNode(hit ? { ...hit, status: getNodeStatus(hit) } : null);
  };

  return (
    <div className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      />
    </div>
  );
}
