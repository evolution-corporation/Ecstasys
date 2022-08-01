import React, { FC } from "react";
import { StyleSheet, TouchableOpacity, Text, Switch, View } from "react-native";
import i18n from "~i18n";
import Icon from "~assets/icons";
import BackgroundGradient from "~containers/BackgroundGradient";
import style, { colors } from "~styles";
import { useAppDispatch } from "~store";
import { signOut } from "~store/account";

const OptionsScreen: FC<RootStackScreenProps<"Options">> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  return (
    <BackgroundGradient
      isImage={true}
      imageName={"leaves"}
      style={styles.background}
    >
      <TouchableOpacity
        key={"editProfile"}
        style={styles.editSetting}
        onPress={() => navigation.navigate("EditUserData")}
      >
        <Icon name={"User"} />
        <Text style={styles.editSettingName}>
          {i18n.t("1c76bb73-8f7f-481e-8b76-475117f2b8c7")}
        </Text>
      </TouchableOpacity>
      <View
        key={"notification"}
        style={[styles.editSetting, { justifyContent: "space-between" }]}
      >
        <View style={{ flexDirection: "row" }}>
          <Icon name={"Bell"} />
          <Text style={styles.editSettingName}>
            {i18n.t("6f856c1a-6aba-4d92-a9c7-16ef29ba59da")}
          </Text>
        </View>
        <Switch />
      </View>
      <TouchableOpacity key={"sendSupport"} style={styles.editSetting}>
        <Icon name={"Mail"} />
        <Text style={styles.editSettingName}>
          {i18n.t("6f272c11-bad7-4f80-9b99-cb59688942d0")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        key={"exit"}
        style={styles.editSetting}
        onPress={() => dispatch(signOut())}
      >
        <Icon name={"LogOut"} />
        <Text style={styles.editSettingName}>
          {i18n.t("c9bcb9a8-e59c-4ee5-97f1-94dae753a716")}
        </Text>
      </TouchableOpacity>
    </BackgroundGradient>
  );
};

const styles = StyleSheet.create({
  editSetting: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: 50,
  },
  editSettingName: {
    marginLeft: 33,
    color: colors.white,
    fontSize: 15,
    ...style.getFontOption("400"),
  },
  background: {
    paddingHorizontal: 20,
  },
});

export default OptionsScreen;
