import { createContext } from "react";
import { AudioControl } from "~hooks/useAudio";
import { AVPlaybackStatusSuccess } from "expo-av";

const AudioControlContext = createContext<{
  audioControl: AudioControl;
  audioData: AVPlaybackStatusSuccess;
  setAudioData: (id: string) => void;
} | null>(null);
export default AudioControlContext;
