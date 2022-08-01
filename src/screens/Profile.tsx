import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { FC, useCallback, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import i18n from "~i18n";
import Icon from "~assets/icons";
import ColorButton from "~components/ColorButton";
import MoodInformation from "~components/MoodInformation";
import StatisticMeditation from "~components/StatisticMeditation";
import UserInformation from "~components/UserInformation";
import BackgroundGradient from "~containers/BackgroundGradient";
import { useAppSelector } from "~store";
import { colors } from "~styles";

const ProfileScreen: FC<
  NativeStackScreenProps<MainStackParametersList, "Profile">
> = ({ navigation, route }) => {
  const user = useAppSelector((store) => store.account.user);
  useEffect(() => {
    if (user) {
      navigation.setOptions({
        title: user.nickname,
      });
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      const navigateParent = navigation.getParent();
      if (navigateParent) {
        navigateParent.setOptions({});
      }
    }, [navigation])
  );

  return (
    <BackgroundGradient
      isImage={true}
      imageName={"leaves"}
      style={styles.background}
    >
      {user && <UserInformation user={user} type={"profile"} />}
      <MoodInformation type="Full" />
      <StatisticMeditation type={"full"} />
      <ColorButton
        type="fullWidth"
        styleButton={styles.button}
        styleText={styles.buttonText}
        text={i18n.t("favorite")}
        icon={"Heart"}
        iconPosition={"left"}
        iconStyle={styles.buttonIcon}
        onPress={() => navigation.navigate("FavoriteMeditationList")}
      />
    </BackgroundGradient>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.violet,
  },
  buttonText: {
    color: colors.white,
    textAlign: "left",
    flex: 1,
    marginLeft: 45,
  },
  background: {
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
  },
});

export default ProfileScreen;
