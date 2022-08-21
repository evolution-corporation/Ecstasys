import React, { FC, useState } from "react";
import EditMeditationsParametersContexts from "~contexts/editMeditationsParameters";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Icon from "~assets/icons";
import ColorButton from "~components/ColorButton";
import BackgroundGradient from "~containers/BackgroundGradient";
import i18n from "~i18n";
import { colors, styleText } from "~styles";
import { useContext } from "react";

const Time: Time_ParameterMeditation[] = [
  "moreThan60Minutes",
  "moreThan15AndLessThan60Minutes",
  "lessThan15minutes",
];

const EditMeditationsParametersTimeScreen: FC<
  NativeStackScreenProps<EditMeditationsParametersList, "SelectTime">
> = ({ navigation }) => {
  const MeditationParams = useContext(EditMeditationsParametersContexts);

  const [time, setTime] = useState<Time_ParameterMeditation>(
    MeditationParams?.parametersMeditation.time ??
      "moreThan15AndLessThan60Minutes"
  );

  const editTime = (value: Time_ParameterMeditation) => {
    MeditationParams?.editParameters({ type: "SelectTime", payload: value });
    setTime(value);
    navigation.navigate("SelectType", { time });
  };

  return (
    <View style={styles.background}>
      <Icon name={"Timer"} style={styles.IconPart} />
      <Text style={styles.title}>
        {i18n.t("206ac2e0-788b-4541-a9b2-54c665bf3162")}
      </Text>
      <Text style={styles.info}>
        {i18n.t("8ad539b9-6da7-4229-a485-db446fde4825")}
      </Text>

      <View style={styles.buttonsContainer}>
        {Time.map((timeParam, index) => (
          <ColorButton
            type="small"
            text={i18n.getTime_ParameterMeditation(timeParam)}
            key={index.toString()}
            styleButton={[
              styles.buttonView,
              {
                backgroundColor:
                  timeParam == time ? colors.StrokePanel : colors.white,
              },
            ]}
            styleText={[
              styles.buttonText,
              {
                color: timeParam == time ? colors.white : colors.violet,
              },
            ]}
            onPress={() => {
              editTime(timeParam);
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default EditMeditationsParametersTimeScreen;

const styles = StyleSheet.create({
  background: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: colors.moreViolet,
    flex: 1,
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
});
