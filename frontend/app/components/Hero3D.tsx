"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, Box, Cylinder } from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

// --------------------------------------------------------
// CINEMATIC CAMERA
// --------------------------------------------------------
function CinematicCamera() {
  useFrame((state) => {
    // Subtle, slow drone-like movement
    const t = state.clock.elapsedTime * 0.05;
    const x = 11 + Math.sin(t) * 2;
    const z = 12 + Math.cos(t) * 2;
    const y = 8 + Math.sin(t * 0.5) * 0.5;
    
    // Smooth interpolation for premium feel
    state.camera.position.lerp(new THREE.Vector3(x, y, z), 0.05);
    state.camera.lookAt(0, 1.5, 0);
  });
  return null;
}

// --------------------------------------------------------
// PREMIUM ARCHITECTURAL BUILDINGS
// --------------------------------------------------------
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: "#0f172a",
  metalness: 0.9,
  roughness: 0.1,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,
  envMapIntensity: 1.5,
});

const concreteMaterial = new THREE.MeshStandardMaterial({
  color: "#94a3b8",
  roughness: 0.8,
  metalness: 0.2,
});

const darkMetalMaterial = new THREE.MeshStandardMaterial({
  color: "#334155",
  roughness: 0.5,
  metalness: 0.7,
});

function GlassTower({ position, scale, height }: any) {
  return (
    <group position={position}>
      {/* Physical Glass Core */}
      <Box args={[scale, height, scale]} position={[0, height / 2, 0]} castShadow receiveShadow material={glassMaterial} />
      
      {/* Structural Concrete Fins */}
      <Box args={[scale * 1.05, height, scale * 0.1]} position={[0, height / 2, 0]} castShadow receiveShadow material={concreteMaterial} />
      <Box args={[scale * 0.1, height, scale * 1.05]} position={[0, height / 2, 0]} castShadow receiveShadow material={concreteMaterial} />
      
      {/* Roof Parapet */}
      <Box args={[scale * 0.7, 0.2, scale * 0.7]} position={[0, height + 0.1, 0]} castShadow material={darkMetalMaterial} />
    </group>
  );
}

function ModernCorporate({ position, scale, height }: any) {
  return (
    <group position={position}>
      {/* Base */}
      <Box args={[scale, height * 0.3, scale]} position={[0, height * 0.15, 0]} castShadow receiveShadow material={concreteMaterial} />
      {/* Middle Glass Tier */}
      <Box args={[scale * 0.9, height * 0.4, scale * 0.9]} position={[0, height * 0.5, 0]} castShadow receiveShadow material={glassMaterial} />
      {/* Top Setback */}
      <Box args={[scale * 0.7, height * 0.3, scale * 0.7]} position={[0, height * 0.85, 0]} castShadow receiveShadow material={concreteMaterial} />
      {/* Structural Bands */}
      <Box args={[scale * 0.92, 0.1, scale * 0.92]} position={[0, height * 0.3, 0]} castShadow material={darkMetalMaterial} />
      <Box args={[scale * 0.72, 0.1, scale * 0.72]} position={[0, height * 0.7, 0]} castShadow material={darkMetalMaterial} />
    </group>
  );
}

function CriticalFacility({ position, scale, height }: any) {
  return (
    <group position={position}>
      {/* Heavy armored core */}
      <Box args={[scale, height, scale]} position={[0, height / 2, 0]} castShadow receiveShadow material={darkMetalMaterial} />
      
      {/* Recessed glass sections */}
      <Box args={[scale * 1.02, height * 0.2, scale * 0.8]} position={[0, height * 0.4, 0]} material={glassMaterial} />
      <Box args={[scale * 0.8, height * 0.2, scale * 1.02]} position={[0, height * 0.4, 0]} material={glassMaterial} />
      
      {/* Rooftop Comms Array */}
      <Cylinder args={[scale * 0.3, scale * 0.3, 0.2, 16]} position={[0, height + 0.1, 0]} castShadow material={concreteMaterial} />
    </group>
  );
}

// --------------------------------------------------------
// CITY SURFACE & INFRASTRUCTURE (8s Animation Loop)
// --------------------------------------------------------
function CityInfrastructure() {
  const primaryRef = useRef<THREE.MeshStandardMaterial>(null);
  const backupRef = useRef<THREE.MeshStandardMaterial>(null);
  const nodeRef = useRef<THREE.MeshStandardMaterial>(null);
  const dataPulseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime % 8;
    
    // Core animation states
    const cBlue = new THREE.Color("#0ea5e9");
    const cOrange = new THREE.Color("#f97316");
    const cRed = new THREE.Color("#ef4444");
    const cDead = new THREE.Color("#1e293b");

    let pColor = cBlue.clone();
    let bColor = cDead.clone();
    let nColor = cBlue.clone();
    let pulseOpacity = 0;
    let pulseZ = 0;

    if (t < 2) {
      // Normal Operation
      pColor = cBlue;
      nColor = cBlue;
    } else if (t >= 2 && t < 3.5) {
      // Warning -> Failure (Smooth transition, no flickering)
      const progress = (t - 2) / 1.5;
      pColor = cOrange.clone().lerp(cRed, progress);
      nColor = cOrange.clone().lerp(cRed, progress);
    } else if (t >= 3.5 && t < 6) {
      // Cascade Detected -> Rerouting
      pColor = cDead;
      nColor = cRed; // Node stays broken
      bColor = cBlue;
      
      // Animate data pulsing through backup route
      pulseOpacity = 1;
      const progress = (t - 3.5) / 2.5; // 0 to 1
      pulseZ = THREE.MathUtils.lerp(3, -1, progress); // Moves along backup path
    } else {
      // Stable Backup Operation
      pColor = cDead;
      nColor = cRed;
      bColor = cBlue;
    }

    if (primaryRef.current) {
      primaryRef.current.color = pColor;
      primaryRef.current.emissive = pColor;
      primaryRef.current.emissiveIntensity = pColor === cDead ? 0 : 2;
    }
    if (backupRef.current) {
      backupRef.current.color = bColor;
      backupRef.current.emissive = bColor;
      backupRef.current.emissiveIntensity = bColor === cDead ? 0 : 2;
    }
    if (nodeRef.current) {
      nodeRef.current.color = nColor;
      nodeRef.current.emissive = nColor;
      nodeRef.current.emissiveIntensity = 2;
    }
    if (dataPulseRef.current) {
      dataPulseRef.current.position.z = pulseZ;
      (dataPulseRef.current.material as THREE.MeshStandardMaterial).opacity = pulseOpacity;
    }
  });

  return (
    <group>
      {/* Base Roads (Compact Diorama) */}
      <Box args={[20, 0.05, 20]} position={[0, -0.025, 0]} receiveShadow>
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </Box>
      
      {/* City Blocks / Sidewalks */}
      <Box args={[6, 0.1, 8]} position={[-4, 0.05, -2]} receiveShadow material={concreteMaterial} />
      <Box args={[8, 0.1, 6]} position={[4, 0.05, 3]} receiveShadow material={concreteMaterial} />
      <Box args={[6, 0.1, 6]} position={[-4, 0.05, 6]} receiveShadow material={concreteMaterial} />
      <Box args={[8, 0.1, 8]} position={[4, 0.05, -5]} receiveShadow material={concreteMaterial} />
      
      {/* Recessed Utility Conduits (flush with road) */}
      {/* Primary Route */}
      <Box args={[8, 0.06, 0.2]} position={[-2, 0.03, 1]}>
        <meshStandardMaterial ref={primaryRef} />
      </Box>
      <Box args={[0.2, 0.06, 2]} position={[2, 0.03, 2]}>
        <meshStandardMaterial ref={primaryRef} />
      </Box>

      {/* Backup Route */}
      <Box args={[8, 0.06, 0.2]} position={[-2, 0.03, -1]}>
        <meshStandardMaterial ref={backupRef} />
      </Box>
      <Box args={[0.2, 0.06, 3]} position={[2, 0.03, 0.5]}>
        <meshStandardMaterial ref={backupRef} />
      </Box>

      {/* Rerouting Data Pulse */}
      <Box ref={dataPulseRef} args={[0.4, 0.08, 0.4]} position={[2, 0.04, 3]}>
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={4} transparent />
      </Box>

      {/* Critical Intersection Nodes */}
      <Cylinder args={[0.4, 0.4, 0.08, 32]} position={[-4, 0.04, 1]}>
        <meshStandardMaterial ref={nodeRef} />
      </Cylinder>
      <Cylinder args={[0.4, 0.4, 0.08, 32]} position={[2, 0.04, -1]}>
        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={2} />
      </Cylinder>
    </group>
  );
}

// --------------------------------------------------------
// SCENE ASSEMBLY
// --------------------------------------------------------
function CityScene() {
  return (
    <group>
      {/* Integrated Infrastructure Environment */}
      <CityInfrastructure />
      
      {/* Buildings positioned on sidewalks */}
      <CriticalFacility position={[2, 0.1, 2]} scale={1.8} height={3.5} />
      
      <GlassTower position={[-4, 0.1, -2]} scale={1.5} height={6} />
      <ModernCorporate position={[-3, 0.1, -5]} scale={1.2} height={4} />
      
      <GlassTower position={[4, 0.1, -4]} scale={1.6} height={7} />
      <ModernCorporate position={[6, 0.1, -6]} scale={1.4} height={5.5} />
      
      <GlassTower position={[-5, 0.1, 5]} scale={1.3} height={4.5} />
      <ModernCorporate position={[-3, 0.1, 7]} scale={1.1} height={3.5} />
    </group>
  );
}

// --------------------------------------------------------
// CANVAS SETUP
// --------------------------------------------------------
export default function Hero3D() {
  return (
    <div className="w-full h-full min-h-[400px] lg:min-h-[500px] relative flex items-center justify-center">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        
        {/* Cinematic Camera */}
        <CinematicCamera />
        
        {/* Atmospheric Perspective (Transparent Background) */}
        {/* We rely on the DOM background for a 100% perfect color match */}
        
        {/* Realistic Lighting & Reflections */}
        <ambientLight intensity={0.4} color="#f8fafc" />
        <directionalLight 
          position={[15, 20, 10]} 
          intensity={1.5} 
          color="#f1f5f9"
          castShadow 
          shadow-mapSize={[2048, 2048]} 
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-15, 10, -10]} intensity={0.5} color="#bae6fd" />
        
        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>

        {/* Ambient Occlusion / Contact Shadows */}
        <ContactShadows frames={1} resolution={2048} scale={30} blur={1.5} opacity={0.6} far={10} color="#000000" />

        {/* Core Scene */}
        <CityScene />

        {/* High-End Postprocessing */}
        {/* @ts-ignore - The react-three/postprocessing typings are slightly mismatched with the library version */}
      <EffectComposer disableNormalPass multisampling={8}>
          <Bloom luminanceThreshold={0.8} mipmapBlur intensity={0.6} />
        </EffectComposer>
        
      </Canvas>
    </div>
  );
}
