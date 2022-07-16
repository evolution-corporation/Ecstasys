import React, { FC } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  ImageStyle,
  TextStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import style, { colors } from "~styles";

const UserInformation: FC<Props> = (props) => {
  const { type, user, styleView, styleImage, styleNickname } = props;
  switch (type) {
    case "small":
      const { position } = props;
      return (
        <View
          style={[
            stylesSmall.background,
            styleView,
            position
              ? { top: position.y, left: position.x, position: "absolute" }
              : null,
          ]}
        >
          <Image
            style={[stylesSmall.image, styleImage]}
            source={{ uri: user.image }}
          />
          <Text style={[stylesSmall.text, styleNickname]}>{user.nickName}</Text>
        </View>
      );
    case "profile":
      const { dateLastPayPrime } = props;
      return (
        <View>
          <View style={stylesProfile.imageWrapper}>
            <Image source={{ uri: user.image }} style={stylesProfile.image} />
          </View>
          <LinearGradient
            colors={["rgba(117, 52, 139, 1)", "rgba(106, 35, 130, 1)"]}
            style={stylesProfile.info}
          ></LinearGradient>
        </View>
      );
  }
};

type Props = General & (PropsSmall | PropsProfile);

interface General {
  user: UserData;
  styleView?: ViewStyle;
  styleImage?: ImageStyle;
  styleNickname?: TextStyle;
}

interface PropsSmall {
  type: "small";
  position?: {
    x: number;
    y: number;
  };
}

interface PropsProfile {
  type: "profile";
  dateLastPayPrime?: Date;
}

const stylesSmall = StyleSheet.create({
  background: {
    // position: "absolute",
    height: 44,
    paddingHorizontal: 3,
    borderRadius: 22,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  image: {
    height: 38,
    borderRadius: 19,
    width: 38,
    resizeMode: "contain",
  },
  text: {
    fontSize: 14,
    color: colors.gray,
    ...style.getFontOption("500"),
    textAlign: "center",
    paddingHorizontal: 9,
  },
});

const stylesProfile = StyleSheet.create({
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: "contain",
  },
  imageWrapper: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: colors.white,
    padding: 3,
  },
  info: {
    width: "100%",
    height: 100,
    borderRadius: 20,
    opacity: 0.7,
  },
});

export default UserInformation;
