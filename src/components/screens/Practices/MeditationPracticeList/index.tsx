import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Carousel from "react-native-snap-carousel";

import Tools from "~core";

import { MeditationType } from "~modules/meditation";
import { ColorButton } from "~components/dump";
import { DoubleColorView } from "~components/containers";

import { useMeditationListForType } from "./hooks";
import { CarouselMeditation } from "./components";

const MeditationPracticeListScreen = ({
  route = { params: { typeMeditation: "" } },
}) => {
  const { typeMeditation } = route.params;
  const { IsLoading, ListMeditation } =
    useMeditationListForType(typeMeditation);

  return (
    <DoubleColorView style={styles.background} heightViewPart={160}>
      <Text style={styles.descriptionType}>{Tools.i18n.t(typeMeditation)}</Text>

      {!IsLoading && (
        <CarouselMeditation
          data={ListMeditation}
          widthComponent={254}
          style={styles.carouselMeditation}
        />
      )}
    </DoubleColorView>
  );
};

export default MeditationPracticeListScreen;

const styles = StyleSheet.create({
  descriptionType: {
    fontSize: 14,
    ...Tools.gStyle.font("400"),
    textAlign: "center",
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
});
