import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextStyle,
  ViewStyle,
  Text,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import Tools from "~core";
import { useCheckUniqueNickname, StatusCheck } from "~modules/account/hook";

const NicknameInput = forwardRef<Ref, Props>((props, ref) => {
  const {
    styleNicknameInputView,
    styleNicknameInputText,
    defaultValue,
    onEndChange,
  } = props;
  const [_nickname, _setNickname] = useState<string>(defaultValue ?? "");
  const { isLoading, setNickname, statusCheck } = useCheckUniqueNickname();

  const _colorBorderView = useSharedValue("#FF5C00");

  const animatedView = useAnimatedStyle(() => ({
    borderColor: withTiming(_colorBorderView.value),
  }));

  const editNickname = (text: string) => {
    setNickname(text);
    _setNickname(text);
  };

  useEffect(() => {
    if (statusCheck === "INCORRECT" || statusCheck === "USED") {
      _colorBorderView.value = "#FF5C00";
    } else {
      _colorBorderView.value = "#C2A9CE";
    }
    if (!!onEndChange && !isLoading) {
      onEndChange(_nickname, statusCheck);
    }
  }, [statusCheck, isLoading]);

  useImperativeHandle(ref, () => ({
    editNickname,
  }));

  return (
    <>
      <Animated.View
        style={[
          styles.backgroundTextInput,
          styleNicknameInputView,
          animatedView,
        ]}
      >
        <TextInput
          onChangeText={(text) => editNickname(text)}
          style={[styles.textInputView, styleNicknameInputText]}
          value={_nickname}
          placeholderTextColor={"#C2A9CE"}
          maxLength={16}
          placeholder={Tools.i18n.t("f212a1ac-9688-4671-bbd1-6cbe20662ad7")}
        />
        <View style={styles.indicatorImage}>
          {isLoading ? (
            <ActivityIndicator color={"#FFFFFFFF"} size={"small"} />
          ) : statusCheck === "INCORRECT" || statusCheck === "USED" ? (
            <TouchableOpacity onPress={() => editNickname("")}>
              <Entypo name="cross" size={24} color="white" />
            </TouchableOpacity>
          ) : statusCheck === "FREE" ? (
            <Entypo name="check" size={24} color="white" />
          ) : null}
        </View>
      </Animated.View>
      <Text style={styles.errorMessage}>
        {statusCheck === "INCORRECT"
          ? Tools.i18n.t("d6a4f1c4-4344-4712-ac61-0c81292d0994")
          : statusCheck === "USED"
          ? Tools.i18n.t("564efb95-c192-4406-830f-13b3612bae0e")
          : null}
      </Text>
    </>
  );
});

export interface Props extends TextInputProps {
  styleNicknameInputText?: TextStyle;
  styleNicknameInputView?: ViewStyle;
  autFocus?: boolean;
  nickNameInit?: string;
  showMessage?: boolean;
  checkInitLogin?: boolean;
  onEndChange?: (nickname: string, statusCheck: StatusCheck) => void;
}

export interface Ref {
  editNickname: (nickname: string) => void;
}

export { StatusCheck };

const styles = StyleSheet.create({
  textInputView: {
    color: "#FFFFFF",
    fontSize: 14,
    ...Tools.gStyle.font("400"),
    flex: 1,
    paddingRight: 44,
  },
  backgroundTextInput: {
    width: "100%",
    height: 45,
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: "rgba(240, 242, 238, 0.19)",
    paddingHorizontal: 15,
  },
  indicatorImage: {
    minWidth: 20,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  errorMessage: {
    fontSize: 13,
    lineHeight: 16,
    ...Tools.gStyle.font("400"),
    textAlign: "center",
    color: "#E7DDEC",
  },
});

export default NicknameInput;
