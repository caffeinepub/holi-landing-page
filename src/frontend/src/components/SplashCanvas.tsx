import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// Particle count constants
const PARTICLE_COUNT_DESKTOP = 750;
const PARTICLE_COUNT_MOBILE = 380;

// Ease-out cubic function
function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

// Ease-out quint for even more dramatic slow-motion feel
function easeOutQuint(t: number): number {
  return 1 - (1 - t) ** 5;
}

interface ParticleSystemProps {
  isMobile: boolean;
}

function ParticleSystem({ isMobile }: ParticleSystemProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const progressRef = useRef(0);

  const particleCount = isMobile
    ? PARTICLE_COUNT_MOBILE
    : PARTICLE_COUNT_DESKTOP;

  // Build particle data once
  const particles = useMemo(() => {
    const colors = [
      new THREE.Color("#4B0082"), // deep indigo
      new THREE.Color("#D0006F"), // vivid magenta
      new THREE.Color("#7B2D8B"), // purple
      new THREE.Color("#8B00FF"), // electric violet
      new THREE.Color("#C71585"), // medium violet red
      new THREE.Color("#6A0DAD"), // purple
      new THREE.Color("#E91E8C"), // hot pink-magenta
      new THREE.Color("#FF4500"), // vermillion red
      new THREE.Color("#FF6B00"), // deep orange
      new THREE.Color("#FFD700"), // gold yellow
      new THREE.Color("#00C853"), // vivid green
      new THREE.Color("#00BFA5"), // teal
      new THREE.Color("#0091EA"), // sky blue
      new THREE.Color("#FF1744"), // bright red
      new THREE.Color("#76FF03"), // lime green
    ];

    return Array.from({ length: particleCount }, (_, i) => {
      // Spread particles in a hemisphere explosion toward camera
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.65; // upper hemisphere

      const speed = 2.5 + Math.random() * 5.5;
      const zBias = 0.3 + Math.random() * 0.4; // bias toward camera

      const vx = Math.sin(phi) * Math.cos(theta) * speed;
      const vy = Math.sin(phi) * Math.sin(theta) * speed;
      const vz = zBias * speed + Math.random() * 2; // push toward viewer

      // Some particles go sideways/away too
      const vxFinal = vx * (0.4 + Math.random() * 0.6);
      const vyFinal = vy * (0.4 + Math.random() * 0.6);

      const radius = 0.04 + Math.random() * 0.085;
      const colorIndex = i % colors.length;
      const delay = Math.random() * 0.4; // stagger start slightly

      return {
        velocity: new THREE.Vector3(vxFinal, vyFinal, vz),
        radius,
        color: colors[colorIndex],
        delay,
        // Slight scale up as they approach camera
        startScale: 0.3 + Math.random() * 0.4,
        endScale: 0.8 + Math.random() * 1.4,
      };
    });
  }, [particleCount]);

  // Temporary objects for matrix updates
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  // Set initial colors
  const colorArray = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particles[i].color.toArray(arr, i * 3);
    }
    return arr;
  }, [particles, particleCount]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Advance global progress (3.5s animation)
    progressRef.current = Math.min(progressRef.current + delta / 3.5, 1);
    const rawT = progressRef.current;

    for (let i = 0; i < particleCount; i++) {
      const p = particles[i];

      // Each particle has a small delay
      const localT = Math.max(0, (rawT - p.delay * 0.3) / (1 - p.delay * 0.3));
      const easedT = easeOutQuint(Math.min(localT, 1));

      // Position: move from origin along velocity
      const x = p.velocity.x * easedT;
      const y = p.velocity.y * easedT;
      const z = p.velocity.z * easedT;

      tempObject.position.set(x, y, z);

      // Scale: grows as it approaches camera
      const scale =
        p.radius *
        (p.startScale + (p.endScale - p.startScale) * easeOutCubic(localT));
      tempObject.scale.setScalar(scale);
      tempObject.updateMatrix();

      meshRef.current.setMatrixAt(i, tempObject.matrix);

      // Emissive-like brightness pulse at start
      const emissiveMix = Math.max(0, 1 - localT * 2);
      tempColor.copy(p.color);
      // Lighten at the start for glow effect
      if (emissiveMix > 0) {
        tempColor.lerp(new THREE.Color("#ffffff"), emissiveMix * 0.25);
      }
      tempColor.toArray(colorArray, i * 3);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        vertexColors
        roughness={0.2}
        metalness={0.6}
        emissive="#3d0060"
        emissiveIntensity={0.4}
      />
      <instancedBufferAttribute attach="instanceColor" args={[colorArray, 3]} />
    </instancedMesh>
  );
}

interface SplashCanvasProps {
  opacity: number;
  isMobile: boolean;
}

export function SplashCanvas({ opacity, isMobile }: SplashCanvasProps) {
  return (
    <div
      data-ocid="holi.canvas_target"
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        transition: "opacity 1.2s ease-out",
        zIndex: 10,
        pointerEvents: opacity < 0.01 ? "none" : "auto",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 65 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        {/* Cinematic lighting */}
        <ambientLight intensity={0.6} color="#9944cc" />
        <pointLight
          position={[0, 0, 8]}
          intensity={80}
          color="#ffffff"
          decay={2}
        />
        <pointLight
          position={[3, 3, 4]}
          intensity={40}
          color="#ff44aa"
          decay={2}
        />
        <pointLight
          position={[-3, -2, 4]}
          intensity={40}
          color="#4400ff"
          decay={2}
        />
        <pointLight
          position={[0, -4, 2]}
          intensity={20}
          color="#d0006f"
          decay={2}
        />
        <ParticleSystem isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
