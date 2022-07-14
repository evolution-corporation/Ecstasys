import React, { FC, useMemo, useReducer, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import BackgroundGradient from "~containers/BackgroundGradient";
import Logo from "~assets/icons/LogoApp.svg";
import i18n from "~i18n";
import Swiper from "react-native-swiper/src";
import style, { colors } from "~styles";
import ColorButton from "~components/ColorButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type ElementName = "CarouselText" | "Title" | "Logo";

function useHeightElement(): {
  heightElement: number;
  editHeight: (height: number, type: ElementName) => void;
} {
  const [heightLogo, setHeightLogo] = useState<number>(80);
  const [heightText, setHeightText] = useState<number>(72);
  const [heightTitle, setHeightTitle] = useState<number>(72);

  const editHeight = (height: number, type: ElementName) => {
    switch (type) {
      case "Logo":
        setHeightLogo(height);
        break;
      case "Title":
        setHeightTitle(height);
        break;
      case "CarouselText":
        if (heightText < height) {
          setHeightText(height);
        }
        break;
    }
  };

  const heightElement = useMemo(
    () => heightLogo + heightText + heightTitle + 70,
    [heightLogo, heightText, heightTitle]
  );

  return { editHeight, heightElement };
}

const SelectMethodAuthentication: FC<
  NativeStackScreenProps<
    AuthorizationStackParamList,
    "SelectMethodAuthentication"
  >
> = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { heightElement, editHeight } = useHeightElement();
  return (
    <BackgroundGradient
      isImage={true}
      imageName={"sea"}
      style={styles.background}
    >
      <View style={[styles.centralInfo, { height: heightElement }]}>
        <Logo
          onLayout={({ nativeEvent: { layout } }) => {
            editHeight(layout.height, "Logo");
          }}
        />
        <Text
          style={styles.title}
          onLayout={({ nativeEvent: { layout } }) => {
            editHeight(layout.height, "Title");
          }}
        >
          {i18n.t("ff867b49-717d-4611-a2b2-22349439f76f")}
        </Text>
        <Swiper
          horizontal={true}
          loop={true}
          autoplay={true}
          width={width}
          containerStyle={styles.swiperStyle}
          dotColor={"#816EBD"}
          activeDotColor={"#FFFFFF"}
          showsPagination={true}
          autoplayTimeout={10}
        >
          {[
            i18n.t("2c4c4afe-0269-4eea-980b-8d73963b8d35"),
            "text 2",
            "text, 3",
            "text 4",
          ].map((item, index) => (
            <View
              key={index.toString()}
              style={{
                width: 250,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <Text
                style={styles.textCarousel}
                onLayout={({ nativeEvent: { layout } }) => {
                  editHeight(layout.height, "CarouselText");
                }}
              >
                {item}
              </Text>
            </View>
          ))}
        </Swiper>
      </View>
      <View style={styles.selectMethod}>
        <ColorButton
          type="fullWidth"
          text={i18n.t("526fba9f-2b69-4fe6-aefd-d491e86e59da")}
          styleButton={styles.buttonSelect}
          onPress={() => navigation.navigate("AuthorizationByPhone")}
        />
        <ColorButton
          type="fullWidth"
          icon={"Google"}
          text={i18n.t("235a94d8-5deb-460a-bf03-e0e30e93df1b")}
          styleButton={styles.buttonSelect}
        />
        <Text style={styles.textDocument} adjustsFontSizeToFit>
          {`${i18n.t("4e5aa2a6-29db-44bc-8cf3-96e1ce338442")} `}
          <Text
            onPress={() => console.log("open browser")}
            style={styles.textDocumentBold}
          >
            {i18n.getLegalDocument("privacyPolicy")}
          </Text>
          {` ${i18n.t("and")} `}

          <Text
            onPress={() => console.log("open browser")}
            style={styles.textDocumentBold}
          >
            {i18n.getLegalDocument("userAgreement")}
          </Text>
          {` ecstasys`}
        </Text>
      </View>
    </BackgroundGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    justifyContent: "flex-end",
    paddingHorizontal: 20,
  },
  swiperStyle: {
    height: 300,
  },
  textCarousel: {
    color: "#FFFFFF",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 16,
    ...style.getFontOption("400"),
  },
  centralInfo: {
    // position: "absolute",
    // bottom: "40%",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: 250,
    marginBottom: 50,
  },
  title: {
    width: 250,
    marginTop: 20,
    marginBottom: 11,
    fontSize: 24,
    color: colors.white,
    ...style.getFontOption("bold"),
    textAlign: "center",
  },
  selectMethod: {
    width: "100%",
  },
  buttonSelect: {
    marginVertical: 5,
  },
  textDocument: {
    marginTop: 29,
    marginBottom: 49,
    fontSize: 13,
    color: colors.white,
    ...style.getFontOption("400"),
    textAlign: "center",
    lineHeight: 14,
  },
  textDocumentBold: {
    ...style.getFontOption("700"),
    // transform: [{ translateY: 1.9 }],
  },
});

export default SelectMethodAuthentication;
