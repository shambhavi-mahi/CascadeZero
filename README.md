# CascadeZero

**CascadeZero** is an intelligent urban infrastructure resilience platform built for hackathons. It transforms citizen incident reports into actionable city-wide emergency strategies by predicting cascading infrastructure failures in real-time.

![CascadeZero Dashboard](https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200)

## 🌟 The Problem
When urban infrastructure fails (e.g., a flooded road or a broken water main), it doesn't fail in isolation. A flooded road blocks a traffic junction, which delays an emergency corridor, which prevents an ambulance from reaching the ICU. Traditional dashboards only show *where* the incident is. CascadeZero predicts *what happens next*.

## 🚀 Core Features

### 1. Digital Twin Canvas Engine
A highly interactive, HTML Canvas-based telemetry map that visualizes the city's dependency grid. Toggle between Power, Water, Traffic, and Shelter networks to see live data flows and pulsing incident warning rings.

### 2. Predictive Cascade Simulation
Once an incident is verified, our rapid graph-traversal engine maps the fault against the city grid, identifying downstream dependencies and generating an ETA timeline for when connected infrastructure will fail.

### 3. Node Telemetry Inspector
Click on any node in the Digital Twin (e.g., *Memorial City Hospital* or *Power Substation Alpha*) to view live operational load, capacity, uptime, and its current Cascade Rewrite State.

### 4. Emergency Route Optimizer
Calculates the safest intervention paths for emergency responders. Instead of just finding the shortest distance, our routing algorithm calculates a risk score based on congestion, incident proximity, and road accessibility.

### 5. Automated Response Generation
Generates step-by-step contingency plans, such as rerouting traffic and deploying backup generators, ensuring the city stabilizes before a critical collapse.

## 🛠️ Tech Stack

- **Frontend:** Next.js 16, React, TypeScript
- **Styling:** Tailwind CSS, Framer Motion
- **Mapping & Visualization:** React-Leaflet, OpenStreetMap, HTML Canvas API
- **Icons:** Lucide React

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/shambhavi-mahi/CascadeZero.git
   ```
2. Navigate to the frontend directory:
   ```bash
   cd CascadeZero/frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🌐 Live Demo
The platform is deployed live on Vercel at: 
**[https://cascade-zero-6265.vercel.app/](https://cascade-zero-6265.vercel.app/)**

---
*Built for the Hack Devengers 2.0 Hackathon.*
