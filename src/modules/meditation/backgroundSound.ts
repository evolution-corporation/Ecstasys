import { Audio, AVPlaybackStatus } from "expo-av";

const BackgroundSound = {
  thunderstorm: {
    image: require("./assets/thunderstorm.png"),
    audio: require("./assets/backgroundSound/thunderstorm.mp3"),
    translate: "10196d40-2dcd-48c9-a070-3b8f9b264df6",
  },
  waterfall: {
    image: require("./assets/waterfall.png"),
    audio: require("./assets/backgroundSound/waterfall.mp3"),
    translate: "cd529b21-208b-4103-94ab-ee84b9845cd0",
  },
};

export async function playFragmentMeditationBackground(
  name: keyof typeof BackgroundSound
) {
  const sound = (
    await Audio.Sound.createAsync(BackgroundSound[name].audio, {
      isLooping: true,
    })
  ).sound;
  await sound.playAsync();
  const off = async () => {
    await sound.stopAsync();
  };
  setTimeout(() => off(), 15000);
  return off;
}

export default BackgroundSound;
