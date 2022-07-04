import React, {
  Component,
  ComponentRef,
  createRef,
  FC,
  RefObject,
} from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Icon from "~assets/icons";
import BackgroundGradient from "~components/BackgroundGradient";
import ColorButton from "~components/ColorButton";
import i18n from "~i18n";
import style, { colors, styleText } from "~styles";
import Meditation, {
  TypeMeditation,
  ParametersMeditation,
  NumberWeek,
  TimeDay,
} from "~models/Meditation";

const IconType: ["Leaf", "Rainbow", "Sun", "Puzzle", "Moon"] = [
  "Leaf",
  "Rainbow",
  "Sun",
  "Puzzle",
  "Moon",
];

export default class SelectionMeditationsParametersScreen extends Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      screenPart: ScreenPart.screenPart0,
      isLoading: true,
      isActivate: false,
    };
    setTimeout(() => {
      Meditation.getParameters().then((parameters) => {
        this.dispatch({ type: "InitParameters", payload: parameters });
      });
    }, 0);
  }

  render() {
    let screenPart = null;
    if (this.state.parametersMeditation && !this.state.isLoading) {
      switch (this.state.screenPart) {
        case ScreenPart.screenPart0:
          screenPart = (
            <SimlePart
              key={"Calendar"}
              type={"Calendar"}
              buttonText={[
                i18n.t("44e262f9-a725-4e49-b41b-65b5d1160bfc", {
                  composite: { compositeIndex: 0, composite: true },
                }),
                i18n.t("44e262f9-a725-4e49-b41b-65b5d1160bfc", {
                  composite: { compositeIndex: 1, composite: true },
                }),
                i18n.t("44e262f9-a725-4e49-b41b-65b5d1160bfc", {
                  composite: { compositeIndex: 2, composite: true },
                }),
              ]}
              subTitle={i18n.t("8ad539b9-6da7-4229-a485-db446fde4825")}
              title={i18n.t("206ac2e0-788b-4541-a9b2-54c665bf3162")}
              onChange={(payload) => {
                this.dispatch({ type: "EditDate", payload });
              }}
              selectData={this.state.parametersMeditation.countDay}
            />
          );
          break;
        case ScreenPart.screenPart1:
          screenPart = (
            <SimlePart
              key={"Timer"}
              type={"Timer"}
              buttonText={[
                i18n.t("9bdef135-ae1b-48eb-999e-188d7fe57dd5", {
                  composite: { compositeIndex: 0, composite: true },
                }),
                i18n.t("9bdef135-ae1b-48eb-999e-188d7fe57dd5", {
                  composite: { compositeIndex: 1, composite: true },
                }),
                i18n.t("9bdef135-ae1b-48eb-999e-188d7fe57dd5", {
                  composite: { compositeIndex: 2, composite: true },
                }),
              ]}
              title={i18n.t("9fb1fa8e-3a31-4d69-9029-6b734fcb416b")}
              subTitle={i18n.t("8307f6df-0d0e-4d9f-bd05-e1893bf88cd1")}
              onChange={(payload) => {
                this.dispatch({ type: "EditTime", payload });
              }}
              selectData={this.state.parametersMeditation.time}
            />
          );
          break;
        case ScreenPart.screenPart2:
          screenPart = (
            <>
              <Icon name={"ChartColumns"} style={styles.IconPart} />
              <Text style={styles.title}>
                {i18n.t("005e12c3-a364-483b-b6e4-832258e74ea2")}
              </Text>
              <View style={styles.listTypeMeditation}>
                {IconType.map((icon, index) => (
                  <ShowType
                    key={index}
                    index={index}
                    onPress={(value) => {
                      this.dispatch({
                        type: "EditTypeMeditation",
                        payload: {
                          status: value,
                          type: index,
                        },
                      });
                    }}
                    icon={icon}
                    initValue={this.state.parametersMeditation?.type.includes(
                      index
                    )}
                  />
                ))}
              </View>
            </>
          );
          break;
        case ScreenPart.screenPart3:
          screenPart = (
            <>
              <Icon
                name="CheckMarker"
                variable={"whiteThin"}
                style={styles.IconPart}
              />
              <Text style={styles.title}>{`${i18n.t("ready")}!\n\n${i18n.t(
                "225dcf1e-65b1-464d-87a3-9537a96a4093"
              )}`}</Text>
              <Text style={styles.info}>
                {i18n.t("b5bbd1d4-fcb3-478e-868f-51ce6db62978")}
              </Text>
            </>
          );
      }
    } else {
      screenPart = <ActivityIndicator color={colors.white} size={"large"} />;
    }

    return (
      <BackgroundGradient
        style={styles.background}
        isImage={true}
        imageName={"leaves"}
        isAnimation
        ref={this.props.screenControl}
        header={{
          title: i18n.t("19c4185d-f736-4a27-a441-6afef579b65a"),
          leftAction: () => {
            this.dispatch({ type: "PreviousPage" });
          },
        }}
        name="SelectionMeditations"
        zIndex={this.props.zIndex}
      >
        {screenPart}
        {!this.state.isLoading &&
          this.state.screenPart >= ScreenPart.screenPart2 && (
            <ColorButton
              type="small"
              styleButton={styles.readyButton}
              styleText={styles.readyButtonText}
              text={i18n.t("ready")}
              onPress={() => this.dispatch({ type: "NextAction" })}
            />
          )}
      </BackgroundGradient>
    );
  }

  private dispatch(action: Action) {
    const state = { ...this.state };
    if (
      action.type != "EditTypeMeditation" &&
      state.screenPart != ScreenPart.screenPart3
    ) {
      this.props.screenControl.current?.setNextContentUpdateWithAnimation();
    }
    switch (action.type) {
      case "InitParameters":
        state.parametersMeditation = action.payload;
        state.isLoading = false;
        break;
      case "EditDate":
        if (state.parametersMeditation) {
          state.parametersMeditation.countDay = action.payload;
          state.screenPart = ScreenPart.screenPart1;
        }
        break;
      case "EditTime":
        if (state.parametersMeditation) {
          state.parametersMeditation.time = action.payload;
          state.screenPart = ScreenPart.screenPart2;
        }
        break;

      case "EditTypeMeditation":
        if (state.parametersMeditation) {
          const indexType = state.parametersMeditation.type.indexOf(
            action.payload.type
          );
          if (action.payload.status && indexType == -1) {
            state.parametersMeditation.type.push(action.payload.type);
          } else if (!action.payload.status && indexType != -1) {
            state.parametersMeditation.type.slice(indexType, 1);
          }
        }
        break;
      case "NextAction":
        if (state.screenPart == ScreenPart.screenPart2) {
          this.saveMeditationParameters();
          state.screenPart = ScreenPart.screenPart3;
        } else if (state.screenPart == ScreenPart.screenPart3) {
          this.props.appController.goBack();
        }
        break;
      case "PreviousPage":
        if (
          state.screenPart != ScreenPart.screenPart0 &&
          state.isLoading == false
        ) {
          state.screenPart = state.screenPart - 1;
        } else {
          this.props.appController.goBack();
        }
    }
    this.setState(state);
  }

  private async saveMeditationParameters() {
    if (this.state.parametersMeditation) {
      await Meditation.saveParameters(this.state.parametersMeditation);
    }
  }

  componentDidMount() {
    this.setState({ isActivate: true });
  }

  componentWillUnmount() {
    this.setState({ isActivate: false });
  }
}

interface Props extends ScreenProps {}

interface State {
  screenPart: ScreenPart;
  parametersMeditation?: ParametersMeditation;
  isLoading: boolean;
  isActivate: boolean;
}

enum ScreenPart {
  screenPart0,
  screenPart1,
  screenPart2,
  screenPart3,
}

const SimlePart: FC<PropsSimplePart> = (props) => (
  <>
    <Icon name={props.type} style={styles.IconPart} />
    <Text style={styles.title}>{props.title}</Text>
    <Text style={styles.info}>{props.subTitle}</Text>
    <View style={styles.buttonsContainer}>
      {props.buttonText.map((text, index) => (
        <ColorButton
          type="small"
          text={text}
          key={index.toString()}
          styleButton={[
            styles.buttonView,
            {
              backgroundColor:
                props.selectData == index ? colors.StrokePanel : colors.white,
            },
          ]}
          styleText={[
            styles.buttonText,
            { color: props.selectData == index ? colors.white : colors.violet },
          ]}
          onPress={() => props.onChange(index)}
        />
      ))}
    </View>
  </>
);

const ShowType: FC<{
  index: number;
  onPress: (value: boolean) => void;
  initValue?: boolean;
  icon: "Sun" | "Puzzle" | "Leaf" | "Rainbow" | "Moon";
}> = (props) => (
  <ColorButton
    type="small"
    onPress={props.onPress}
    text={i18n.t("47ad96b2-f503-4ef1-ac63-649e4c6a018e", {
      composite: { composite: true, compositeIndex: props.index },
    })}
    isSwitch
    iconPosition="top"
    styleButton={[
      styles.typeMeditationButton,
      props.index != 4
        ? props.index % 2 == 0
          ? styles.typeMeditationButtonLeft
          : styles.typeMeditationButtonRight
        : {},
      props.index == 2 || props.index == 3
        ? styles.typeMeditationButtonCenter
        : {},
    ]}
    styleText={styles.typeMeditationButtonText}
    initValue={props.initValue}
    icon={props.icon}
  />
);

interface PropsSimplePart {
  type: "Calendar" | "Timer";
  title: string;
  subTitle: string;
  buttonText: [string, string, string];
  onChange: (variableType: number) => void;
  selectData: number;
}

const styles = StyleSheet.create({
  background: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...styleText.h1,
    color: colors.white,
    marginBottom: 15,
  },
  info: {
    ...styleText.helpMessage,
    marginBottom: 15,
  },
  buttonsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 9,
  },
  buttonView: {
    borderRadius: 10,
    flexGrow: 1,
    height: 60,
    marginHorizontal: 9,
  },
  buttonText: {
    textAlign: "center",
  },
  typeMeditationButton: {
    width: 160,
    height: 100,
    borderRadius: 20,
  },
  typeMeditationButtonLeft: {
    marginRight: 7.5,
  },
  typeMeditationButtonRight: {
    marginLeft: 7.5,
  },
  typeMeditationButtonCenter: {
    marginVertical: 15,
  },
  listTypeMeditation: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    padding: -7.5,
  },
  typeMeditationButtonText: {
    color: colors.violet,
    fontSize: 16,
    ...style.getFontOption("600"),
  },
  IconPart: {
    marginBottom: 26,
  },
  readyButton: {
    backgroundColor: colors.violet,
    position: "absolute",
    bottom: 80,
  },
  readyButtonText: {
    color: colors.white,
  },
});

type Action =
  | ActionReducerWithPayload<"InitParameters", ParametersMeditation>
  | ActionReducerWithPayload<"EditDate", NumberWeek>
  | ActionReducerWithPayload<"EditTime", TimeDay>
  | ActionReducerWithPayload<
      "EditTypeMeditation",
      { type: TypeMeditation; status: boolean }
    >
  | ActionReducerNoWithPayload<"NextAction">
  | ActionReducerNoWithPayload<"PreviousPage">;
