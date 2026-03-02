import { Suspense, useEffect, useRef, useState } from "react";
import { BokehBackground } from "./components/BokehBackground";
import { ColorPowder } from "./components/ColorPowder";
import { Droplets } from "./components/Droplets";
import { GreetingText } from "./components/GreetingText";
import { SplashCanvas } from "./components/SplashCanvas";

type Phase = "idle" | "splash" | "droplets" | "text" | "bokeh";

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 768,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

export default function App() {
  const [phase, setPhase] = useState<Phase>("idle");
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isMobile = useIsMobile();

  // Orchestrate the phase state machine
  useEffect(() => {
    const timers = timerRefs.current;

    // Phase 1 → 2: Start splash at 0.5s
    timers.push(setTimeout(() => setPhase("splash"), 500));

    // Phase 2 → 3: Add droplets at 2.5s (overlapping with splash)
    timers.push(setTimeout(() => setPhase("droplets"), 2500));

    // Phase 3 → 4: Show greeting text at 4s
    timers.push(setTimeout(() => setPhase("text"), 4000));

    // Phase 4 → 5: Transition to bokeh at 5.5s
    timers.push(setTimeout(() => setPhase("bokeh"), 5500));

    return () => {
      for (const t of timers) clearTimeout(t);
    };
  }, []);

  const showSplash =
    phase === "splash" || phase === "droplets" || phase === "text";
  const splashOpacity = phase === "text" || phase === "bokeh" ? 0 : 1;
  const showDroplets =
    phase === "droplets" || phase === "text" || phase === "bokeh";
  const showText = phase === "text" || phase === "bokeh";
  const showBokeh = phase === "bokeh";

  return (
    <div
      data-ocid="holi.page"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#faf9f6",
        fontFamily: '"General Sans", system-ui, sans-serif',
      }}
    >
      {/* Off-white base layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#faf9f6",
          zIndex: 0,
        }}
      />

      {/* Phase 5: Bokeh background */}
      <BokehBackground visible={showBokeh} />

      {/* Holi color powder orbs — start soft on splash, full on bokeh */}
      <ColorPowder
        visible={phase !== "idle"}
        intensity={showBokeh ? "full" : "soft"}
      />

      {/* Phase 2: 3D Water Splash */}
      {showSplash && (
        <Suspense fallback={null}>
          <SplashCanvas opacity={splashOpacity} isMobile={isMobile} />
        </Suspense>
      )}

      {/* Phase 3: CSS Water Droplets */}
      <Droplets visible={showDroplets} />

      {/* Phase 4: Greeting Text */}
      <GreetingText visible={showText} hasBokeh={showBokeh} />

      {/* Idle: subtle center glow hint */}
      {phase === "idle" && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "2px",
            height: "2px",
            borderRadius: "50%",
            background: "rgba(75, 0, 130, 0.15)",
            boxShadow:
              "0 0 80px 40px rgba(208, 0, 111, 0.08), 0 0 160px 80px rgba(75, 0, 130, 0.05)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Footer */}
      <footer
        style={{
          position: "absolute",
          bottom: "1.5rem",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 40,
          opacity: showBokeh ? 1 : 0,
          transition: "opacity 1.5s ease-in-out 1s",
          pointerEvents: showBokeh ? "auto" : "none",
        }}
      >
        <p
          style={{
            fontFamily: '"General Sans", system-ui, sans-serif',
            fontSize: "0.72rem",
            fontWeight: 400,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: "0.35rem",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.45)" }}>made by </span>
          <span
            style={{
              background:
                "linear-gradient(90deg, #2dd4bf, #facc15, #f472b6, #818cf8, #2dd4bf)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "gradientShift 4s linear infinite",
              fontWeight: 600,
              letterSpacing: "0.18em",
            }}
          >
            PRINCE VERMA
          </span>
        </p>
        <style>{`
          @keyframes gradientShift {
            0% { background-position: 0% center; }
            100% { background-position: 200% center; }
          }
        `}</style>
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
            typeof window !== "undefined" ? window.location.hostname : "",
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: '"General Sans", system-ui, sans-serif',
            fontSize: "0.78rem",
            fontWeight: 300,
            letterSpacing: "0.05em",
            color: "rgba(255, 255, 255, 0.45)",
            textDecoration: "none",
          }}
        >
          © {new Date().getFullYear()} · Built with ♥ using caffeine.ai
        </a>
      </footer>
    </div>
  );
}
