import React, { FC } from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import LogoApp from "~components/image/LogoApp";
import i18n from "~i18n";
import style, { colors } from "~styles";
import ColorButton from "~components/ColorButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import NameApplication from "~components/Text/NameApplication";
import SmallDescriptionApplication from "~components/Carousel/SmallDescriptionApplication";

type ElementName = "CarouselText" | "Title" | "Logo";

const SelectMethodAuthentication: FC<
  NativeStackScreenProps<
    AuthorizationStackParamList,
    "SelectMethodAuthentication"
  >
> = ({ navigation }) => {
  return (
    <ImageBackground
      style={styles.background}
      source={require("~assets/rockDrugs.png")}
    >
      <LogoApp scale={1.26} style={styles.logoBox} />

      <View style={styles.greetingBox}>
        <NameApplication />
        <SmallDescriptionApplication />
      </View>
      <View style={styles.selectMethodBox}>
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingHorizontal: 20,
  },
  logoBox: {
    flex: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  greetingBox: {
    flex: 2,
  },
  selectMethodBox: {
    flex: 3,
    justifyContent: "flex-end",
  },
  buttonSelect: {
    marginVertical: 5,
  },
  textDocument: {
    marginTop: 29,
    fontSize: 13,
    color: colors.white,
    ...style.getFontOption("400"),
    textAlign: "center",
    lineHeight: 14,
  },
  textDocumentBold: {
    ...style.getFontOption("700"),
  },
});

export default SelectMethodAuthentication;
