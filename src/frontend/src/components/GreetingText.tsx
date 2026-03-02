interface GreetingTextProps {
  visible: boolean;
  hasBokeh: boolean;
}

export function GreetingText({ visible, hasBokeh }: GreetingTextProps) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 30,
        pointerEvents: "none",
        padding: "0 1.5rem",
      }}
    >
      {/* Glass backdrop — only shows when bokeh is active */}
      <div
        style={{
          position: "relative",
          textAlign: "center",
          padding: hasBokeh ? "3.5rem 5rem 3rem" : "0",
          borderRadius: hasBokeh ? "2rem" : "0",
          transition: "all 1s ease",
          ...(hasBokeh
            ? {
                background: "rgba(250, 249, 246, 0.10)",
                backdropFilter: "blur(24px) saturate(160%)",
                WebkitBackdropFilter: "blur(24px) saturate(160%)",
                border: "1px solid rgba(255, 255, 255, 0.16)",
                boxShadow:
                  "0 8px 48px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.1)",
              }
            : {}),
        }}
      >
        {/* Main heading */}
        <h1
          data-ocid="holi.greeting_text"
          className="gradient-text"
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: "clamp(3.5rem, 10vw, 9rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            margin: 0,
            opacity: visible ? 1 : 0,
            transform: visible
              ? "translateY(0) scale(1)"
              : "translateY(12px) scale(0.92)",
            transition: "opacity 1.2s ease-out, transform 1.2s ease-out",
            transitionDelay: visible ? "0s" : "0s",
            // Fallback for browsers without background-clip support
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Happy Holi
        </h1>

        {/* Decorative divider */}
        <div
          style={{
            width: visible ? "180px" : "0px",
            height: "2px",
            background: "linear-gradient(90deg, #00bfa5, #ffd700, #ff6b9d)",
            margin: "1.2rem auto",
            borderRadius: "999px",
            transition: "width 1s ease-out 0.6s",
            opacity: visible ? 1 : 0,
          }}
        />

        {/* Subtitle */}
        <p
          data-ocid="holi.subtitle"
          style={{
            fontFamily: '"General Sans", system-ui, sans-serif',
            fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
            fontWeight: 300,
            letterSpacing: "0.08em",
            margin: 0,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 1s ease-out 0.5s, transform 1s ease-out 0.5s",
            // Gradient for subtitle too
            background:
              "linear-gradient(90deg, #00bfa5 0%, #ffd700 50%, #ff6b9d 100%)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: visible ? "gradientShift 6s ease infinite 0.5s" : "none",
          }}
        >
          May your world burst into colour.
        </p>
      </div>
    </div>
  );
}
