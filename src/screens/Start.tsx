import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect } from "react";

import * as reactNative from "react-native";
import { useAppDispatch, useAppSelector } from "~store/index";
import Icon, { IconName } from "~assets/icons";
import UserInformation from "~components/UserInformation";
import i18n from "~i18n";
import style, { colors } from "~styles";
import { getMeditationToDay } from "~store/meditation";
import MoodInformation from "~modules/mood/components/MoodInformation";
import Feed from "~components/Feed";
import { useBackHandler } from "@react-native-community/hooks";
import ProfessorMessage from "~components/ProfessorMessage";

const StartScreen: React.FC<TabNavigatorScreenProps<"Main">> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();
  const account = useAppSelector((state) => state.account.user);
  const mood = useAppSelector((state) => state.account.mood);

  const [isOpenMeditationListInfo, setIsOpenMeditationListInfo] =
    React.useState<boolean>(false);
  const [heightGreeting, setHeightGreeting] = React.useState<number>(400);
  const positionMeditationListInfo = React.useRef(
    new reactNative.Animated.Value(-20)
  ).current;
  positionMeditationListInfo.addListener(({ value }) => {
    setIsOpenMeditationListInfo(value == -heightGreeting);
  });
  const borderRadiusMeditationListInfo = positionMeditationListInfo.interpolate(
    {
      inputRange: [-(heightGreeting - 20), -20],
      outputRange: [0, 20],
    }
  );
  const closeButtonMeditationListInfo = positionMeditationListInfo.interpolate({
    inputRange: [-(heightGreeting - 20), -20],
    outputRange: [0, styles.closeButton.right + styles.closeButton.width],
  });

  const PanResponderMeditationListInfo = React.useMemo(
    () =>
      reactNative.PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => true,
        onPanResponderMove: (_, gestureState) => {
          if (!isOpenMeditationListInfo) {
            let offSet: number = gestureState.moveY - heightGreeting;
            positionMeditationListInfo.setValue(
              offSet <= -20 ? gestureState.moveY - heightGreeting : -20
            );
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (!isOpenMeditationListInfo) {
            if (gestureState.dy < 0) {
              showMeditationListInfo();
            } else {
              hideMeditationListInfo();
            }
          }
        },
      }),
    [isOpenMeditationListInfo]
  );

  const showMeditationListInfo = () => {
    reactNative.Animated.timing(positionMeditationListInfo, {
      toValue: -heightGreeting,
      useNativeDriver: true,
    }).start();
  };
  const hideMeditationListInfo = () => {
    reactNative.Animated.timing(positionMeditationListInfo, {
      toValue: -20,
      useNativeDriver: true,
    }).start();
  };

  useBackHandler(() => {
    if (isOpenMeditationListInfo) {
      hideMeditationListInfo();
      return true;
    } else {
      return false;
    }
  });

  if (account == undefined) {
    return null;
  }

  return (
    <reactNative.View style={{ flex: 1 }}>
      <reactNative.ImageBackground
        source={require("~assets/backgroundImage/greetingImage.png")}
        style={styles.greeting}
        onLayout={({ nativeEvent: { layout } }) => {
          setHeightGreeting(layout.height);
        }}
      >
        <UserInformation
          type="small"
          user={account}
          position={{ x: 20, y: 38 }}
        />
        <ProfessorMessage
          text={`${account.name ?? ""}!\n${
            mood
              ? i18n.t("ec691f03-7ecf-45ff-8fb5-32df22f020dc")
              : i18n.t("11a21614-0998-403d-af51-62590ecea06e")
          }`}
          textStyle={styles.greetingMessage}
        />
        <MoodInformation type="minimal" />
      </reactNative.ImageBackground>
      <reactNative.Animated.View
        style={[
          styles.meditationListInfoMain,
          {
            transform: [{ translateY: positionMeditationListInfo }],
            borderTopLeftRadius: borderRadiusMeditationListInfo,

            borderTopRightRadius: borderRadiusMeditationListInfo,
          },
        ]}
        {...PanResponderMeditationListInfo.panHandlers}
      >
        <reactNative.Pressable
          onPress={() => showMeditationListInfo()}
          style={{ flex: 1 }}
          disabled={isOpenMeditationListInfo}
        >
          {isOpenMeditationListInfo && closeButtonMeditationListInfo && (
            <reactNative.Animated.View
              style={[
                styles.closeButton,
                {
                  transform: [
                    {
                      translateX: closeButtonMeditationListInfo,
                    },
                  ],
                },
              ]}
            >
              <reactNative.TouchableOpacity
                onPress={() => hideMeditationListInfo()}
              >
                <Icon name={"CrossMarker"} style={{ height: 20, width: 20 }} />
              </reactNative.TouchableOpacity>
            </reactNative.Animated.View>
          )}
          <Feed />
        </reactNative.Pressable>
      </reactNative.Animated.View>
    </reactNative.View>
  );
};

const styles = reactNative.StyleSheet.create({
  professor: {
    width: 147,
    height: 147,
    alignSelf: "center",
  },
  greeting: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 90,
    paddingBottom: 30,
  },
  greetingMessage: {
    color: colors.white,
    fontSize: 24,
    textAlign: "center",
    ...style.getFontOption("700"),
    marginVertical: 14,
  },
  meditationListInfoMain: {
    height: reactNative.Dimensions.get("screen").height,
    width: "100%",
    backgroundColor: colors.white,
  },
  textTitle: {
    color: colors.DarkLetters,
    fontSize: 20,
    ...style.getFontOption("400"),
    marginBottom: 12,
  },
  textSubTitle: {
    color: colors.grayHell,
    fontSize: 14,
    ...style.getFontOption("400"),
    marginBottom: 15,
  },
  MeditationListInfo: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  buttonSelectMeditation: {
    backgroundColor: colors.violet,
    alignSelf: "center",
    marginTop: 16,
  },
  buttonSelectMeditationText: {
    color: colors.white,
  },
  textButtonEditPlan: {
    color: colors.violet,
    fontSize: 13,
    ...style.getFontOption("400"),
    textAlign: "center",
  },
  icon: {
    width: 35,
    height: 35,
  },
  staticCardBackground: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 20,
    borderColor: colors.StrokePanel,
    borderWidth: 3,
    flex: 1,
    marginHorizontal: 7.5,
  },
  staticCardText: {
    fontSize: 12,
    ...style.getFontOption("400"),
  },
  staticCardData: {
    fontSize: 32,
    ...style.getFontOption("700"),
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
  },
  infoCard: {
    marginBottom: 34,
  },
  closeButton: {
    backgroundColor: colors.DarkGlass,
    width: 30,
    height: 30,
    padding: 5,
    borderRadius: 15,
    position: "absolute",
    top: 20,
    right: 15,
    zIndex: 10,
  },
});

export default StartScreen;
