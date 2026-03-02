import { useMemo } from "react";

// Full Holi powder color palette
const POWDER_COLORS = [
  "#FF4500", // vermillion red
  "#FF6B00", // deep orange
  "#FFD700", // gold yellow
  "#00C853", // vivid green
  "#00BFA5", // teal
  "#0091EA", // sky blue
  "#D500F9", // electric purple
  "#FF4081", // hot pink
  "#FF1744", // bright red
  "#FFEA00", // bright yellow
  "#76FF03", // lime green
  "#00E5FF", // cyan
  "#E040FB", // orchid
  "#FF6D00", // amber orange
  "#F50057", // crimson
];

interface PowderParticle {
  id: number;
  left: string;
  top: string;
  size: number;
  color: string;
  duration: string;
  delay: string;
  driftX: number;
  driftY: number;
  rotation: number;
  blur: number;
  opacity: number;
  shape: "circle" | "ellipse" | "blob";
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function generatePowderParticles(count: number): PowderParticle[] {
  return Array.from({ length: count }, (_, i) => {
    const r = (n: number) => seededRandom(i * 17 + n);
    const size = 20 + r(1) * 80;
    const shapes: PowderParticle["shape"][] = ["circle", "ellipse", "blob"];
    return {
      id: i,
      left: `${r(2) * 100}%`,
      top: `${r(3) * 100}%`,
      size,
      color: POWDER_COLORS[Math.floor(r(4) * POWDER_COLORS.length)],
      duration: `${6 + r(5) * 10}s`,
      delay: `${r(6) * 8}s`,
      driftX: -40 + r(7) * 80,
      driftY: -40 + r(8) * 80,
      rotation: r(9) * 360,
      blur: 12 + r(10) * 28,
      opacity: 0.15 + r(11) * 0.3,
      shape: shapes[Math.floor(r(12) * shapes.length)],
    };
  });
}

interface ColorPowderProps {
  visible: boolean;
  intensity?: "soft" | "full";
}

export function ColorPowder({ visible, intensity = "full" }: ColorPowderProps) {
  const count = intensity === "full" ? 30 : 15;
  const particles = useMemo(() => generatePowderParticles(count), [count]);

  return (
    <div
      data-ocid="holi.powder_panel"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 4,
        pointerEvents: "none",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transition: "opacity 1.5s ease-in-out",
      }}
    >
      {particles.map((p) => {
        const borderRadius =
          p.shape === "circle"
            ? "50%"
            : p.shape === "ellipse"
              ? "50% 50% 50% 50% / 30% 70% 30% 70%"
              : "60% 40% 70% 30% / 40% 60% 40% 60%";

        return (
          <div
            key={p.id}
            className="powder-orb"
            style={
              {
                position: "absolute",
                left: p.left,
                top: p.top,
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius,
                background: p.color,
                filter: `blur(${p.blur}px)`,
                opacity: p.opacity,
                "--drift-x": `${p.driftX}px`,
                "--drift-y": `${p.driftY}px`,
                "--powder-rotation": `${p.rotation}deg`,
                animationDuration: p.duration,
                animationDelay: p.delay,
                animationFillMode: "both",
                animationIterationCount: "infinite",
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
