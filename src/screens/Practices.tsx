import React, { FC } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ImageSourcePropType,
  TouchableOpacity,
  Image,
} from "react-native";
import UserInformation from "~components/UserInformation";
import BackgroundGradient from "~containers/BackgroundGradient";
import i18n from "~i18n";
import { useAppSelector } from "~store";
import style, { colors } from "~styles";

const meditationType: PracticesMeditation[] = [
  "relaxation",
  "directionalVisualizations",
  "breathingPractices",
  "dancePsychotechnics",
];
const IconAssociations: {
  [index in PracticesMeditation]: ImageSourcePropType;
} = {
  breathingPractices: require("~assets/461ca5ef.png"), //461ca5ef-3db1-4499-a370-d445d6c9a40f
  dancePsychotechnics: require("~assets/d8d3b2b7.png"), //d8d3b2b7-8fa5-49d6-a606-346c4147a206
  directionalVisualizations: require("~assets/4649b151.png"), // 4649b151-3db1-4499-a370-d445d6c9a40f
  relaxation: require("~assets/395870f8.png"), // 395870f8-9738-423b-a712-6c423a182f3a
};

const PracticesScreen: FC<TabNavigatorScreenProps<"Practices">> = ({
  navigation,
}) => {
  const userData = useAppSelector((store) => store.account.user);

  return (
    <View style={styles.background}>
      <ScrollView
        style={styles.backgroundScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pseudoHeader}>
          <Text style={styles.title}>
            {i18n.t("c08bb9d1-1769-498e-acf5-8c37c18bed05")}
          </Text>
          {userData && <UserInformation type="small" user={userData} />}
        </View>
        {meditationType.map((typeMeditation) => (
          <TouchableOpacity
            key={typeMeditation}
            style={styles.viewType}
            onPress={() => {
              navigation.navigate("MeditationPracticeList", {
                typeMeditation,
              });
            }}
          >
            <Image
              source={IconAssociations[typeMeditation]}
              resizeMethod="resize"
              resizeMode="stretch"
              style={styles.imageType}
            />
            <Text style={styles.name}>
              {i18n.getTypeMeditation(typeMeditation)}
            </Text>
            <Text style={styles.description}>
              {i18n.getTypeMeditationDescription(typeMeditation)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default PracticesScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: colors.moreViolet,
    flex: 1,
  },
  backgroundScroll: {
    paddingHorizontal: 20,
    width: Dimensions.get("window").width,
  },
  title: {
    fontSize: 20,
    color: colors.white,
    ...style.getFontOption("bold"),
  },
  pseudoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  viewType: {
    alignItems: "center",
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: "hidden",
    paddingBottom: 25,
    marginVertical: 10,
  },
  name: {
    color: colors.violet,
    fontSize: 20,
    ...style.getFontOption("600"),
    marginHorizontal: 10,
    textAlign: "center",
  },
  description: {
    color: colors.StrokePanel,
    fontSize: 14,
    ...style.getFontOption("400"),
    marginHorizontal: 10,
    textAlign: "center",
  },
  imageType: {
    width: "100%",
    height: 246,
    paddingTop: 10,
    backgroundColor: colors.TextOnTheBackground,
    borderRadius: 20,
  },
});
