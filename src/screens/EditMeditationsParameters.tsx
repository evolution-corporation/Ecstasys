import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { ElementRef, FC, useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import BackgroundGradient from "~containers/BackgroundGradient";
import { useAppDispatch, useAppSelector } from "~store/index";
import {
  editParametersMeditation,
  removeParametersMeditation,
} from "~store/meditation";
import style, { colors, styleText } from "~styles";
import SelectMeditationsParameters, {
  WidgetName,
} from "~components/SelectParametersMeditation";
import { TextButton } from "~components/ColorButton";
import i18n from "~i18n";
import { useCallback } from "react";

const EditMeditationsParametersScreen: FC<
  NativeStackScreenProps<RootStackParamList, "EditMeditationsParameters">
> = ({ navigation }) => {
  const refSelectMeditationsParameters =
    useRef<ElementRef<typeof SelectMeditationsParameters>>(null);
  const [widgetName, setWidgetName] = useState<WidgetName | null>(
    "selectCountDay"
  );
  const dispatch = useAppDispatch();
  const globalParametersMeditation = useAppSelector(
    (state) => state.meditation.parametersMeditation
  );
  const globalParametersMeditationStatus = useAppSelector(
    (state) => state.meditation.parametersMeditationStatus
  );
  const setParametersMeditation = (
    parametersMeditation: ParametersMeditation
  ) => {
    switch (widgetName) {
      case "selectCountDay":
        setWidgetName("selectCountTime");
        refSelectMeditationsParameters.current?.changeWidget("selectCountTime");
        break;
      case "selectCountTime":
        setWidgetName("selectMeditationType");
        refSelectMeditationsParameters.current?.changeWidget(
          "selectMeditationType"
        );
        break;
    }
    dispatch(editParametersMeditation(parametersMeditation));
  };
  useEffect(() => {
    navigation.addListener("beforeRemove", (event) => {
      event.preventDefault();
      console.log(event);
      // setWidgetName("selectCountDay");
      navigation.dispatch(event.data.action);
      console.log("test");
      // switch (widgetName) {
      //   case "selectCountTime":

      //     break;
      //   case "selectMeditationType":
      //     event.preventDefault();
      //     setWidgetName("selectCountTime");
      //     break;
      //   default:
      //     return;
      // }
    });
  }, [navigation, widgetName]);

  return (
    <BackgroundGradient
      style={styles.background}
      isImage={true}
      imageName={"leaves"}
      title={i18n.t("b18185ed-887d-4946-9bce-3daf791828ae")}
    >
      {globalParametersMeditationStatus && (
        <SelectMeditationsParameters
          ref={refSelectMeditationsParameters}
          initParametersMeditation={globalParametersMeditation}
          onChange={(parametersMeditation) =>
            setParametersMeditation(parametersMeditation)
          }
        />
      )}
      {widgetName == "selectCountDay" &&
        globalParametersMeditationStatus == "exist" && (
          <TextButton
            text={i18n.t("9544e064-49ec-4b2d-aac1-8e2d961d9f0a")}
            styleText={styles.removeParameters}
            onPress={() => {
              dispatch(removeParametersMeditation());
            }}
          />
        )}
    </BackgroundGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
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
  readyButton: {
    backgroundColor: colors.violet,
    position: "absolute",
    bottom: "5%",
  },
  readyButtonText: {
    color: colors.white,
  },
  removeParameters: {
    marginTop: 26,
  },
});

export default EditMeditationsParametersScreen;
