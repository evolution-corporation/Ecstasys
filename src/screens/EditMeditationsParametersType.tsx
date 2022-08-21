import React, { FC, useState } from "react";
import EditMeditationsParametersContexts from "~contexts/editMeditationsParameters";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageSourcePropType,
} from "react-native";
import ColorButton from "~components/ColorButton";
import BackgroundGradient from "~containers/BackgroundGradient";
import i18n from "~i18n";
import style, { colors, styleText } from "~styles";
import { useContext } from "react";

const widthButtonType = (Dimensions.get("window").width - 60) / 2;

const meditationType: TypeMeditation[] = [
  "relaxation",
  "directionalVisualizations",
  "breathingPractices",
  "dancePsychotechnics",
  "DMD",
];
const IconAssociations: {
  [index in TypeMeditation]: ImageSourcePropType;
} = {
  breathingPractices: require("~assets/461ca5ef.png"), //461ca5ef-3db1-4499-a370-d445d6c9a40f
  dancePsychotechnics: require("~assets/d8d3b2b7.png"), //d8d3b2b7-8fa5-49d6-a606-346c4147a206
  directionalVisualizations: require("~assets/4649b151.png"), // 4649b151-3db1-4499-a370-d445d6c9a40f
  DMD: require("~assets/4649b151.png"), // 461ca5ef-3db1-4499-a370-d445d6c9a40f
  relaxation: require("~assets/395870f8.png"), // 395870f8-9738-423b-a712-6c423a182f3a
};
const EditMeditationsParametersTypeScreen: FC<
  NativeStackScreenProps<EditMeditationsParametersList, "SelectType">
> = ({ navigation, route }) => {
  const MeditationParams = useContext(EditMeditationsParametersContexts);
  const [typesMeditation, setTypesMeditation] = useState<TypeMeditation[]>(
    MeditationParams?.parametersMeditation.type ?? []
  );
  const editType = (value: TypeMeditation, select: boolean) => {
    if (select && !typesMeditation.includes(value)) {
      MeditationParams?.editParameters({ type: "addType", payload: value });
      setTypesMeditation([...typesMeditation, value]);
    }
    if (!select && typesMeditation.includes(value)) {
      MeditationParams?.editParameters({ type: "removeType", payload: value });
      setTypesMeditation([...typesMeditation.filter((item) => value != item)]);
    }
  };

  const saveParameter = () => {
    MeditationParams?.saveParameter();
    navigation.navigate("ScreenFinallyResult", { result: true });
  };

  return (
    <View style={styles.background}>
      <Text style={styles.title}>
        {i18n.t("005e12c3-a364-483b-b6e4-832258e74ea2")}
      </Text>
      <View style={styles.listTypeMeditation}>
        {meditationType.map((typeName, index) =>
          typeName == "DMD" &&
          MeditationParams?.parametersMeditation.time !=
            "moreThan60Minutes" ? null : (
            <ColorButton
              initValue={typesMeditation.includes(typeName)}
              type={"small"}
              icon={IconAssociations[typeName]}
              iconPosition={"top"}
              styleButton={styles.typeMeditationButton}
              styleText={styles.typeMeditationButtonText}
              text={i18n.getTypeMeditation(typeName)}
              iconStyle={styles.typeMeditationImageBackground}
              key={index.toString()}
              isSwitch={true}
              buttonColorSelected={colors.StrokePanel}
              textColorSelected={colors.white}
              onPress={(result: boolean) => {
                editType(typeName, result);
              }}
            />
          )
        )}
      </View>
      <ColorButton
        text={i18n.t("ready")}
        styleButton={styles.buttonReady}
        styleText={styles.buttonTextReady}
        type={"small"}
        onPress={() => saveParameter()}
      />
    </View>
  );
};

export default EditMeditationsParametersTypeScreen;

const styles = StyleSheet.create({
  background: {
    alignItems: "center",
    paddingHorizontal: 0,
    backgroundColor: colors.moreViolet,
    flex: 1,
  },
  title: {
    ...styleText.h1,
    color: colors.white,
    marginBottom: 15,
    textAlign: "center",
    marginHorizontal: 10,
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
    ...style.getFontOption("600"),
    textAlign: "center",
    textAlignVertical: "center",
    flex: 1,
  },
  typeMeditationImageBackground: {
    width: widthButtonType,
    height: (widthButtonType * 110) / 160,
    backgroundColor: colors.TextOnTheBackground,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  buttonReady: {
    backgroundColor: colors.violet,
  },
  buttonTextReady: {
    color: colors.white,
  },
});
