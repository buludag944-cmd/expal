import { Composition } from "remotion";
import { ExpalVideo } from "./ExpalVideo";
import { JourneyVideo } from "./JourneyVideo";
import {
  JOURNEY_DURATION_IN_FRAMES,
  JOURNEY_FPS,
  JOURNEY_HEIGHT,
  JOURNEY_WIDTH,
} from "./journey-beats";
import {
  SHORT_DURATION_IN_FRAMES,
  SHORT_FPS,
  SHORT_HEIGHT,
  SHORT_WIDTH,
} from "./short-beats";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ExpalShort"
        component={ExpalVideo}
        durationInFrames={SHORT_DURATION_IN_FRAMES}
        fps={SHORT_FPS}
        width={SHORT_WIDTH}
        height={SHORT_HEIGHT}
      />
      <Composition
        id="FounderNotes"
        component={JourneyVideo}
        durationInFrames={JOURNEY_DURATION_IN_FRAMES}
        fps={JOURNEY_FPS}
        width={JOURNEY_WIDTH}
        height={JOURNEY_HEIGHT}
      />
    </>
  );
};
