import React, { FC, useContext, useMemo, useRef, useState } from "react";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  Animated,
  useWindowDimensions,
  PanResponder,
  Easing,
} from "react-native";
import i18n from "~i18n";
import editUserDataContext from "~contexts/editUserData";
import { useAppSelector } from "~store";
import { colors, styleText } from "~styles";
import SelectBirthday from "~components/SelectBirthday";
import ColorButton from "~components/ColorButton";

const SelectDateBirthdayModal: FC<
  EditUserDataScreenProps<"SelectBirthday">
> = ({ navigation }) => {
  const { height, width } = useWindowDimensions();
  const editUserData = useContext(editUserDataContext);
  const user = useAppSelector((state) => state.account.user);
  const position = useRef<Animated.Value>(new Animated.Value(0)).current;

  const [contentSize, setContentSize] = useState<SizeComponent | null>(null);
  if (user == undefined || editUserData == null) return null;
  const nextBirthday = useRef<{
    year: number;
    month: number;
    day: number;
  } | null>(null);
  const horizontalPaddingContent = useRef<{
    left: number;
    right: number;
  }>({ left: 0, right: 0 });
  const ordinateTopLine = useMemo(
    () => (contentSize ? height - contentSize.height - 80 : 0),
    [height, contentSize]
  );
  const pan = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return !(
            gestureState.moveX > horizontalPaddingContent.current.left &&
            gestureState.moveX < horizontalPaddingContent.current.right
          );
        },
        onPanResponderMove: (_, gestureState) => {
          if (contentSize) {
            const offset = gestureState.moveY - ordinateTopLine;
            if (
              offset <= -contentSize.height * 0.5 ||
              offset >= contentSize.height * 0.8
            ) {
              return false;
            }
            position.setValue(offset);
          }
        },
        onPanResponderTerminationRequest: (_, gestureState) => {
          Animated.timing(position, {
            toValue: 0,
            useNativeDriver: true,
            easing: Easing.bounce,
          }).start();
          return true;
        },
        onPanResponderRelease: (_, gestureState) => {
          let offset = gestureState.moveY - ordinateTopLine;
          if (contentSize) {
            if (offset <= -contentSize.height * 0.5) {
              offset = -contentSize.height * 0.5;
            } else if (offset >= contentSize.height * 0.8) {
              offset = contentSize.height * 0.8;
            }
            if (gestureState.dy > 0 && offset >= contentSize.height * 0.8) {
              navigation.goBack();
            } else {
              Animated.timing(position, {
                toValue: 0,
                useNativeDriver: true,
                easing: Easing.bounce,
              }).start();
            }
          }
        },
      }),
    [contentSize]
  );

  return (
    <View style={{ flex: 1 }}>
      <Pressable style={{ flexGrow: 1 }} onPress={() => navigation.goBack()} />
      <Animated.View
        style={[
          styles.background,
          contentSize
            ? {
                height: contentSize.height * 2,
                bottom: -contentSize.height + 80,
              }
            : null,
          { transform: [{ translateY: position }] },
        ]}
        {...pan.panHandlers}
      >
        <View
          style={{ alignItems: "center" }}
          onLayout={({ nativeEvent: { layout } }) => {
            if (contentSize == null) {
              setContentSize({
                width: width,
                height: layout.height,
              });
            }
          }}
        >
          <Text style={styles.title}>
            {i18n.t("3186e946-022f-4eb9-bab8-ea115a392ae2")}
          </Text>
          <SelectBirthday
            onChange={(date) => {
              nextBirthday.current = date;
            }}
            init={
              editUserData.modifiedUserData.birthday
                ? new Date(
                    editUserData.modifiedUserData.birthday.year,
                    editUserData.modifiedUserData.birthday.month,
                    editUserData.modifiedUserData.birthday.day
                  )
                : new Date(user.birthday)
            }
            onLayout={({ nativeEvent: { layout } }) => {
              const padding = (width - layout.width) / 2 - 15;
              horizontalPaddingContent.current = {
                left: padding,
                right: width - padding,
              };
            }}
          />
          <ColorButton
            type="small"
            text={i18n.t("save")}
            styleButton={styles.button}
            onPress={() => {
              if (nextBirthday.current && editUserData) {
                editUserData.editBirthday(nextBirthday.current);
              }
              navigation.navigate("EditMainUserData");
            }}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    width: "100%",
    backgroundColor: colors.violet,
    alignItems: "center",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingTop: 27,
    paddingBottom: 48,
    position: "absolute",
    bottom: "-100%",
  },
  title: {
    ...styleText.h1,
    color: colors.white,
    marginBottom: 27,
  },
  button: {
    marginTop: 43,
  },
});

export default SelectDateBirthdayModal;
