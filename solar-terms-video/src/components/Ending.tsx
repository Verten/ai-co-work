import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
} from "remotion";

export const Ending: React.FC = () => {
  const frame = useCurrentFrame();

  // Spring animations using spring function
  const titleSpringValue = spring({
    frame,
    fps: 30,
    config: {
      damping: 10,
      stiffness: 80,
    },
  });

  const heartSpringValue = spring({
    frame,
    fps: 30,
    config: {
      damping: 8,
      stiffness: 60,
    },
  });

  // Interpolate spring values to get animated properties
  const titleScale = interpolate(titleSpringValue, [0, 1], [0.5, 1]);
  const titleOpacity = interpolate(titleSpringValue, [0, 1], [0, 1]);
  const heartTranslateY = interpolate(heartSpringValue, [0, 1], [30, 0]);
  const heartScale = interpolate(heartSpringValue, [0, 1], [0.5, 1]);
  const heartOpacity = interpolate(heartSpringValue, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Decorative hearts */}
      <div
        style={{
          transform: `translateY(${heartTranslateY}px) scale(${heartScale})`,
          opacity: heartOpacity,
          marginBottom: 30,
        }}
      >
        <div style={{ fontSize: 100 }}>
          <span style={{ marginRight: 30 }}>💖</span>
          <span style={{ marginRight: 30 }}>🌟</span>
          <span>💖</span>
        </div>
      </div>

      {/* Main text */}
      <div
        style={{
          transform: `scale(${titleScale})`,
          opacity: titleOpacity,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: "bold",
            color: "#fff",
            textShadow: "3px 3px 6px rgba(0,0,0,0.2)",
            letterSpacing: 6,
          }}
        >
          再见啦！
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: "bold",
            color: "#fff",
            textShadow: "3px 3px 6px rgba(0,0,0,0.2)",
            letterSpacing: 6,
            marginTop: 10,
          }}
        >
          小朋友们
        </div>
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          fontSize: 32,
          color: "rgba(255,255,255,0.8)",
          fontWeight: 500,
        }}
      >
        记得一年有二十四个节气哦！
      </div>

      {/* Floating circles */}
      <div
        style={{
          position: "absolute",
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          top: "10%",
          right: "20%",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          bottom: "20%",
          left: "10%",
        }}
      />
    </AbsoluteFill>
  );
};
