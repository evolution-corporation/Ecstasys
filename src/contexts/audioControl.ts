import { createContext } from "react";
import { AudioControl } from "~hooks/useAudio";
import { AVPlaybackStatusSuccess } from "expo-av";

const AudioControlContext = createContext<{
  audioControl: AudioControl;
  audioData: AVPlaybackStatusSuccess | undefined;
  meditationData: MeditationData | undefined;
  backgroundMusicName: BackgroundMusic | null;
  backgroundMusicVolume: number;
} | null>(null);
export default AudioControlContext;
