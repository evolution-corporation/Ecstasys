import { Audio, AVPlaybackSource, AVPlaybackStatusSuccess } from "expo-av";
import { useState, useRef, useEffect, useCallback } from "react";
import { ImageSourcePropType } from "react-native";
import { getAudioData, getMeditationData } from "~api/meditation";
import { useAppDispatch } from "~store/index";
import { addWeekStaticOneSeance } from "~store/meditation";
export interface AudioControl {
  onEditTimeStart: () => void;
  onEditTimeFinish: (positionMillis: number) => void;
  addTime: (positionMillis: number) => void;
  play: () => void;
  pause: () => void;
  PlayPause: () => void;
  addBackgroundMusic: (name: BackgroundMusic) => void;
  editVolumeBackgroundMusic: (volume: number) => void;
  removeBackgroundMusic: () => void;
}

export interface AudionControl {
  meditationData?: MeditationData;
  audioData?: AVPlaybackStatusSuccess;
  audioControl: AudioControl;
  backgroundMusicName: BackgroundMusic | null;
  backgroundMusicVolume: number;
}

const backgroundMusic: {
  [index in BackgroundMusic]: AVPlaybackSource;
} = {
  Test: require("~assets/backgroundMusic/test.mp3"),
  Test2: require("~assets/backgroundMusic/test2.mp3"),
};

export const backgroundMusicImage: {
  [index in BackgroundMusic]: ImageSourcePropType;
} = {
  Test: require("~assets/backgroundMusic/test.png"),
  Test2: require("~assets/backgroundMusic/test2.png"),
};

export default function useAudio(meditationId: string): AudionControl {
  const preIsPlaying = useRef<boolean>(false);
  let isActivate = false;
  const [meditationData, setMeditationData] = useState<
    MeditationData | undefined
  >();
  const [audioData, setAudioData] = useState<AVPlaybackStatusSuccess>();
  const AppDispatch = useAppDispatch();
  Audio.setAudioModeAsync({
    staysActiveInBackground: false,
    playThroughEarpieceAndroid: true,
  });
  const audio = useRef<Audio.Sound>(new Audio.Sound()).current;
  const backgroundSound = useRef<Audio.Sound>(new Audio.Sound()).current;
  const [backgroundMusicName, setBackgroundMusicName] =
    useState<BackgroundMusic | null>(null);
  const [backgroundMusicVolume, setBackgroundMusicVolume] = useState<number>(1);

  useEffect(() => {
    if (!!meditationId) {
      if (meditationData && meditationData.id != meditationId) {
        console.info("stop");
        audio.stopAsync();
        backgroundSound.stopAsync();
      }
      getMeditationData(meditationId, { isMinimal: false }).then(
        async (data) => {
          setMeditationData(data);
          const { headers, uri } = await getAudioData(data);
          await audio.loadAsync({ uri, headers }, { volume: 1 }, true);
        }
      );
      audio.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          if (isActivate) {
            setAudioData(status);
          }
        }
      });
    }

    return () => {};
  }, [meditationId]);

  const addStatic = async () => {
    const state = await audio.getStatusAsync();
    if (state.isLoaded && state.positionMillis > 60000) {
      AppDispatch(addWeekStaticOneSeance(state.positionMillis / 1000));
    }
  };

  useEffect(() => {
    isActivate = true;
    return () => {
      addStatic();
      audio.stopAsync();
      backgroundSound.stopAsync();
      isActivate = false;
    };
  }, [setAudioData]);

  const removeBackgroundMusic = async () => {
    const result = await backgroundSound.getStatusAsync();
    if (result.isLoaded) {
      await backgroundSound.stopAsync();
      await backgroundSound.unloadAsync();
      setBackgroundMusicName(null);
    }
  };

  const addBackgroundMusic = async (name: BackgroundMusic) => {
    if (backgroundMusicName != null) {
      await removeBackgroundMusic();
    }
    const result = await backgroundSound.loadAsync(backgroundMusic[name]);
    if (result.isLoaded) {
      backgroundSound.setIsLoopingAsync(true);
      setBackgroundMusicName(name);
      backgroundSound.setOnPlaybackStatusUpdate((data) => {
        if (data.isLoaded) {
          setBackgroundMusicVolume(data.volume);
        }
      });
    }
  };

  useEffect(() => {
    if (!!backgroundMusicName) {
      backgroundSound.getStatusAsync().then((result) => {
        if (audioData?.isPlaying && result.isLoaded) {
          backgroundSound.playAsync();
        } else {
          backgroundSound.pauseAsync();
        }
      });
    }
  }, [audioData, backgroundMusicName]);

  const audioControl: AudioControl = {
    play: () => {
      console.log("test");
      audio.playAsync();
    },
    pause: () => audio.pauseAsync(),
    PlayPause: () => {
      if (audioData?.isPlaying) {
        audio.playAsync();
      } else {
        audio.pauseAsync();
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
    addBackgroundMusic,
    editVolumeBackgroundMusic: async (volume: number) => {
      const result = await backgroundSound.getStatusAsync();
      if (result.isLoaded && volume >= 0 && volume <= 1) {
        backgroundSound.setVolumeAsync(volume);
      }
    },
    removeBackgroundMusic,
  };

  return {
    meditationData,
    audioData,
    audioControl,
    backgroundMusicName,
    backgroundMusicVolume,
  };
}
