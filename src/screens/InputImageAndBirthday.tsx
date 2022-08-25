import React, { useRef} from "react";
import { View, StyleSheet, Text } from "react-native";
import ColorButton from "~components/ColorButton";
import SelectBirthday from "~components/SelectBirthday";
import SelectImageButton from "~components/SelectImageButton";
import i18n from "~i18n";
import style, { colors, styleText } from "~styles";
import {AccountStackScreenProps} from "~modules/account/types";
import {useAccountContext} from "~modules/account/context";
const InputImageAndBirthdayScreen: AccountStackScreenProps<'InputImageAndBirthday'> = ({  }) => {
  const userDate = useRef<{ birthday: Date | null, image: string | null }>({
    birthday: null,
    image: null,
  }).current;
  const accountState = useAccountContext()
  const registration = async () => {
    if (!!userDate.birthday) {
      await accountState.func.editUserData({ birthday: userDate.birthday, image: userDate.image ?? undefined})
      await accountState.func.registration()
    }
  };

  return (
    // @ts-ignore
    <View style={styles.background}>
      {/* @ts-ignore */ }
      <View style={style.fullWidth}>
        {/* @ts-ignore */ }
        <Text style={styleText.subTitle}>
          {i18n.t("f22ace97-97e5-4f87-b1b7-c179f1d7e893")}
        </Text>
        <SelectImageButton
          style={styles.selectImage}
          onChangeImage={({ base64 }) => {
            if (base64) {
              userDate.image = base64;
            }
          }}
          typeReturn={"base64"}
        />
        <SelectBirthday
          onChange={(date) => {
            userDate.birthday = new Date(
              date.year,
              date.month,
              date.day,
              0,
              0,
              0,
              0
            );
          }}
        />
      </View>
      <ColorButton
        text={i18n.t("01e5182d-f190-4bcb-9668-36a193e18325")}
        type={"fullWidth"}
        onPress={() => registration()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    paddingHorizontal: 30,
    paddingBottom: 75,
    justifyContent: "space-between",
    backgroundColor: colors.moreViolet,
    flex: 1,
  },
  ColorButtonStyle: { marginVertical: 10 },
  selectImage: {
    height: 124,
    width: 124,
    borderRadius: 30,
    borderColor: colors.StrokePanel,
    borderWidth: 3,
    backgroundColor: colors.WhiteGlass,
    marginVertical: 72,
  },
});

export default InputImageAndBirthdayScreen;
