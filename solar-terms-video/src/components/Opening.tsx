import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
} from "remotion";

export const Opening: React.FC = () => {
  const frame = useCurrentFrame();

  // Title spring animation
  const titleSpringValue = spring({
    frame,
    fps: 30,
    config: {
      damping: 10,
      stiffness: 100,
    },
  });

  // Emoji bounce animation
  const emojiSpringValue = spring({
    frame,
    fps: 30,
    config: {
      damping: 8,
      stiffness: 80,
    },
  });

  // Interpolate spring values to get animated properties
  const titleScale = interpolate(titleSpringValue, [0, 1], [0.5, 1]);
  const titleOpacity = interpolate(titleSpringValue, [0, 1], [0, 1]);
  const emojiTranslateY = interpolate(emojiSpringValue, [0, 1], [-30, 0]);
  const emojiScale = interpolate(emojiSpringValue, [0, 1], [0.5, 1]);

  // Subtitle fade in
  const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          top: -50,
          left: -50,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          bottom: -30,
          right: -30,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          top: "30%",
          right: "10%",
        }}
      />

      {/* Main title */}
      <div
        style={{
          transform: `scale(${titleScale})`,
          opacity: titleOpacity,
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: "bold",
            color: "#fff",
            textShadow: "4px 4px 8px rgba(0,0,0,0.2)",
            letterSpacing: 8,
          }}
        >
          二十四
        </div>
        <div
          style={{
            fontSize: 120,
            fontWeight: "bold",
            color: "#fff",
            textShadow: "4px 4px 8px rgba(0,0,0,0.2)",
            letterSpacing: 8,
          }}
        >
          节气
        </div>
      </div>

      {/* Emoji decoration */}
      <div
        style={{
          transform: `translateY(${emojiTranslateY}px) scale(${emojiScale})`,
          marginTop: 20,
        }}
      >
        <div style={{ fontSize: 80 }}>
          <span style={{ marginRight: 20 }}>🌸</span>
          <span style={{ marginRight: 20 }}>☀️</span>
          <span style={{ marginRight: 20 }}>🍂</span>
          <span>❄️</span>
        </div>
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: 150,
          fontSize: 36,
          color: "rgba(255,255,255,0.9)",
          fontWeight: "bold",
          opacity: subtitleOpacity,
        }}
      >
        让我们一起认识中国的二十四节气吧！
      </div>
    </AbsoluteFill>
  );
};
