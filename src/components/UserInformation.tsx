import React, { FC, useState } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  ImageStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import style, { colors, styleText } from "~styles";
import { TextButton } from "./ColorButton";
import i18n from "~i18n";
import Icon from "~assets/icons";
import { useNavigation } from "@react-navigation/native";

const UserInformation: FC<Props> = (props) => {
  const { type, user, styleView, styleImage, styleNickname } = props;
  const navigation = useNavigation();
  switch (type) {
    case "small":
      const { position } = props;
      return (
        <TouchableOpacity
          style={[
            stylesSmall.background,
            styleView,
            position
              ? { top: position.y, left: position.x, position: "absolute" }
              : null,
          ]}
          onPress={() => navigation.navigate("Profile")}
        >
          <Image
            style={[stylesSmall.image, styleImage]}
            source={{ uri: user.image }}
          />
          <Text style={[stylesSmall.text, styleNickname]}>{user.nickname}</Text>
        </TouchableOpacity>
      );
    case "profile":
      const { dateNextPayPrime } = props;
      let subscribeName: SubscribeName = SubscribeName.Base;
      const [size, setSize] = useState<{
        width: number;
        height: number;
      } | null>();
      let dateNextPayPrime_text = i18n.t("indefinitely");
      if (
        dateNextPayPrime != undefined &&
        dateNextPayPrime.getTime() > Date.now()
      ) {
        subscribeName = SubscribeName.Premium;
        dateNextPayPrime_text = `${i18n.t(
          "before"
        )} ${dateNextPayPrime.getDate()}.${dateNextPayPrime.getMonth()}.${dateNextPayPrime.getFullYear()}`;
      }
      return (
        <View style={size}>
          <View style={stylesProfile.imageWrapper}>
            <Image source={{ uri: user.image }} style={stylesProfile.image} />
            {subscribeName == SubscribeName.Premium ? (
              <Icon style={stylesProfile.primeImage} name={"Star"} />
            ) : null}
          </View>
          <View
            style={stylesProfile.info}
            onLayout={({ nativeEvent: { layout } }) => {
              setSize({
                height: layout.height + stylesProfile.image.height / 2,
                width: layout.width,
              });
            }}
          >
            <Text style={stylesProfile.name}>{user.name}</Text>
            <Text style={stylesProfile.subscribeStatus}>
              {i18n.t("d275f2aa-4a42-47cd-86a5-0ae9cbc3ab30")}{" "}
              <Text style={stylesProfile.subscribeName}>{subscribeName}</Text>
            </Text>
            <Text style={stylesProfile.dateNextPayPrime}>
              {dateNextPayPrime_text}
            </Text>
            <TextButton
              onPress={() => {}}
              text={i18n.t("edit")}
              styleText={stylesProfile.editButton}
            />
          </View>
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
  dateNextPayPrime?: Date;
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
    width: 92,
    height: 92,
    borderRadius: 46,
    resizeMode: "contain",
    borderWidth: 3,
    borderColor: colors.white,
  },
  imageWrapper: {
    zIndex: 1,
    alignSelf: "center",
  },
  info: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: "#7C3D91",
    position: "absolute",
    alignSelf: "center",
    top: 46,
    paddingTop: 58,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 11,
  },
  name: {
    ...styleText.h1,
    color: colors.white,
    marginBottom: 9,
  },
  subscribeStatus: {
    color: colors.white,
    fontSize: 16,
    ...style.getFontOption("500"),
  },
  subscribeName: {
    color: colors.white,
    fontSize: 16,
    ...style.getFontOption("700"),
  },
  dateNextPayPrime: {
    ...styleText.subTitle,
    color: colors.TextOnTheBackground,
  },
  editButton: {
    marginTop: 9,
    color: colors.TextOnTheBackground,
    fontSize: 13,
    ...style.getFontOption("600"),
  },
  primeImage: {
    position: "absolute",
    bottom: -10,
    alignSelf: "center",
  },
});

export default UserInformation;

const enum SubscribeName {
  Base = "Base",
  Premium = "Premium",
}
