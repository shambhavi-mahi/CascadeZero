// Shared types for the CascadeZero dashboard

export type WorkflowPhase =
  | "IDLE"
  | "UPLOAD_MODAL"
  | "ANALYZING_IMAGE"
  | "INCIDENT_DETECTED"
  | "PREDICTING_CASCADE"
  | "CASCADE_IDENTIFIED"
  | "ACTIVATING_RESPONSE"
  | "RESOLVED";

export interface TimelineEvent {
  time: string;
  title: string;
  subtitle: string;
  type: "info" | "warning" | "critical" | "success";
}

export interface CascadeNode {
  id: string;
  name: string;
  type: "road" | "junction" | "hospital" | "power" | "water" | "emergency";
  status: "stable" | "at_risk" | "critical" | "backup";
  eta?: string; // e.g. "+15 min"
}

export interface Route {
  id: string;
  name: string;
  distance: string;
  risk: "LOW" | "MEDIUM" | "HIGH";
  score: number;
  recommended?: boolean;
}

export interface Resource {
  id: string;
  name: string;
  type: "generator" | "ambulance" | "water_tanker" | "team";
  assignedTo: string;
}
