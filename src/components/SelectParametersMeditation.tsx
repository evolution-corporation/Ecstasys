import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  Dimensions,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  AnimatedLayout,
} from "react-native-reanimated";
import Icon from "~assets/icons";
import ColorButton from "~components/ColorButton";
import i18n from "~i18n";
import gStyle, { colors, styleText } from "~styles";

const meditationType: TypeMeditation[] = [
  "RELAXATION",
  "DIRECTIONAL_VISUALIZATIONS",
  "BREATHING_PRACTICES",
  "DANCE_PSYCHOTECHNICS",
  "DMD",
];

const CountDay: CountDay_ParameterMeditation[] = [
  "6-7days",
  "4-5days",
  "2-3days",
];

const Time: Time_ParameterMeditation[] = [
  "moreThan60Minutes",
  "moreThan15AndLessThan60Minutes",
  "lessThan15minutes",
];

const IconAssociations: {
  [index in TypeMeditation]: ImageSourcePropType;
} = {
  BREATHING_PRACTICES: require("~assets/461ca5ef.png"), //461ca5ef-3db1-4499-a370-d445d6c9a40f
  DANCE_PSYCHOTECHNICS: require("~assets/d8d3b2b7.png"), //d8d3b2b7-8fa5-49d6-a606-346c4147a206
  DIRECTIONAL_VISUALIZATIONS: require("~assets/4649b151.png"), // 4649b151-3db1-4499-a370-d445d6c9a40f
  DMD: require("~assets/4649b151.png"), // 461ca5ef-3db1-4499-a370-d445d6c9a40f
  RELAXATION: require("~assets/395870f8.png"), // 395870f8-9738-423b-a712-6c423a182f3a
};

export type WidgetName =
  | "selectCountDay"
  | "selectCountTime"
  | "selectMeditationType"
  | null;

const initValue: ParametersMeditation = {
  countDay: "4-5days",
  time: "moreThan15AndLessThan60Minutes",
  type: ["RELAXATION"],
};

const SelectMeditationsParameters = forwardRef<Ref, Props>((props, ref) => {
  const {
    initParametersMeditation,
    onChange,
    onChangeWidget,
    style = {},
  } = props;
  const [widgetName, setWidgetName] = useState<WidgetName>("selectCountDay");
  const [countDay, setCountDay] = useState<CountDay_ParameterMeditation>(
    initParametersMeditation?.countDay ?? initValue.countDay
  );
  const [time, setTime] = useState<Time_ParameterMeditation>(
    initParametersMeditation?.time ?? initValue.time
  );
  const [typesMeditation, setTypesMeditation] = useState<TypeMeditation[]>(
    initParametersMeditation?.type ?? initValue.type
  );
  const editParams = function <T>(value: T) {
    const params = { countDay, time, type: typesMeditation };
    switch (widgetName) {
      case "selectCountDay":
        setCountDay(value as CountDay_ParameterMeditation);
        params.countDay = value as CountDay_ParameterMeditation;
        break;
      case "selectCountTime":
        setTime(value as Time_ParameterMeditation);
        params.time = value as Time_ParameterMeditation;
        break;
      case "selectMeditationType":
        setTypesMeditation(value as TypeMeditation[]);
        params.type = value as TypeMeditation[];
        break;
    }
    if (onChange) onChange(params);
  };

  useImperativeHandle(ref, () => ({
    changeWidget: setWidgetName,
    getParametersMeditation: () => ({ countDay, time, type: typesMeditation }),
  }));

  useEffect(() => {
    if (onChangeWidget) {
      onChangeWidget(widgetName);
    }
  }, [widgetName]);

  if (widgetName == "selectCountDay") {
    return (
      <Animated.View
        style={[styles.background, style]}
        entering={FadeIn.duration(700)}
        exiting={FadeOut.duration(700)}
        key={Math.random().toString()}
      >
        <Icon name={"Calendar"} style={styles.IconPart} />
        <Text style={styles.title}>
          {i18n.t("206ac2e0-788b-4541-a9b2-54c665bf3162")}
        </Text>
        <Text style={styles.info}>
          {i18n.t("8ad539b9-6da7-4229-a485-db446fde4825")}
        </Text>

        <View style={styles.buttonsContainer}>
          {CountDay.map((countDayParam) => (
            <ColorButton
              type="small"
              text={i18n.getCountDay_ParameterMeditation(countDayParam)}
              key={Math.random().toString()}
              styleButton={[
                styles.buttonView,
                {
                  backgroundColor:
                    countDay == countDayParam
                      ? colors.StrokePanel
                      : colors.white,
                },
              ]}
              styleText={[
                styles.buttonText,
                {
                  color:
                    countDay == countDayParam ? colors.white : colors.violet,
                },
              ]}
              onPress={() => {
                editParams(countDayParam);
              }}
            />
          ))}
        </View>
      </Animated.View>
    );
  }
  if (widgetName == "selectCountTime") {
    return (
      <Animated.View
        style={[styles.background, style]}
        entering={FadeIn.duration(700)}
        exiting={FadeOut.duration(700)}
        key={Math.random().toString()}
      >
        <Icon name={"Timer"} style={styles.IconPart} />
        <Text style={styles.title}>
          {i18n.t("9fb1fa8e-3a31-4d69-9029-6b734fcb416b")}
        </Text>
        <Text style={styles.info}>
          {i18n.t("8307f6df-0d0e-4d9f-bd05-e1893bf88cd1")}
        </Text>

        <View style={styles.buttonsContainer}>
          {Time.map((timeParam) => (
            <ColorButton
              type="small"
              text={i18n.getTime_ParameterMeditation(timeParam)}
              key={Math.random().toString()}
              styleButton={[
                styles.buttonView,
                {
                  backgroundColor:
                    time == timeParam ? colors.StrokePanel : colors.white,
                },
              ]}
              styleText={[
                styles.buttonText,
                {
                  color: time == timeParam ? colors.white : colors.violet,
                },
              ]}
              onPress={() => {
                editParams(timeParam);
              }}
            />
          ))}
        </View>
      </Animated.View>
    );
  }
  if (widgetName == "selectMeditationType") {
    return (
      <Animated.View
        style={[styles.background, style]}
        entering={FadeIn.duration(700)}
        exiting={FadeOut.duration(700)}
        key={Math.random().toString()}
      >
        <Text style={styles.title}>
          {i18n.t("005e12c3-a364-483b-b6e4-832258e74ea2")}
        </Text>
        <View style={styles.listTypeMeditation}>
          {meditationType.map((typeName) =>
            typeName == "DMD" && time != "moreThan60Minutes" ? null : (
              <ColorButton
                initValue={typesMeditation.includes(typeName)}
                type={"small"}
                icon={IconAssociations[typeName]}
                iconPosition={"top"}
                styleButton={styles.typeMeditationButton}
                styleText={styles.typeMeditationButtonText}
                text={i18n.getTypeMeditation(typeName)}
                iconStyle={styles.typeMeditationImageBackground}
                key={Math.random().toString()}
                isSwitch={true}
                buttonColorSelected={colors.StrokePanel}
                textColorSelected={colors.white}
                onPress={(result: boolean) => {
                  if (result && !typesMeditation.includes(typeName)) {
                    editParams([...typesMeditation, typeName]);
                  }
                  if (!result && typesMeditation.includes(typeName)) {
                    editParams([
                      ...typesMeditation.filter((item) => item != typeName),
                    ]);
                  }
                }}
              />
            )
          )}
        </View>
      </Animated.View>
    );
  }
  return null;
});

SelectMeditationsParameters.displayName = "SelectMeditationsParameters";

interface Ref {
  changeWidget: (widgetName: WidgetName) => void;
  getParametersMeditation: () => ParametersMeditation;
}

const widthButtonType = (Dimensions.get("window").width - 60) / 2;

const styles = StyleSheet.create({
  background: {
    alignItems: "center",
  },
  title: {
    ...styleText.h1,
    color: colors.white,
    marginBottom: 15,
    textAlign: "center",
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
  listTypeMeditation: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-around",
  },
  typeMeditationButton: {
    borderRadius: 20,
    width: widthButtonType,
    height: widthButtonType,
    alignItems: "center",
    alignSelf: "center",
    overflow: "hidden",
    marginVertical: 10,
    paddingBottom: 5,
  },

  typeMeditationButtonText: {
    color: colors.violet,
    fontSize: 16,
    ...gStyle.getFontOption("600"),
    textAlign: "center",
    textAlignVertical: "center",
    flex: 1,
  },
  IconPart: {
    marginBottom: 26,
  },

  typeMeditationImageBackground: {
    width: widthButtonType,
    height: (widthButtonType * 110) / 160,
    backgroundColor: colors.TextOnTheBackground,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});

export default SelectMeditationsParameters;

interface Props {
  onChange?: (parametersMeditation: ParametersMeditation) => void;
  initParametersMeditation?: ParametersMeditation;
  onChangeWidget?: (widgetName: WidgetName) => void;
  style?: ViewStyle | ViewStyle[];
}
