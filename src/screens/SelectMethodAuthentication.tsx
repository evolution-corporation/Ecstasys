import React, { FC } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import BackgroundGradient from "~components/BackgroundGradient";
import Logo from "~assets/icons/LogoApp.svg";
import i18n from "~i18n";
import Swiper from "react-native-swiper";

const SelectMethodAuthentication: FC = () => {
  const { width } = useWindowDimensions();
  return (
    <BackgroundGradient isImage={true}>
      <View>
        <Logo />
        <Text>{i18n.t("2c4c4afe-0269-4eea-980b-8d73963b8d35")}</Text>
        <Swiper
          horizontal={true}
          loop={true}
          autoplay={true}
          width={width}
          containerStyle={styles.swiperStyle}
          height={72}
          dotColor={"#816EBD"}
          activeDotColor={"#FFFFFF"}
          showsPagination={true}
        >
          {["text 1", "text 2", "text, 3", "text 4"].map((item) => (
            <Text style={styles.textCarousel}>{item}</Text>
          ))}
        </Swiper>
      </View>
      <View></View>
    </BackgroundGradient>
  );
};

const styles = StyleSheet.create({
  swiperStyle: {
    height: 300,
  },
  textCarousel: {
    color: "#FFFFFF",
    textAlign: "center",
  },
});

export default SelectMethodAuthentication;
