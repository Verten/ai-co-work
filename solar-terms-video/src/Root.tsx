import {
  Composition,
  AbsoluteFill,
  Sequence,
  useVideoConfig,
} from "remotion";
import { Opening } from "./components/Opening";
import { SolarTermCard } from "./components/SolarTermCard";
import { Ending } from "./components/Ending";
import { solarTerms } from "./data/solarTerms";

// Timing calculations (at 30fps)
const FPS = 30;
const OPENING_DURATION = 3; // seconds
const SOLAR_TERM_DURATION = 3.5; // seconds per term
const ENDING_DURATION = 3; // seconds

const TOTAL_DURATION = OPENING_DURATION + solarTerms.length * SOLAR_TERM_DURATION + ENDING_DURATION;

export const Root: React.FC = () => {
  return (
    <Composition
      id="SolarTermsVideo"
      durationInFrames={TOTAL_DURATION * FPS}
      fps={FPS}
      width={1920}
      height={1080}
      component={VideoContent}
    />
  );
};

const VideoContent: React.FC = () => {
  const { fps } = useVideoConfig();
  const openingFrames = OPENING_DURATION * fps;
  const solarTermFrames = Math.floor(SOLAR_TERM_DURATION * fps);
  const endingFrames = ENDING_DURATION * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Opening */}
      <Sequence from={0} durationInFrames={openingFrames}>
        <Opening />
      </Sequence>

      {/* Solar Terms */}
      {solarTerms.map((term, index) => {
        const from = openingFrames + index * solarTermFrames;

        return (
          <Sequence
            key={`solar-term-${index}`}
            from={from}
            durationInFrames={solarTermFrames}
          >
            <SolarTermCard solarTerm={term} index={index} />
          </Sequence>
        );
      })}

      {/* Ending */}
      <Sequence
        from={openingFrames + solarTerms.length * solarTermFrames}
        durationInFrames={endingFrames}
      >
        <Ending />
      </Sequence>
    </AbsoluteFill>
  );
};
