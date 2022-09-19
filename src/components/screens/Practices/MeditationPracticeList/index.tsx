import React, { useEffect, useState } from "react";
import { Text, StyleSheet, useWindowDimensions } from "react-native";

import Tools from "~core";

import {
  DescriptionMeditationCategory,
  MeditationType,
} from "~modules/meditation";
import { ColorButton } from "~components/dump";
import { DoubleColorView } from "~components/containers";

import { useMeditationListForType } from "./hooks";
import { CarouselMeditation } from "./components";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { RootScreenProps } from "~routes/index";

const MeditationPracticeList: RootScreenProps<"SelectPractices"> = ({
  route,
  navigation,
}) => {
  const { typeMeditation } = route.params;
  const { height } = useWindowDimensions();
  const [selectedMeditation, setSelectedMeditation] =
    useState<MeditationType | null>(null);
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const opacityButton = useSharedValue(1);
  const aStyle = {
    button: useAnimatedStyle(() => ({
      opacity: withTiming(opacityButton.value),
    })),
  };
  const { IsLoading, ListMeditation } =
    useMeditationListForType(typeMeditation);

  useEffect(() => {
    opacityButton.value = disableButton ? 0.5 : 1;
  }, [disableButton]);

  return (
    <DoubleColorView
      style={styles.background}
      heightViewPart={height / 2 - 100}
    >
      <ColorButton
        animationStyle={aStyle.button}
        styleButton={styles.buttonInstruction}
        styleText={styles.buttonTextInstruction}
        disabled={disableButton}
        colors={["#75348B", "#6A2382"]}
      >
        {Tools.i18n.t("ce174d00-e4df-42f3-bb19-82ed6c987750")}
      </ColorButton>
      <Text style={styles.descriptionType}>
        {Tools.i18n.t(
          DescriptionMeditationCategory[route.params.typeMeditation].text
        )}
      </Text>
      {!IsLoading && (
        <CarouselMeditation
          data={ListMeditation}
          widthComponent={254}
          style={styles.carouselMeditation}
          onChange={(meditation, status) => {
            if (!status) {
              setSelectedMeditation(meditation);
            }
            setDisableButton(status);
          }}
        />
      )}
      <ColorButton
        animationStyle={aStyle.button}
        styleButton={styles.button}
        styleText={styles.buttonText}
        disabled={disableButton}
        onPress={() => {
          if (selectedMeditation !== null) {
            navigation.navigate("ListenMeditation", {
              meditationId: selectedMeditation.id,
              typeMeditation,
            });
          }
        }}
      >
        {Tools.i18n.t("1a2b0df6-fa67-4f71-8fd4-be1f0a576439")}
      </ColorButton>
    </DoubleColorView>
  );
};

export default MeditationPracticeList;

const styles = StyleSheet.create({
  descriptionType: {
    fontSize: 14,
    ...Tools.gStyle.font("400"),
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 17,
    marginTop: 30,
  },
  background: {
    paddingHorizontal: 20,
    justifyContent: "space-between",
    flex: 1,
  },
  carouselMeditation: {
    marginHorizontal: -20,
  },

  buttonStyle: {},
  buttonStyleText: {},
  informationMeditation: {
    transform: [{ translateY: 120 }],
  },
  button: {
    backgroundColor: "#C2A9CE",
    borderRadius: 15,
    width: "100%",
    height: 45,
    marginBottom: 80,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  buttonInstruction: {
    width: "auto",
    alignSelf: "center",
    paddingHorizontal: 34,
  },
  buttonTextInstruction: {
    color: "#FFFFFF",
    fontSize: 13,
    ...Tools.gStyle.font("600"),
  },
});
