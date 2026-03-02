import { useMemo } from "react";

interface DropletConfig {
  id: number;
  left: string;
  top: string;
  width: number;
  height: number;
  rotation: number;
  color: string;
  opacity: number;
  delay: string;
  blur: string;
}

const DROPLET_COLORS = [
  "rgba(75, 0, 130, 0.82)", // indigo
  "rgba(208, 0, 111, 0.80)", // magenta
  "rgba(123, 45, 139, 0.75)", // purple
  "rgba(180, 0, 100, 0.78)", // deep pink
  "rgba(100, 0, 160, 0.72)", // violet
  "rgba(210, 20, 100, 0.82)", // hot magenta
  "rgba(60, 0, 120, 0.70)", // dark indigo
  "rgba(255, 69, 0, 0.85)", // vermillion red
  "rgba(255, 107, 0, 0.82)", // deep orange
  "rgba(255, 215, 0, 0.88)", // gold yellow
  "rgba(0, 200, 83, 0.78)", // vivid green
  "rgba(0, 191, 165, 0.80)", // teal
  "rgba(0, 145, 234, 0.78)", // sky blue
  "rgba(255, 23, 68, 0.84)", // bright red
  "rgba(118, 255, 3, 0.75)", // lime green
  "rgba(213, 0, 249, 0.80)", // electric purple
  "rgba(255, 64, 129, 0.82)", // hot pink
];

// Deterministic pseudo-random seeded values for SSR-safety & stability
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function generateDroplets(count: number): DropletConfig[] {
  return Array.from({ length: count }, (_, i) => {
    const r1 = seededRandom(i * 7 + 1);
    const r2 = seededRandom(i * 7 + 2);
    const r3 = seededRandom(i * 7 + 3);
    const r4 = seededRandom(i * 7 + 4);
    const r5 = seededRandom(i * 7 + 5);
    const r6 = seededRandom(i * 7 + 6);
    const r7 = seededRandom(i * 7 + 7);

    const width = Math.floor(8 + r1 * 15); // 8–23px
    const height = Math.floor(width * (1.3 + r2 * 0.8)); // aspect ratio

    return {
      id: i,
      left: `${5 + r3 * 90}%`,
      top: `${5 + r4 * 90}%`,
      width,
      height: Math.min(height, 34),
      rotation: -180 + r5 * 360,
      color: DROPLET_COLORS[Math.floor(r6 * DROPLET_COLORS.length)],
      opacity: 0.65 + r7 * 0.3,
      delay: `${1.8 + i * 0.085}s`,
      blur: `${0.8 + r1 * 1.4}px`,
    };
  });
}

interface DropletsProps {
  visible: boolean;
}

export function Droplets({ visible }: DropletsProps) {
  const droplets = useMemo(() => generateDroplets(22), []);

  if (!visible) return null;

  return (
    <>
      {droplets.map((d) => (
        <div
          key={d.id}
          className="droplet"
          style={
            {
              left: d.left,
              top: d.top,
              width: `${d.width}px`,
              height: `${d.height}px`,
              background: d.color,
              "--drop-rotation": `${d.rotation}deg`,
              "--drop-opacity": d.opacity,
              "--drop-delay": d.delay,
              "--drop-blur": d.blur,
              zIndex: 20,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  );
}
