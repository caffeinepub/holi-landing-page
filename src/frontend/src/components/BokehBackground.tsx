interface BokehBackgroundProps {
  visible: boolean;
}

export function BokehBackground({ visible }: BokehBackgroundProps) {
  return (
    <div
      data-ocid="holi.bokeh_panel"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 5,
        pointerEvents: "none",
      }}
    >
      {/* Bokeh image layer */}
      <div
        style={{
          position: "absolute",
          inset: "-5%",
          opacity: visible ? 1 : 0,
          transition: "opacity 1.5s ease-in-out",
          animation: visible ? "bokehFloat 20s ease-in-out infinite" : "none",
          backgroundImage:
            "url('/assets/generated/holi-bokeh-bg.dim_1920x1080.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transformOrigin: "center center",
        }}
      />

      {/* Cinematic vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(8, 2, 20, 0.45) 70%, rgba(4, 0, 14, 0.75) 100%)",
          opacity: visible ? 1 : 0,
          transition: "opacity 2s ease-in-out 0.5s",
        }}
      />

      {/* Subtle top/bottom cinematic bars */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "80px",
          background:
            "linear-gradient(to bottom, rgba(4, 0, 14, 0.4), transparent)",
          opacity: visible ? 1 : 0,
          transition: "opacity 2s ease-in-out 0.8s",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "80px",
          background:
            "linear-gradient(to top, rgba(4, 0, 14, 0.4), transparent)",
          opacity: visible ? 1 : 0,
          transition: "opacity 2s ease-in-out 0.8s",
        }}
      />
    </div>
  );
}
