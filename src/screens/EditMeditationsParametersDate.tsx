import React, { FC, useState } from "react";
import EditMeditationsParametersContexts from "~contexts/editMeditationsParameters";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, Text, StyleSheet } from "react-native";
import Icon from "~assets/icons";
import ColorButton, { TextButton } from "~components/ColorButton";
import BackgroundGradient from "~containers/BackgroundGradient";
import i18n from "~i18n";
import { colors, styleText } from "~styles";
import { useContext } from "react";
import { useAppDispatch, useAppSelector } from "~store/index";
import { removeParametersMeditation } from "~store/meditation";
import { useEffect } from "react";

const CountDay: CountDay_ParameterMeditation[] = [
  "6-7days",
  "4-5days",
  "2-3days",
];

const EditMeditationsParametersDateScreen: FC<
  NativeStackScreenProps<EditMeditationsParametersList, "SelectDate">
> = ({ navigation, route }) => {
  const parametersMeditationStatus = useAppSelector(
    (state) => state.meditation.parametersMeditationStatus
  );
  const MeditationParams = useContext(EditMeditationsParametersContexts);
  const [countDay, setCountDay] = useState<CountDay_ParameterMeditation>(
    MeditationParams?.parametersMeditation.countDay ?? "4-5days"
  );

  const editDay = (value: CountDay_ParameterMeditation) => {
    MeditationParams?.editParameters({ type: "SelectDate", payload: value });
    setCountDay(value);
    navigation.navigate("SelectTime");
  };

  const removeParameters = () => {
    MeditationParams?.removeParameters();
    navigation.navigate("ScreenFinallyResult", { result: false });
  };

  return (
    <BackgroundGradient
      isImage={true}
      imageName={"leaves"}
      style={styles.background}
    >
      <Icon name={"Calendar"} style={styles.IconPart} />
      <Text style={styles.title}>
        {i18n.t("206ac2e0-788b-4541-a9b2-54c665bf3162")}
      </Text>
      <Text style={styles.info}>
        {i18n.t("8ad539b9-6da7-4229-a485-db446fde4825")}
      </Text>

      <View style={styles.buttonsContainer}>
        {CountDay.map((countDayParam, index) => (
          <ColorButton
            type="small"
            text={i18n.getCountDay_ParameterMeditation(countDayParam)}
            key={index.toString()}
            styleButton={[
              styles.buttonView,
              {
                backgroundColor:
                  countDay == countDayParam ? colors.StrokePanel : colors.white,
              },
            ]}
            styleText={[
              styles.buttonText,
              {
                color: countDay == countDayParam ? colors.white : colors.violet,
              },
            ]}
            onPress={() => {
              editDay(countDayParam);
            }}
          />
        ))}
      </View>
      {"exist" == parametersMeditationStatus ? (
        <TextButton
          text={i18n.t("9544e064-49ec-4b2d-aac1-8e2d961d9f0a")}
          styleText={styles.delButtonText}
          onPress={() => removeParameters()}
        />
      ) : null}
    </BackgroundGradient>
  );
};

export default EditMeditationsParametersDateScreen;

const styles = StyleSheet.create({
  background: {
    alignItems: "center",
    justifyContent: "center",
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
  IconPart: {
    marginBottom: 26,
  },
  delButtonText: {
    color: colors.white,
    marginTop: 25,
  },
});
