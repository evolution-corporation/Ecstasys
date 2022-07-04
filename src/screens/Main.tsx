import React, { Component, FC, forwardRef, memo } from "react";
import { createRef } from "react";
import { RefObject } from "react";
import {
  ActivityIndicator,
  Animated,
  BackHandler,
  ColorValue,
  Dimensions,
  Image,
  ImageBackground,
  NativeEventSubscription,
  PanResponder,
  PanResponderInstance,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import Icon, { IconName } from "~assets/icons";
import ColorButton, { TextButton } from "~components/ColorButton";
import MeditationCard from "~components/MeditationCard";
import UserInformation from "~components/UserInformation";
import i18n from "~i18n";
import Meditation, { WeekStatistic } from "~models/Meditation";
import UserModel, { UserAccount, UserMood } from "~models/User";
import style, { colors } from "~styles";

export default class MainScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      user: this.props.accountInformation,
      isOpenMeditationListInfo: false,
      isHavePlanMeditation: false,
      refScrollVew: createRef(),
      positionMeditationListInfo: new Animated.Value(-20),
      isActivate: false,
      PanResponderMeditationListInfo: PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => true,
        onPanResponderMove: (_, gestureState) => {
          if (
            !!this.state.heightGreeting &&
            !this.state.isOpenMeditationListInfo
          ) {
            let offSet: number = gestureState.moveY - this.state.heightGreeting;
            this.state.positionMeditationListInfo.setValue(
              offSet <= -20
                ? gestureState.moveY - this.state.heightGreeting
                : -20
            );
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (
            !!this.state.heightGreeting &&
            !this.state.isOpenMeditationListInfo
          ) {
            if (gestureState.dy < 0) {
              this.showMeditationListInfo();
            } else {
              this.hideMeditationListInfo();
            }
          }
        },
      }),
      unSubscribe: [],
    };
  }

  render() {
    return (
      <View style={{ ...StyleSheet.absoluteFillObject }}>
        <ImageBackground
          source={require("~assets/backgroundImage/greetingImage.png")}
          style={styles.greeting}
          onLayout={({ nativeEvent: { layout } }) => {
            this.setState({ heightGreeting: layout.height });
          }}
        >
          <UserInformation
            type="small"
            user={this.user}
            position={{ x: 20, y: 38 }}
          />
          <View>
            <Image
              source={require("~assets/Professor.png")}
              style={styles.professor}
            />
            <Text style={styles.greetingMessage}>{`${this.user.displayName}!\n${
              this.state.mood
                ? i18n.t("ec691f03-7ecf-45ff-8fb5-32df22f020dc")
                : i18n.t("11a21614-0998-403d-af51-62590ecea06e")
            }`}</Text>
          </View>
          <ColorButton
            text={
              this.state.mood
                ? i18n.t("d8367532-4ae1-4e1e-90a1-bb8614090cb2", {
                    composite: {
                      compositeIndex: this.state.mood,
                      composite: true,
                    },
                  })
                : i18n.t("answer")
            }
            type={"small"}
            onPress={() => {
              this.props.appController.editScreen("SelectMoon");
            }}
          />
        </ImageBackground>
        <Animated.View
          style={[
            styles.meditationListInfoMain,
            {
              transform: [
                { translateY: this.state.positionMeditationListInfo },
              ],
              borderTopLeftRadius: this.state.borderRadiusMeditationListInfo,

              borderTopRightRadius: this.state.borderRadiusMeditationListInfo,
            },
          ]}
          {...this.state.PanResponderMeditationListInfo.panHandlers}
        >
          <Pressable
            onPress={() => this.showMeditationListInfo()}
            style={{ flex: 1 }}
            disabled={this.state.isOpenMeditationListInfo}
          >
            {this.state.isOpenMeditationListInfo &&
              this.state.closeButtonMeditationListInfo && (
                <Animated.View
                  style={[
                    styles.closeButton,
                    {
                      transform: [
                        {
                          translateX: this.state.closeButtonMeditationListInfo,
                        },
                      ],
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => this.hideMeditationListInfo()}
                  >
                    <Icon
                      name={"CrossMarker"}
                      style={{ height: 20, width: 20 }}
                    />
                  </TouchableOpacity>
                </Animated.View>
              )}
            <ScrollView
              ref={this.state.refScrollVew}
              style={styles.MeditationListInfo}
              contentContainerStyle={{ paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
              scrollEnabled={this.state.isOpenMeditationListInfo}
            >
              {this.state.isHavePlanMeditation ? (
                <InfoCard
                  title={i18n.t("7eb34e06-117e-4ccc-a92b-549dfed5f877")}
                  subTitle={i18n.t("a90954d8-a9fa-4f31-bc63-0004bbb2a9a3")}
                >
                  {this.state.meditationPlan ? (
                    <MeditationCard
                      meditation={this.state.meditationPlan}
                      onPress={() =>
                        this.openMeditationPlayer(this.state.meditationPlan)
                      }
                    />
                  ) : (
                    <>
                      <Image
                        source={require("~assets/Professor.png")}
                        style={styles.professor}
                      />
                      <Text style={[styles.textTitle, { textAlign: "center" }]}>
                        {i18n.t("cf08c329-9377-4500-be35-d82be69834ad")}
                      </Text>
                    </>
                  )}

                  <TextButton
                    text={i18n.t("7363f93d-4efc-4a70-b68c-8cb36f28e458")}
                    onPress={() => this.editPlanMeditation()}
                    styleText={styles.textButtonEditPlan}
                  />
                </InfoCard>
              ) : (
                <InfoCard
                  title={i18n.t("9d0cd47a-0392-4e5c-9573-00642b12f868")}
                  subTitle={i18n.t("f292b17c-2295-471e-80cf-f99f6a618701")}
                >
                  <ColorButton
                    type={"small"}
                    text={i18n.t("258d5ee4-d6e5-40ad-854a-236226f909be")}
                    styleButton={styles.buttonSelectMeditation}
                    styleText={styles.buttonSelectMeditationText}
                    onPress={() => this.editPlanMeditation()}
                  />
                </InfoCard>
              )}
              {this.state.weekStatic && (
                <InfoCard
                  title={i18n.t("714f47ef-f1fc-426b-8fc6-3789b81051f0")}
                  subTitle={i18n.t("be0d3e18-6c18-4879-89b1-dca3c0f18194")}
                  style={{ flexDirection: "row", marginHorizontal: -7.5 }}
                >
                  <StaticCard
                    icon={"Headphones"}
                    backgroundColor={colors.white}
                    data={this.state.weekStatic.count}
                    text={i18n.t("8f6752b0-6ada-4344-a0b9-dd471eee1297")}
                    textColor={colors.StrokePanel}
                  />
                  <StaticCard
                    icon={"Timer"}
                    backgroundColor={colors.StrokePanel}
                    data={this.state.weekStatic.time}
                    text={i18n.t("10ced895-7fa8-40cb-bc8a-b8880b6086b0")}
                    textColor={colors.white}
                  />
                </InfoCard>
              )}

              {!!this.state.meditationPopularDay ? (
                <InfoCard
                  title={i18n.t("bbb079ed-25a1-4360-a262-5c1ef0741cbf")}
                  subTitle={i18n.t("02d07c6c-dc56-4a58-93f0-c4d3acce43b7")}
                >
                  <MeditationCard
                    meditation={this.state.meditationPopularDay}
                    onPress={() =>
                      this.openMeditationPlayer(this.state.meditationPopularDay)
                    }
                  />
                </InfoCard>
              ) : (
                <ActivityIndicator color={colors.violet} size={"large"} />
              )}
            </ScrollView>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.props.isFocused != prevProps.isFocused) {
      if (!this.props.isFocused) {
        this.editActionAndroidButton(true);
      } else if (this.props.isFocused && this.state.isOpenMeditationListInfo) {
        this.editActionAndroidButton();
      }
    }
    if (prevState.heightGreeting != this.state.heightGreeting) {
      if (this.state.heightGreeting != undefined) {
        this.setState({
          borderRadiusMeditationListInfo:
            this.state.positionMeditationListInfo.interpolate({
              inputRange: [-(this.state.heightGreeting - 20), -20],
              outputRange: [0, 20],
            }),
        });
        this.setState({
          closeButtonMeditationListInfo:
            this.state.positionMeditationListInfo.interpolate({
              inputRange: [-(this.state.heightGreeting - 20), -20],
              outputRange: [
                0,
                styles.closeButton.right + styles.closeButton.width,
              ],
            }),
        });
      }
    }
    if (
      prevState.isOpenMeditationListInfo != this.state.isOpenMeditationListInfo
    ) {
      this.editActionAndroidButton(!this.state.isOpenMeditationListInfo);
    }
  }

  private editActionAndroidButton(isDelete?: boolean) {
    if (Platform.OS == "android") {
      if (isDelete) {
        this.state.backHandlerAndroidListener?.remove();
      } else {
        this.state.backHandlerAndroidListener?.remove();
        this.setState({
          backHandlerAndroidListener: BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
              this.hideMeditationListInfo();
              this.state.backHandlerAndroidListener?.remove();
              return true;
            }
          ),
        });
      }
    }
  }

  private get user(): UserModel {
    return this.state.user;
  }

  private showMeditationListInfo() {
    this.setState({ isOpenMeditationListInfo: true });
    if (!!this.state.heightGreeting) {
      Animated.timing(this.state.positionMeditationListInfo, {
        toValue: -this.state.heightGreeting,
        useNativeDriver: true,
      }).start();
    }
  }
  private hideMeditationListInfo() {
    if (!!this.state.heightGreeting) {
      Animated.timing(this.state.positionMeditationListInfo, {
        toValue: -20,
        useNativeDriver: true,
      }).start(() => {
        if (this.state.isActivate) {
          this.setState({ isOpenMeditationListInfo: false });
        }
      });
      this.state.refScrollVew.current?.scrollTo({ x: 0, y: 0, animated: true });
    }
  }
  componentDidMount() {
    this.setState({ isActivate: true });
    Meditation.getMeditationToDay().then(
      ({ meditationDay, meditationRecommend }) => {
        if (this.state.isActivate) {
          this.setState({
            meditationPopularDay: meditationDay,
            meditationPlan: meditationRecommend,
          });
        }
      }
    );

    Meditation.getParameters().then((parameters) => {
      if (this.state.isActivate) {
        if (!parameters) {
          this.setState({ isHavePlanMeditation: false });
        } else {
          this.setState({ isHavePlanMeditation: true });
        }
      }
    });
    this.setState({
      unSubscribe: [
        ...this.state.unSubscribe,
        this.props.accountInformation.on("editMood", (mood: UserMood) => {
          if (this.state.isActivate) {
            this.setState({ mood: mood });
          }
        }),
        Meditation.on("updateWeekStatic", (data) => {
          if (this.state.isActivate) [this.setState({ weekStatic: data })];
        }),
      ],
    });
  }

  componentWillUnmount() {
    this.setState({ isActivate: false });
    for (let unSubscribe of this.state.unSubscribe) {
      unSubscribe();
    }
  }

  private editPlanMeditation = () => {
    this.props.appController.editScreen("SelectionMeditationsParameters");
  };

  private openMeditationPlayer = (meditation: Meditation) => {
    this.props.appController.editScreen("Player", meditation);
  };
}

interface Props extends ScreenPropsWithUserData {}
interface State {
  user: UserModel;
  heightGreeting?: number;
  isOpenMeditationListInfo: boolean;
  meditationPopularDay?: Meditation;
  mood?: UserMood;
  meditationPlan?: Meditation;
  meditationDay?: Meditation;
  isHavePlanMeditation: boolean;
  weekStatic?: WeekStatistic;
  borderRadiusMeditationListInfo?: Animated.AnimatedInterpolation;
  closeButtonMeditationListInfo?: Animated.AnimatedInterpolation;
  refScrollVew: RefObject<ScrollView>;
  positionMeditationListInfo: Animated.Value;
  isActivate: boolean;
  backHandlerAndroidListener?: NativeEventSubscription;
  PanResponderMeditationListInfo: PanResponderInstance;
  unSubscribe: Array<() => void>;
}

const InfoCard: FC<
  {
    title: string;
    subTitle: string;
  } & ViewProps
> = (props) => (
  <View style={styles.infoCard} key={Math.random().toString()}>
    <Text style={styles.textTitle}>{props.title}</Text>
    <Text style={styles.textSubTitle}>{props.subTitle}</Text>
    <View style={props.style}>{props.children}</View>
  </View>
);

const StaticCard: FC<{
  icon: IconName;
  text: string;
  data: number;
  backgroundColor: ColorValue;
  textColor: ColorValue;
}> = (props) => (
  <View
    style={[
      styles.staticCardBackground,
      { backgroundColor: props.backgroundColor },
    ]}
  >
    <View style={{ flex: 1, alignItems: "center" }}>
      <Icon name={props.icon} style={styles.icon} />
      <Text style={[styles.staticCardText, { color: props.textColor }]}>
        {props.text}
      </Text>
    </View>
    <Text style={[styles.staticCardData, { color: props.textColor }]}>
      {props.data}
    </Text>
  </View>
);

const styles = StyleSheet.create({
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
    height: Dimensions.get("screen").height,
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
