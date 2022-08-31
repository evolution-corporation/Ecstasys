import React, { FC, useCallback, useState } from "react";
import { Dimensions, Pressable, StyleSheet, ViewProps } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Entypo } from "@expo/vector-icons";

const Feed: FC<Props> = (props) => {
  const { hiddenHeight = 400, children } = props;
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const _opacityCrossButton = useSharedValue(0);
  const _translateYBackground = useSharedValue(hiddenHeight);
  const aStyle = {
    scrollView: useAnimatedStyle(() => ({
      borderTopRightRadius: interpolate(
        _translateYBackground.value,
        [hiddenHeight, 0],
        [20, 0]
      ),
      borderTopLeftRadius: interpolate(
        _translateYBackground.value,
        [hiddenHeight, 0],
        [20, 0]
      ),
      transform: [{ translateY: _translateYBackground.value }],
    })),
    crossButton: useAnimatedStyle(() => ({
      opacity: withTiming(_opacityCrossButton.value),
    })),
  };

  const gestureFeed = Gesture.Pan()
    .onStart((event) => {
      _opacityCrossButton.value = 0;
      if (event.absoluteY > 0 && event.absoluteY < hiddenHeight + 50) {
        _translateYBackground.value = withTiming(event.absoluteY);
      }
    })
    .onUpdate((event) => {
      if (event.absoluteY > 0 && event.absoluteY < hiddenHeight + 50) {
        _translateYBackground.value = event.absoluteY;
      }
    })
    .onEnd((event) => {
      if (event.translationY < 0) {
        _translateYBackground.value = withTiming(0);
        _opacityCrossButton.value = 1;
      } else {
        _translateYBackground.value = withTiming(hiddenHeight);
      }
    });

  return (
    <GestureDetector gesture={gestureFeed}>
      <Animated.View style={[styles.feedContainer, aStyle.scrollView]}>
        {/* <Animated.View style={[styles.crossButton, aStyle.scrollView]}>
          <Pressable
            onPress={() => {
              _translateYBackground.value = withTiming(hiddenHeight);
              _opacityCrossButton.value = 0;
            }}
            style={{ flex: 1, backgroundColor: "red" }}
          >
            <Entypo name="cross" size={24} color="black" />
          </Pressable>
        </Animated.View> */}
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  feedContainer: {
    position: "absolute",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#FFFFFF",
    height: Dimensions.get("screen").height,
  },
  crossButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
});

interface Props extends ViewProps {
  hiddenHeight?: number;
}

export default Feed;

// {!isServerAccess ? null : (
//     <FeedCard
//       title={i18n.t(
//         isHavePlanMeditation
//           ? "7eb34e06-117e-4ccc-a92b-549dfed5f877"
//           : "9d0cd47a-0392-4e5c-9573-00642b12f868"
//       )}
//       subTitle={i18n.t(
//         isHavePlanMeditation
//           ? "a90954d8-a9fa-4f31-bc63-0004bbb2a9a3"
//           : "f292b17c-2295-471e-80cf-f99f6a618701"
//       )}
//       key={"MeditationList"}
//     >
//       {meditationList.meditationRecommend ? (
//         <MeditationCard
//           meditation={meditationList.meditationRecommend}
//           type={"full"}
//         />
//       ) : isHavePlanMeditation ? (
//         <ProfessorMessage
//           text={i18n.t("cf08c329-9377-4500-be35-d82be69834ad")}
//           style={styles.professorMessage}
//         />
//       ) : (
//         <ActivityIndicator />
//       )}
//       {isHavePlanMeditation ? (
//         <TextButton
//           text={i18n.t("7363f93d-4efc-4a70-b68c-8cb36f28e458")}
//           styleText={styles.textButtonEditPlan}
//           onPress={() => navigation.navigate("EditMeditationsParameters")}
//         />
//       ) : (
//         <ColorButton
//           type={"small"}
//           text={i18n.t("258d5ee4-d6e5-40ad-854a-236226f909be")}
//           styleButton={styles.buttonSelectMeditation}
//           styleText={styles.buttonSelectMeditationText}
//           onPress={() => navigation.navigate("EditMeditationsParameters")}
//         />
//       )}
//     </FeedCard>
//   )}
//   <FeedCard
//     title={i18n.t("714f47ef-f1fc-426b-8fc6-3789b81051f0")}
//     subTitle={i18n.t("be0d3e18-6c18-4879-89b1-dca3c0f18194")}
//     key={"statistic"}
//   >
//     <StatisticMeditation type={"small"} />
//   </FeedCard>
//   {!isServerAccess ? null : (
//     <FeedCard
//       title={i18n.t("bbb079ed-25a1-4360-a262-5c1ef0741cbf")}
//       subTitle={i18n.t("02d07c6c-dc56-4a58-93f0-c4d3acce43b7")}
//       key={"popularDay"}
//     >
//       {meditationList.meditationPopularToDay ? (
//         <MeditationCard
//           meditation={meditationList.meditationPopularToDay}
//         />
//       ) : (
//         <ActivityIndicator />
//       )}
//     </FeedCard>
//   )}
