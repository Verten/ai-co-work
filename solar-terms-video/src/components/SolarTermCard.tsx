import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
} from "remotion";
import type { SolarTerm } from "../data/solarTerms";

interface SolarTermCardProps {
  solarTerm: SolarTerm;
  index: number;
}

export const SolarTermCard: React.FC<SolarTermCardProps> = ({
  solarTerm,
  index,
}) => {
  const frame = useCurrentFrame();

  // Emoji spring animation - appears first
  const emojiSpring = spring({
    frame,
    fps: 30,
    config: { damping: 10, stiffness: 100 },
  });

  // Name spring animation - appears second
  const nameSpring = spring({
    frame: Math.max(0, frame - 8),
    fps: 30,
    config: { damping: 12, stiffness: 90 },
  });

  // Description spring animation - appears third
  const descSpring = spring({
    frame: Math.max(0, frame - 18),
    fps: 30,
    config: { damping: 14, stiffness: 80 },
  });

  // Detail spring animation - appears fourth
  const detailSpring = spring({
    frame: Math.max(0, frame - 30),
    fps: 30,
    config: { damping: 12, stiffness: 70 },
  });

  // Fun fact spring animation - appears last
  const funFactSpring = spring({
    frame: Math.max(0, frame - 50),
    fps: 30,
    config: { damping: 15, stiffness: 60 },
  });

  // Interpolate all spring values
  const emojiScale = interpolate(emojiSpring, [0, 1], [0.3, 1]);
  const emojiOpacity = interpolate(emojiSpring, [0, 1], [0, 1]);

  const nameScale = interpolate(nameSpring, [0, 1], [0.5, 1]);
  const nameOpacity = interpolate(nameSpring, [0, 1], [0, 1]);

  const descOpacity = interpolate(descSpring, [0, 1], [0, 1]);
  const descTranslateY = interpolate(descSpring, [0, 1], [20, 0]);

  const detailOpacity = interpolate(detailSpring, [0, 1], [0, 1]);
  const detailTranslateY = interpolate(detailSpring, [0, 1], [15, 0]);

  const funFactOpacity = interpolate(funFactSpring, [0, 1], [0, 1]);
  const funFactTranslateY = interpolate(funFactSpring, [0, 1], [10, 0]);

  // Floating animation for background
  const floatY = interpolate(frame, [0, 45], [0, -15], {
    extrapolateRight: "extend",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${solarTerm.bgGradient[0]} 0%, ${solarTerm.bgGradient[1]} 100%)`,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Season indicator */}
      <div
        style={{
          position: "absolute",
          top: 25,
          right: 40,
          fontSize: 26,
          color: "rgba(255,255,255,0.7)",
          fontWeight: "bold",
        }}
      >
        {solarTerm.season}季
      </div>

      {/* Floating decorative shapes */}
      <div
        style={{
          position: "absolute",
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
          top: "5%",
          left: "-5%",
          transform: `translateY(${floatY})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          bottom: "10%",
          right: "5%",
          transform: `translateY(${-floatY})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          top: "55%",
          left: "8%",
          transform: `translateY(${-floatY * 0.6})`,
        }}
      />

      {/* Emoji - Large and centered at top */}
      <div
        style={{
          transform: `scale(${emojiScale})`,
          opacity: emojiOpacity,
          marginBottom: 15,
        }}
      >
        <div style={{ fontSize: 140 }}>{solarTerm.emoji}</div>
      </div>

      {/* Solar term name */}
      <div
        style={{
          transform: `scale(${nameScale})`,
          opacity: nameOpacity,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontWeight: "bold",
            color: "#fff",
            textShadow: "3px 3px 6px rgba(0,0,0,0.15)",
            letterSpacing: 10,
          }}
        >
          {solarTerm.name}
        </div>
      </div>

      {/* Short description */}
      <div
        style={{
          opacity: descOpacity,
          transform: `translateY(${descTranslateY}px)`,
          marginBottom: 8,
        }}
      >
        <div
          style={{
            fontSize: 42,
            color: "rgba(255,255,255,0.95)",
            fontWeight: 600,
            textShadow: "2px 2px 4px rgba(0,0,0,0.15)",
            letterSpacing: 2,
          }}
        >
          {solarTerm.description}
        </div>
      </div>

      {/* Detail - two line description */}
      <div
        style={{
          opacity: detailOpacity,
          transform: `translateY(${detailTranslateY}px)`,
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        {solarTerm.detail.split("\n").map((line, i) => (
          <div
            key={i}
            style={{
              fontSize: 28,
              color: "rgba(255,255,255,0.85)",
              fontWeight: 500,
              textShadow: "1px 1px 3px rgba(0,0,0,0.1)",
              lineHeight: 1.4,
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Fun fact - highlighted */}
      <div
        style={{
          opacity: funFactOpacity,
          transform: `translateY(${funFactTranslateY}px)`,
          background: "rgba(255,255,255,0.2)",
          borderRadius: 20,
          padding: "8px 24px",
          marginTop: 5,
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: "#fff",
            fontWeight: 600,
            textShadow: "1px 1px 2px rgba(0,0,0,0.15)",
          }}
        >
          💡 {solarTerm.funFact}
        </div>
      </div>

      {/* Index indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 20,
          color: "rgba(255,255,255,0.5)",
          fontWeight: "bold",
        }}
      >
        {index + 1} / 24
      </div>
    </AbsoluteFill>
  );
};
