import { Composition } from "remotion";
import { ExpalVideo } from "./ExpalVideo";
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
    </>
  );
};
