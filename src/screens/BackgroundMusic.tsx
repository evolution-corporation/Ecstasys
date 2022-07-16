import React, { FC, useContext, useMemo, useRef, useState } from "react";
import {
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  PanResponder,
  Animated,
  LayoutRectangle,
} from "react-native";
import { backgroundMusicImage } from "~hooks/useAudio";
import style, { colors } from "~styles";
import AudioControlContext from "~contexts/audioControl";
import BackgroundGradient from "~containers/BackgroundGradient";
import i18n from "~i18n";

const backgroundMusicNames: BackgroundMusic[] = ["Test", "Test2"];

const BackgroundMusicScreen: FC<
  MeditationListenerScreenProps<"BackgroundMusic">
> = ({ route, navigation }) => {
  const audioData = useContext(AudioControlContext);
  const [layoutTimeLine, setLayoutTimeLine] = useState<LayoutRectangle | null>(
    null
  );
  const currentPosition = useRef(new Animated.Value(0)).current;
  const sizePoint = useRef(new Animated.Value(1)).current;

  const pointGesture = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return true;
        },
        onPanResponderGrant: (_, gestureState) => {
          Animated.timing(sizePoint, {
            toValue: 2,
            duration: 100,
            useNativeDriver: false,
          }).start();
        },
        onPanResponderMove: (_, gestureState) => {
          if (layoutTimeLine) {
            const locationX = gestureState.moveX; //- layoutTimeLine.x;
            if (locationX >= 0 && locationX <= layoutTimeLine.width) {
              currentPosition.setValue(locationX);

              audioData?.audioControl.editVolumeBackgroundMusic(
                locationX / layoutTimeLine.width
              );
            }
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          Animated.timing(sizePoint, {
            toValue: 1,
            duration: 100,
            useNativeDriver: false,
          }).start();
        },
      }),
    [layoutTimeLine]
  );

  if (!audioData?.audioData) return null;
  return (
    <BackgroundGradient isImage imageName={"leaves"} style={styles.background}>
      <View style={styles.librarySound}>
        {backgroundMusicNames.map((backgroundMusicName) => (
          <TouchableOpacity
            key={backgroundMusicName}
            style={styles.backgroundMusicView}
            onPress={() => {
              if (audioData.backgroundMusicName == backgroundMusicName) {
                audioData.audioControl.removeBackgroundMusic();
              } else {
                audioData.audioControl.addBackgroundMusic(backgroundMusicName);
              }
            }}
          >
            <Image
              source={backgroundMusicImage[backgroundMusicName]}
              style={styles.backgroundMusicImage}
            />
            <Text style={styles.backgroundMusicName}>
              {i18n.getBackgroundMusicImage(backgroundMusicName)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View>
        <Animated.View
          style={[
            styles.timeLine,

            {
              width: "100%",
              transform: [{ scaleY: sizePoint }],
            },
          ]}
          {...pointGesture.panHandlers}
          onLayout={({ nativeEvent: { layout } }) => {
            setLayoutTimeLine(layout);
            currentPosition.setValue(
              (audioData?.backgroundMusicVolume ?? 1) * layout.width
            );
          }}
        >
          <Animated.View
            style={[
              styles.timeLine,
              {
                width: currentPosition,
                borderColor: colors.white,
                backgroundColor: colors.white,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.point,
              {
                transform: [
                  { translateX: currentPosition },
                  { scaleX: sizePoint },
                ],
              },
            ]}
          />
        </Animated.View>
      </View>
    </BackgroundGradient>
  );
};

export default BackgroundMusicScreen;

const styles = StyleSheet.create({
  timeLine: {
    position: "absolute",
    height: 5,
    backgroundColor: "rgba(255,255,255, 0.3)",
    borderColor: "rgba(255,255,255, 0.3)",
    borderWidth: 2,
    borderRadius: 165,
    flexDirection: "row",
    alignSelf: "center",
  },
  point: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: "rgba(255,255,255, 0.3)",
    position: "absolute",
    zIndex: 1,
    alignSelf: "center",
    left: -10,
  },
  background: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 58,
    paddingHorizontal: 20,
  },
  librarySound: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
  backgroundMusicView: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  backgroundMusicImage: {
    height: 65,
    width: 65,
    borderRadius: 20,
    overflow: "hidden",
  },
  backgroundMusicName: {
    color: colors.white,
    fontSize: 12,
    ...style.getFontOption("500"),
    marginTop: 9,
  },
});
