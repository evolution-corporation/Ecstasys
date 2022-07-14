import { Audio, AVPlaybackStatusSuccess } from "expo-av";
import { useState, useRef, useEffect, useMemo } from "react";
import { getAudioData, getMeditationData } from "~api/meditation";

export interface AudioControl {
  onEditTimeStart: () => void;
  onEditTimeFinish: (positionMillis: number) => void;
  addTime: (positionMillis: number) => void;
  play: () => void;
  pause: () => void;
  PlayPause: () => void;
}

export interface AudionControl {
  meditationData?: MeditationData;
  audioData?: AVPlaybackStatusSuccess;
  audioControl: AudioControl;
  setMeditationId: (id: string) => void;
}

export default function useAudio(): AudionControl {
  const preIsPlaying = useRef<boolean>(false);
  const [meditationId, setMeditationId] = useState<string | null>(null);
  const [meditationData, setMeditationData] = useState<
    MeditationData | undefined
  >();
  const [audioData, setAudioData] = useState<AVPlaybackStatusSuccess>();
  Audio.setAudioModeAsync({
    staysActiveInBackground: false,
    playThroughEarpieceAndroid: true,
  });
  const audio = useRef<Audio.Sound>(new Audio.Sound()).current;
  audio.setOnPlaybackStatusUpdate((status) => {
    if (status.isLoaded) {
      setAudioData(status);
    }
  });

  useEffect(() => {
    if (!!meditationId) {
      if ((meditationData?.id ?? meditationData) != meditationId) {
        audio.stopAsync();
      }
      getMeditationData(meditationId, { isMinimal: false }).then(
        async (data) => {
          setMeditationData(data);
          const { headers, uri } = await getAudioData(data);
          await audio.loadAsync({ uri, headers }, {}, true);
        }
      );
    }
  }, [meditationId]);

  const audioControl: AudioControl = {
    play: () => audio.playAsync(),
    pause: () => audio.pauseAsync(),
    PlayPause: () => {
      if (audioData?.isPlaying) {
        audio.pauseAsync();
      } else {
        audio.playAsync();
      }
    },
    addTime: (positionMillis: number) => {
      if (audioData?.positionMillis)
        audio.setPositionAsync(audioData?.positionMillis + positionMillis);
    },
    onEditTimeStart: () => {
      audio.getStatusAsync().then((status) => {
        if (status.isLoaded) {
          preIsPlaying.current = status.isPlaying;
        }
      });
      audio.pauseAsync();
    },
    onEditTimeFinish: (positionMillis: number) => {
      audio.setPositionAsync(positionMillis);
      if (preIsPlaying.current) {
        audio.playAsync();
      }
    },
  };

  return {
    meditationData,
    audioData,
    audioControl,
    setMeditationId,
  };
}
