import React, { forwardRef, useImperativeHandle, useState, FC } from "react";
import {
  StyleSheet,
  Image,
  View,
  ImageStyle,
  TextStyle,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import ColorButton, {
  ColorButtonRef,
  createListSelectedUnique,
} from "~components/ColorButton";
import i18n from "~i18n";
import style, { colors } from "~styles";
import { useMood } from '../hook'

const SelectMoodScreen: FC<RootStackScreenProps<"SelectMood">> = ({
  navigation,
}) => {
  const { lastMood, addMood } = useMood()

  return (
    // @ts-ignore
    <View style={styles.background}>
      {/* @ts-ignore */}
      <View style={style.fullWidth}>
        <SelectedComponent
          initValue={lastMood ?? undefined}
          onChange={(mood: UserMood) => {
            addMood(mood)
          }}
        />
      </View>
      <ColorButton
        text={i18n.t("ready")}
        type={"small"}
        styleButton={styles.readyButton}
        styleText={styles.readyButtonText}
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

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

const styles = StyleSheet.create({
  background: {
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 24,
    paddingLeft: 55,
    alignItems: "center",
    paddingBottom: 75,
    backgroundColor: colors.moreViolet,
    flex: 1,
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

const data: [
  UserMood,
  { image: NodeRequire; fixImage: ViewStyle; fixText: ViewStyle }
][] = [
  [
    "IRRITATION",
    {
      image: require("~assets/vaultBoy.png"),
      fixImage: styles.fixImage1,
      fixText: styles.fixText1,
    },
  ],
  [
    "ANXIETY",
    {
      image: require("~assets/hourglassMan.png"),
      fixImage: styles.fixImage2,
      fixText: styles.fixText2,
    },
  ],
  [
    "HAPPINESS",
    {
      image: require("~assets/rainbowGirl.png"),
      fixImage: styles.fixImage3,
      fixText: styles.fixText3,
    },
  ],
  [
    "CONCENTRATION",
    {
      image: require("~assets/sleepwalker.png"),
      fixImage: styles.fixImage4,
      fixText: styles.fixText4,
    },
  ],
];

const SelectedComponent = createListSelectedUnique(
  VariableAnswer,
  data,
  (item, index = 0) => ({
    image: item[1].image,
    fixImage: item[1].fixImage,
    fixText: item[1].fixText,
    text: i18n.getMood(item[0], 1),
    isStart: index % 2 == 0,
  })
);

export default SelectMoodScreen;
