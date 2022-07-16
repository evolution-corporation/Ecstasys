import React, { FC, useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import BackgroundGradient from "~containers/BackgroundGradient";
import i18n from "~i18n";
import style, { colors } from "~styles";
import Carousel from "react-native-snap-carousel";
import { getMeditationListByType } from "~api/meditation";
import { useFocusEffect } from "@react-navigation/native";
import MeditationCard from "~components/MeditationCard";
import ColorButton from "~components/ColorButton";

const MeditationPracticeListScreen: FC<
  TabNavigatorScreenProps<"Practices">
> = ({ navigation, route }) => {
  const { typeMeditation } = route.params;
  const [meditationList, setMeditationList] = useState<MeditationData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const refCarousel = useRef<Carousel<MeditationData>>(null);
  useFocusEffect(
    useCallback(() => {
      getMeditationListByType(typeMeditation).then((listMeditation) => {
        setMeditationList(listMeditation);
        setIsLoading(false);
      });
    }, [setMeditationList])
  );

  const meditationData: MeditationData | null = useMemo(() => {
    if (meditationList.length > 0)
      return meditationList[refCarousel.current?.currentIndex ?? 0];
    return null;
  }, [refCarousel.current?.currentIndex, meditationList]);

  return (
    <BackgroundGradient
      title={i18n.getTypeMeditation(typeMeditation)}
      isImage
      imageName={"leaves"}
      style={styles.background}
    >
      <Text style={styles.descriptionType}>
        {i18n.getTypeMeditationDescription(typeMeditation, "full")}
      </Text>

      {!isLoading && (
        <Carousel
          ref={refCarousel}
          data={meditationList}
          firstItem={Math.floor(setMeditationList.length / 2)}
          renderItem={({ item }: { item: MeditationData }) => (
            <MeditationCard
              type="compact"
              meditation={item}
              isBlocked={!item.permission}
            />
          )}
          itemWidth={Dimensions.get("window").width - 150}
          horizontal={true}
          sliderWidth={Dimensions.get("window").width}
          containerCustomStyle={styles.carouselStyle}
          sliderHeight={(Dimensions.get("window").width - 150) * 1.5}
          loop={true}
          inactiveSlideOpacity={0.9}
          inactiveSlideScale={0.7}
          layoutCardOffset={9}
          inactiveSlideShift={5}
        />
      )}
      <View style={styles.footerBackground}>
        <View style={styles.footerTopElement} />

        <View style={styles.footer}>
          {isLoading || meditationData == null ? (
            <ActivityIndicator color={colors.violet} size={"large"} />
          ) : (
            <>
              <View style={styles.informationMeditation}>
                <Text style={styles.name}>{meditationData.name}</Text>
                <Text style={styles.description}>
                  {meditationData.description}
                </Text>
              </View>
              <ColorButton
                text={i18n.t("38554780-274e-4802-9d07-fd4332c7a29d")}
                type={"fullWidth"}
                styleButton={styles.buttonStyle}
                styleText={styles.buttonStyleText}
                onPress={() =>
                  meditationData?.permission
                    ? navigation.navigate("MeditationListener", {
                        meditationID: meditationData.id,
                      })
                    : () => {}
                }
              />
            </>
          )}
        </View>
      </View>
    </BackgroundGradient>
  );
};

export default MeditationPracticeListScreen;

const styles = StyleSheet.create({
  descriptionType: {
    color: colors.WhiteBrightGlass,
    fontSize: 14,
    ...style.getFontOption("400"),
    textAlign: "center",
  },
  background: {
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  carouselStyle: {
    // height: (Dimensions.get("window").width - 150) * 1.09,
    flexGrow: 0,
    transform: [{ translateY: 100 }],
    zIndex: 2,
  },
  footer: {
    backgroundColor: colors.white,
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 60,
    zIndex: 0,
  },
  name: {
    color: colors.gray,
    fontSize: 24,
    ...style.getFontOption("700"),
    textAlign: "center",
  },
  description: {
    color: colors.DarkLetters,
    fontSize: 13,
    ...style.getFontOption("400"),
    textAlign: "center",
    width: "50%",
  },
  footerTopElement: {
    width: "200%",
    backgroundColor: colors.white,
    height: "200%",
    position: "absolute",
    zIndex: 0,
    transform: [{ translateX: -100 }, { translateY: -10 }, { rotateZ: "5deg" }],
  },
  footerBackground: {
    width: Dimensions.get("screen").width,
    height: "55%",
  },
  buttonStyle: {
    backgroundColor: colors.StrokePanel,
  },
  buttonStyleText: {
    color: colors.white,
  },
  informationMeditation: {
    transform: [{ translateY: 120 }],
  },
});
