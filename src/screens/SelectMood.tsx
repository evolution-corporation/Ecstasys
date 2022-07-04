import React, {
  Component,
  ComponentRef,
  forwardRef,
  RefObject,
  useImperativeHandle,
  useState,
} from "react";
import {
  StyleSheet,
  Image,
  View,
  ActivityIndicator,
  ImageStyle,
  TextStyle,
  Text,
  TouchableOpacity,
} from "react-native";
import BackgroundGradient from "~components/BackgroundGradient";
import ColorButton, {
  ColorButtonRef,
  createListSelectedUnique,
} from "~components/ColorButton";
import { ScreenRef } from "~components/Screen";
import i18n from "~i18n";
import { UserAccount, UserMood } from "~models/User";
import style, { colors } from "~styles";

export default class SelectMoodScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true,
      isActivate: false,
    };
  }

  render() {
    let screenPart;
    if (this.state.isLoading) {
      screenPart = (
        <View style={styles.backgroundLoading}>
          <ActivityIndicator color={colors.white} size={"large"} />
        </View>
      );
    } else {
      screenPart = (
        <>
          <View style={style.fullWidth}>
            <SelectedComponent
              initValue={this.state.mood}
              onChange={(mood: UserMood) => this.setState({ mood })}
            />
          </View>
          <ColorButton
            text={i18n.t("ready")}
            type={"small"}
            styleButton={styles.readyButton}
            styleText={styles.readyButtonText}
            onPress={() => this.saveMood()}
          />
        </>
      );
    }
    return (
      <BackgroundGradient
        style={styles.background}
        isImage={true}
        imageName={"leaves"}
        name="SelectMood"
        isAnimation={true}
        ref={this.props.screenControl}
        zIndex={this.props.zIndex}
      >
        {screenPart}
      </BackgroundGradient>
    );
  }

  componentDidMount() {
    this.setState({
      isActivate: true,
      unSubscribeEditMood: this.props.accountInformation.on(
        "editMood",
        (mood: UserMood) => {
          if (this.state.isActivate) {
            this.setState({ mood: mood, isLoading: false });
          }
        }
      ),
    });
  }

  componentWillUnmount() {
    this.setState({ isActivate: false });
    if (this.state.unSubscribeEditMood) this.state.unSubscribeEditMood();
  }

  private saveMood() {
    if (this.state.mood) {
      this.props.accountInformation.editMood(this.state.mood);
    }
    this.props.appController.goBack();
  }
}

const VariableAnswer = forwardRef<
  ColorButtonRef,
  {
    text: string;
    onChange?: () => void;
    initValue?: boolean;
    image: any;
    isStart: boolean;
    fixImage?: ImageStyle;
    fixText?: TextStyle;
  }
>((props, ref) => {
  const { onChange = () => console.info("test") } = props;
  const [isSelected, setIsSelected] = useState<boolean>(
    props.initValue ?? false
  );
  useImperativeHandle(ref, () => ({
    select: () => setIsSelected(true),
    noSelect: () => setIsSelected(false),
  }));
  return (
    <TouchableOpacity
      style={[
        styles.variableAnswerBackground,
        { alignSelf: props.isStart ? "flex-start" : "flex-end" },
      ]}
      onPress={() => onChange()}
    >
      <Image source={props.image} style={[styles.image, props.fixImage]} />
      <Text
        style={[
          styles.variableAnswerButtonText,
          isSelected
            ? { color: colors.white, backgroundColor: colors.StrokePanel }
            : {},
        ]}
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  );
});

interface Props extends ScreenPropsWithUserData {}

interface State {
  mood?: UserMood;
  isLoading: boolean;
  isActivate: boolean;
  unSubscribeEditMood?: () => void;
}

const styles = StyleSheet.create({
  background: {
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 24,
    paddingLeft: 55,
    alignItems: "center",
    paddingBottom: 75,
  },
  readyButton: {
    backgroundColor: colors.violet,
    marginLeft: -50,
  },
  readyButtonText: {
    color: colors.white,
  },

  backgroundLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    position: "absolute",
    zIndex: 1,
    left: -75,
  },
  variableAnswerBackground: {
    flexDirection: "row",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  fixImage1: {
    transform: [{ translateY: 18 }, { translateX: 10 }],
  },
  fixImage2: {
    transform: [{ translateY: 5 }, { translateX: 0 }],
  },
  fixImage3: {
    transform: [{ translateY: 6 }, { translateX: 0 }],
  },
  fixImage4: {
    transform: [{ translateY: 6 }, { translateX: 0 }],
  },
  fixText1: {
    transform: [{ translateY: 15 }, { translateX: 0 }],
  },
  fixText2: {
    transform: [{ translateY: 5 }, { translateX: 0 }],
  },
  fixText3: {
    transform: [{ translateY: 6 }, { translateX: 0 }],
  },
  fixText4: {
    transform: [{ translateY: 6 }, { translateX: 0 }],
  },
  variableAnswerButtonText: {
    color: colors.violet,
    fontSize: 16,
    ...style.getFontOption("600"),
    backgroundColor: colors.white,
    height: 40,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    textAlign: "center",
    textAlignVertical: "center",
    minWidth: 160,
    paddingLeft: 55,
    paddingRight: 17,
  },
  variableAnswerButton: {
    paddingLeft: 50,
  },
});

const data = [
  {
    image: require("~assets/vaultBoy.png"),
    fixImage: styles.fixImage1,
    fixText: styles.fixText1,
  },
  {
    image: require("~assets/hourglassMan.png"),
    fixImage: styles.fixImage2,
    fixText: styles.fixText2,
  },

  {
    image: require("~assets/sleepwalker.png"),
    fixImage: styles.fixImage4,
    fixText: styles.fixText4,
  },
  {
    image: require("~assets/rainbowGirl.png"),
    fixImage: styles.fixImage3,
    fixText: styles.fixText3,
  },
];

const SelectedComponent = createListSelectedUnique(
  VariableAnswer,
  data,
  (item, index = 0) => ({
    image: item.image,
    fixImage: item.fixImage,
    fixText: item.fixText,
    text: i18n.t("ec2e50e0-0f79-42c2-bff3-b8fad59c12c8", {
      composite: {
        compositeIndex: index,
        composite: true,
      },
    }),
    isStart: index % 2 == 0,
  })
);
