import React, { FC, useMemo } from "react";
import { StyleSheet, ViewProps, View, Text, Image } from "react-native";

import { useUserContext } from "~modules/account";
import { TextButton } from "~components/dump";
import Tools from "~core";
import { useNavigation } from "@react-navigation/native";
import type { ProfileCompositeStackNaviatorProps } from "~routes/index";
import { useSubscribe } from "~modules/subscribe";

const UserInformation: FC<UserInformationProps> = (props) => {
  const { user } = useUserContext();
  const navigation = useNavigation<ProfileCompositeStackNaviatorProps>();
  const subscribeInformation = useSubscribe();

  if (!user) return null;

  return (
    <View style={styles.background}>
      <Image
        source={{
          uri: "https://storage.yandexcloud.net/dmdmeditationimage/users/TestUser.jpg",
        }}
        style={styles.image}
        resizeMethod={"resize"}
        resizeMode={"contain"}
      />
      <View style={styles.backgroundInfo}>
        <Text style={styles.displayName}>{user.displayName}</Text>
        <Text style={styles.nameSubscribe}>
          {Tools.i18n.t("d275f2aa-4a42-47cd-86a5-0ae9cbc3ab30", {
            name: subscribeInformation?.name ?? "Base",
          })}
        </Text>
        <Text style={styles.timeSubscribe}>
          {subscribeInformation?.info?.nextPayment
            ? Tools.i18n.t("f4e15f0c-688a-42c5-99a9-b1ac13209641", {
                datemtime: Tools.i18n.strftime(
                  subscribeInformation?.info?.nextPayment,
                  "%d.%m.%Y"
                ),
              })
            : Tools.i18n.t("indefinitely")}
        </Text>
        <TextButton
          onPress={() => {
            navigation.navigate("EditUserData");
          }}
        >
          {Tools.i18n.t("edit")}
        </TextButton>
      </View>
    </View>
  );
};

export interface UserInformationProps extends ViewProps {}

export default UserInformation;

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: 200,
    marginTop: -46,
    marginBottom: 55,
  },
  backgroundInfo: {
    borderRadius: 20,
    backgroundColor: "#7C3D91",
    width: "100%",
    height: 165,
    paddingTop: 58,
    alignItems: "center",
  },
  image: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    alignSelf: "center",
    transform: [{ translateY: 46 }],
    zIndex: 1,
  },
  displayName: {
    color: "#FFFFFF",
    fontSize: 20,
    ...Tools.gStyle.font("700"),
  },
  nameSubscribe: {
    color: "#FFFFFF",
    fontSize: 16,
    ...Tools.gStyle.font("700"),
    marginTop: 9,
  },
  timeSubscribe: {
    color: "#FFFFFF",
    fontSize: 14,
    ...Tools.gStyle.font("400"),
  },
  editButton: {
    color: "#E7DDEC",
    fontSize: 13,
    ...Tools.gStyle.font("600"),
    marginTop: 9,
  },
});
