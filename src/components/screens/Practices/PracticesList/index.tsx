import React, { useMemo, useState } from "react";
import {
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  View,
  ScrollView,
  ImageSourcePropType,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";

import { DoubleColorView } from "~components/containers";
import Tools from "~core";
import { useCountMeditation } from "./hooks";
import type { PracticesCompositeScreenProps } from "~routes/index";
import { TypeMeditation } from "~modules/meditation/types";
import { useShowIntro } from "~routes/hook";
// import { useCountMeditation } from "./hooks";

const PracticesList: PracticesCompositeScreenProps = ({ navigation }) => {
  useShowIntro(
    "@IsFirstShownPractices",
    () => navigation.navigate("IntroPractices"),
    [navigation.isFocused()]
  );

  const [getPaddingTopFunc, setGetPaddingTopFunc] = useState<{
    f: (width: number) => number;
  } | null>(null);
  const [widthTitle, setWidthTitle] = useState<number | null>(null);

  const topPaddingContent = useMemo(() => {
    if (!getPaddingTopFunc || !widthTitle) return null;
    return getPaddingTopFunc.f(widthTitle);
  }, [getPaddingTopFunc, widthTitle]);

  return (
    <DoubleColorView
      onFunctionGetPaddingTop={(getPaddingTop) => {
        setGetPaddingTopFunc({ f: getPaddingTop });
      }}
      hideElementVioletPart
    >
      <ScrollView
        contentContainerStyle={[
          topPaddingContent
            ? { paddingTop: topPaddingContent, paddingBottom: 120 }
            : null,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[styles.title, styles.contentVerticalMargin]}
          onLayout={({ nativeEvent: { layout } }) => {
            if (!widthTitle) setWidthTitle(layout.width);
          }}
        >
          {Tools.i18n.t("db8e7216-be7c-4ecc-8ddd-0cf9ff83f419")}
        </Text>
        <FlatList
          data={CategoryMeditation}
          initialScrollIndex={0}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ width: 92 }}
              onPress={() => {
                navigation.navigate("SelectPractices", {
                  typeMeditation: item.id,
                });
              }}
            >
              <Image source={item.image} style={styles.imageSmall} />
              <Text style={styles.textNameSmall}>
                {Tools.i18n.t(item.name)}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => `${item.id}_small`}
          horizontal={true}
          ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
          inverted={true}
          style={{
            marginTop: 18,
            marginBottom: 49,
          }}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          showsHorizontalScrollIndicator={false}
        />
        {CategoryMeditation.map((item, index) => {
          const count = useCountMeditation(item.id);
          return (
            <TouchableOpacity
              style={[
                styles.backgroundNormal,
                index !== CategoryMeditation.length - 1
                  ? { marginBottom: 20 }
                  : null,
                styles.contentVerticalMargin,
              ]}
              key={`${item.id}_normall`}
              onPress={() =>
                navigation.navigate("SelectPractices", {
                  typeMeditation: item.id,
                })
              }
            >
              <Image source={item.image} style={styles.imageNormal} />
              <View style={styles.backgroundTextNormal}>
                <Text style={styles.textNameNormal}>
                  {Tools.i18n.t(item.name)}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.textDescription}>
                    {Tools.i18n.t(item.description)}
                  </Text>
                  <View style={{ alignItems: "center" }}>
                    <Feather name={"headphones"} size={25} color={"#FFFFFF"} />
                    <Text style={styles.countMeditation}>
                      {Tools.i18n.t("9790bd12-4b66-419f-a3e0-705134494734", {
                        count,
                      })}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </DoubleColorView>
  );
};

const styles = StyleSheet.create({
  imageSmall: {
    width: 92,
    height: 92,
    borderRadius: 10,
  },
  contentVerticalMargin: {
    marginHorizontal: 20,
  },
  title: {
    color: "rgba(112, 45, 135, 1)",
    fontSize: 24,
    ...Tools.gStyle.font("600"),
    alignSelf: "flex-start",
  },
  textNameSmall: {
    color: "rgba(112, 45, 135, 1)",
    fontSize: 12,
    textAlign: "center",
    ...Tools.gStyle.font("400"),
    marginTop: 9,
  },
  backgroundNormal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  imageNormal: {
    width: "100%",
    maxHeight: "100%",
  },
  textNameNormal: {
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: 24,
    ...Tools.gStyle.font("600"),
    marginBottom: 5,
  },
  backgroundTextNormal: {
    backgroundColor: "#9765A8",
    borderRadius: 20,
    minHeight: 119,
    paddingHorizontal: 20,
    paddingTop: 19,
    paddingBottom: 9,
    transform: [{ translateY: -20 }],
    marginBottom: -20,
  },
  textDescription: {
    fontSize: 13,
    lineHeight: 16,
    width: "70%",
    color: "#FFFFFF",
    ...Tools.gStyle.font("400"),
  },
  countMeditation: {
    fontSize: 12,
    color: "#FFFFFF",
    ...Tools.gStyle.font("400"),
  },
});

const CategoryMeditation: {
  name: string;
  image: ImageSourcePropType;
  description: string;
  id: TypeMeditation;
}[] = [
  {
    name: "71277706-2f5d-4ce8-bf26-d680176d3fb8",
    image: require("./assets/meditation1.png"),
    description: "ec0c8421-03d1-4755-956d-66a84d81d74a",
    id: "relaxation",
  },
  {
    name: "8566b563-b307-4943-ab52-d51c7e806a4c",
    image: require("./assets/meditation2.png"),
    description: "bb340c18-2a8b-4b7b-8250-80a865dca9b4",
    id: "directionalVisualizations",
  },
  {
    name: "c15d823e-8dd8-4eb7-b9f5-87c9845ac397",
    image: require("./assets/meditation3.png"),
    description: "c54bff96-21eb-4f10-8ad6-090e06f2eef9",
    id: "breathingPractices",
  },
  {
    name: "0d63a21e-eecc-45cc-9085-86b97c88d713",
    image: require("./assets/meditation4.png"),
    description: "ef09ec88-afda-4fef-b68b-02b433919e50",
    id: "basic",
  },
];

export default PracticesList;
