import { useFocusEffect } from "@react-navigation/native";
import React from "react";

import * as reactNative from "react-native";
import { useAppDispatch, useAppSelector } from "~store/index";
import Icon, { IconName } from "~assets/icons";
import ColorButton, { TextButton } from "~components/ColorButton";
import MeditationCard from "~components/MeditationCard";
import UserInformation from "~components/UserInformation";
import i18n from "~i18n";
import style, { colors } from "~styles";
import { getMeditationToDay } from "~store/meditation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const MainScreen: React.FC<TabNavigatorScreenProps<"Main">> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();
  const account = useAppSelector((state) => state.account.user);
  const mood = useAppSelector((state) => state.account.mood);
  const weekStatic = useAppSelector((state) => state.meditation.weekStatistic);
  const meditationList = useAppSelector((state) => ({
    meditationRecommend: state.meditation.meditationRecommendToDay,
    isHavePlanMeditation: !!state.meditation.parametersMeditation,
    meditationPopularToDay: state.meditation.meditationPopularToDay,
    isLoading: !state.meditation.meditationPopularToDay,
  }));
  const refScrollVew =
    React.useRef<React.ElementRef<typeof reactNative.ScrollView>>(null);

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

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getMeditationToDay());
    }, [])
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
    refScrollVew.current?.scrollTo({ x: 0, y: 0, animated: true });
  };

  React.useEffect(() => {
    reactNative.LayoutAnimation.configureNext(
      reactNative.LayoutAnimation.create(300, "linear", "opacity")
    );
  }, [meditationList.isLoading]);

  if (account == undefined) {
    return null;
  }

  const openEditParametersMeditation = () => {
    navigation.navigate("EditMeditationsParameters");
  };

  const openPlayer = (
    type: "meditationRecommend" | "meditationPopularToDay"
  ) => {
    if (type == "meditationRecommend" && meditationList.meditationRecommend) {
      navigation.navigate("MeditationListener", {
        meditationID: meditationList.meditationRecommend.id,
      });
    } else if (
      type == "meditationPopularToDay" &&
      meditationList.meditationPopularToDay
    ) {
      navigation.navigate("MeditationListener", {
        meditationID: meditationList.meditationPopularToDay.id,
      });
    }
  };

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
        <reactNative.View>
          <reactNative.Image
            source={require("~assets/Professor.png")}
            style={styles.professor}
          />
          <reactNative.Text style={styles.greetingMessage}>{`${
            account.displayName
          }!\n${
            mood
              ? i18n.t("ec691f03-7ecf-45ff-8fb5-32df22f020dc")
              : i18n.t("11a21614-0998-403d-af51-62590ecea06e")
          }`}</reactNative.Text>
        </reactNative.View>
        <ColorButton
          text={mood ? i18n.getMood(mood, 0) : i18n.t("answer")}
          type={"small"}
          onPress={() => navigation.navigate("SelectMood")}
        />
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
          <reactNative.ScrollView
            ref={refScrollVew}
            style={styles.MeditationListInfo}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={isOpenMeditationListInfo}
          >
            {meditationList.isLoading ||
            meditationList.meditationPopularToDay == undefined ? (
              <reactNative.View
                style={{
                  width: "100%",
                  height:
                    reactNative.Dimensions.get("screen").height -
                    heightGreeting,
                  justifyContent: "center",
                }}
              >
                <reactNative.ActivityIndicator
                  color={colors.violet}
                  size={"large"}
                />
              </reactNative.View>
            ) : (
              [
                {
                  title: meditationList.isHavePlanMeditation
                    ? i18n.t("7eb34e06-117e-4ccc-a92b-549dfed5f877")
                    : i18n.t("9d0cd47a-0392-4e5c-9573-00642b12f868"),
                  subTitle: meditationList.isHavePlanMeditation
                    ? i18n.t("a90954d8-a9fa-4f31-bc63-0004bbb2a9a3")
                    : i18n.t("f292b17c-2295-471e-80cf-f99f6a618701"),
                  content: (
                    <>
                      {meditationList.meditationRecommend ? (
                        <MeditationCard
                          meditation={meditationList.meditationRecommend}
                          onPress={() => {
                            openPlayer("meditationRecommend");
                          }}
                        />
                      ) : (
                        <>
                          <reactNative.Image
                            source={require("~assets/Professor.png")}
                            style={styles.professor}
                          />
                          <reactNative.Text
                            style={[styles.textTitle, { textAlign: "center" }]}
                          >
                            {i18n.t("cf08c329-9377-4500-be35-d82be69834ad")}
                          </reactNative.Text>
                        </>
                      )}

                      {meditationList.isHavePlanMeditation ? (
                        <TextButton
                          text={i18n.t("7363f93d-4efc-4a70-b68c-8cb36f28e458")}
                          styleText={styles.textButtonEditPlan}
                          onPress={() => openEditParametersMeditation()}
                        />
                      ) : (
                        <ColorButton
                          type={"small"}
                          text={i18n.t("258d5ee4-d6e5-40ad-854a-236226f909be")}
                          styleButton={styles.buttonSelectMeditation}
                          styleText={styles.buttonSelectMeditationText}
                          onPress={() => openEditParametersMeditation()}
                        />
                      )}
                    </>
                  ),
                },
                {
                  title: i18n.t("714f47ef-f1fc-426b-8fc6-3789b81051f0"),
                  subTitle: i18n.t("be0d3e18-6c18-4879-89b1-dca3c0f18194"),
                  content: (
                    <reactNative.View
                      style={{ flexDirection: "row", marginHorizontal: -7.5 }}
                    >
                      <StaticCard
                        icon={"Headphones"}
                        backgroundColor={colors.white}
                        data={weekStatic.count}
                        text={i18n.t("8f6752b0-6ada-4344-a0b9-dd471eee1297")}
                        textColor={colors.StrokePanel}
                      />
                      <StaticCard
                        icon={"Timer"}
                        backgroundColor={colors.StrokePanel}
                        data={Math.floor(weekStatic.time / 60)}
                        text={i18n.t("10ced895-7fa8-40cb-bc8a-b8880b6086b0")}
                        textColor={colors.white}
                      />
                    </reactNative.View>
                  ),
                },
                {
                  title: i18n.t("bbb079ed-25a1-4360-a262-5c1ef0741cbf"),
                  subTitle: i18n.t("02d07c6c-dc56-4a58-93f0-c4d3acce43b7"),
                  content: (
                    <MeditationCard
                      meditation={meditationList.meditationPopularToDay}
                      onPress={() => {
                        openPlayer("meditationPopularToDay");
                      }}
                    />
                  ),
                },
              ].map(({ content, title, subTitle }, index) => (
                <reactNative.View
                  style={styles.infoCard}
                  key={index.toString()}
                >
                  <reactNative.Text style={styles.textTitle}>
                    {title}
                  </reactNative.Text>
                  <reactNative.Text style={styles.textSubTitle}>
                    {subTitle}
                  </reactNative.Text>
                  {content}
                </reactNative.View>
              ))
            )}
          </reactNative.ScrollView>
        </reactNative.Pressable>
      </reactNative.Animated.View>
    </reactNative.View>
  );
};

const StaticCard: React.FC<{
  icon: IconName;
  text: string;
  data: number;
  backgroundColor: reactNative.ColorValue;
  textColor: reactNative.ColorValue;
}> = (props) => (
  <reactNative.View
    style={[
      styles.staticCardBackground,
      { backgroundColor: props.backgroundColor },
    ]}
  >
    <reactNative.View style={{ flex: 1, alignItems: "center" }}>
      <Icon name={props.icon} style={styles.icon} />
      <reactNative.Text
        style={[styles.staticCardText, { color: props.textColor }]}
      >
        {props.text}
      </reactNative.Text>
    </reactNative.View>
    <reactNative.Text
      style={[styles.staticCardData, { color: props.textColor }]}
    >
      {props.data}
    </reactNative.Text>
  </reactNative.View>
);

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

export default MainScreen;
