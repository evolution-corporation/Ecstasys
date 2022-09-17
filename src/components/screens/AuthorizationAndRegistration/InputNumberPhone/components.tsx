import React, {
  ElementRef,
  FC,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  Platform,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import isMobilePhone from "validator/lib/isMobilePhone";

import Tools from "~core";
import TheArrow from "~assets/icons/TheArrow_WhiteTop.svg";
import { CustomModal } from "~components/containers";
import { ColorButtonDoubleText } from "~components/dump";

import listCodePhoneCountry from "./ListCodePhoneCountry";

type CodePhoneCountryType = keyof typeof listCodePhoneCountry;
const ListCodePhoneCountry = Object.keys(
  listCodePhoneCountry
) as CodePhoneCountryType[];

export const NumberInput: FC<Props> = (props) => {
  const {
    defaultCode = "RU",
    autoFocus = false,
    onChange = (number: string, isValidate) => console.info(number, isValidate),
    fixHeigth = 0,
  } = props;

  const [regionCode, setRegionCode] =
    useState<CodePhoneCountryType>(defaultCode);
  const [phone, setPhone] = useState<string>("");
  const [widthAndPositionRegionList, setWidthAndPositionRegionList] = useState<{
    width: number;
    y: number;
    x: number;
  } | null>(null);

  const customModalRef = useRef<ElementRef<typeof CustomModal>>(null);

  const _LeftBottomRadiusBackground = useSharedValue(
    styles.background.borderRadius ?? 15
  );
  const _RotateArrow = useSharedValue("180deg");

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    borderBottomLeftRadius: withTiming(_LeftBottomRadiusBackground.value),
  }));

  const arrowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(_RotateArrow.value) }],
  }));

  const openList = () => {
    _LeftBottomRadiusBackground.value = 0;
    _RotateArrow.value = "0deg";
  };

  const closeList = () => {
    _LeftBottomRadiusBackground.value = 15;
    _RotateArrow.value = "180deg";
  };

  useEffect(() => {
    onChange(
      `${listCodePhoneCountry[regionCode]}${phone}`,
      isMobilePhone(`${listCodePhoneCountry[regionCode]}${phone}`)
    );
  }, [regionCode, phone]);

  return (
    <>
      <Animated.View
        style={[styles.background, backgroundAnimatedStyle]}
        onLayout={({ nativeEvent: { layout } }) => {
          if (widthAndPositionRegionList === null) {
            if (Platform.OS !== "web") {
              setWidthAndPositionRegionList({
                width: layout.width / 3,
                y: layout.y + layout.height + fixHeigth,
                x: layout.x,
              });
            }
          }
        }}
      >
        <TouchableOpacity
          style={styles.buttonRegionSelect}
          onPress={() => {
            customModalRef.current?.open();
            openList();
          }}
        >
          <Text style={styles.phoneStyle}>
            {listCodePhoneCountry[regionCode]}
          </Text>
          <Animated.View style={[arrowAnimatedStyle, { marginLeft: 5 }]}>
            <TheArrow />
          </Animated.View>
        </TouchableOpacity>
        <TextInput
          style={[styles.textInputStyle, styles.phoneStyle]}
          placeholder={Tools.i18n.t("c44c1286-2e08-4c18-ac68-4bae712c26a8")}
          placeholderTextColor={"#E7DDEC"}
          autoFocus={autoFocus}
          autoComplete={"tel-device"}
          textContentType={"telephoneNumber"}
          importantForAutofill={"yes"}
          keyboardType={"number-pad"}
          maxLength={10}
          returnKeyType={"go"}
          selectionColor={"#FFFFFF"}
          onChangeText={(number: string) => setPhone(number)}
        />
      </Animated.View>
      <CustomModal ref={customModalRef} onClose={() => closeList()}>
        <FlatList
          style={[
            styles.flatListStyle,
            widthAndPositionRegionList
              ? {
                  left: widthAndPositionRegionList.x,
                  top: widthAndPositionRegionList.y,
                }
              : null,
          ]}
          data={ListCodePhoneCountry}
          initialScrollIndex={ListCodePhoneCountry.indexOf(regionCode)}
          renderItem={({ item }) => (
            <ColorButtonDoubleText
              leftText={listCodePhoneCountry[item]}
              styleLeftText={styles.selectCodeNumberText}
              styleText={styles.selectCountryText}
              styleButton={styles.selectCodeNumberView}
              onPress={() => {
                customModalRef.current?.close();
                setRegionCode(item);
                closeList();
              }}
            >
              {Tools.i18n.t(item)}
            </ColorButtonDoubleText>
          )}
          showsVerticalScrollIndicator={false}
          initialNumToRender={Object.keys(regionCode).length}
          keyExtractor={(item) => item}
          getItemLayout={(data, index) => ({
            length: styles.selectCodeNumberView.height,
            offset: styles.selectCodeNumberView.height * index,
            index,
          })}
        />
      </CustomModal>
    </>
  );
};

interface Props {
  defaultCode?: keyof typeof listCodePhoneCountry;
  autoFocus?: boolean;
  onChange?: (number: string, isValidate: boolean) => void;
  fixHeigth?: number;
}

const styles = StyleSheet.create({
  background: {
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "#C2A9CE",
    height: 45,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  buttonRegionSelect: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
  },
  phoneStyle: {
    color: "#FFFFFF",
    fontSize: 14,
    ...Tools.gStyle.font("500"),
  },
  textInputStyle: {
    borderLeftColor: "#C2A9CE",
    borderLeftWidth: 1,
    width: "100%",
    height: "100%",
    paddingHorizontal: 10,
  },
  flatListStyle: {
    position: "absolute",
    top: 45,
    maxHeight: 144,
    width: "80%",
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    transform: [{ translateY: -1 }],
  },
  selectCodeNumberView: {
    width: "100%",
    height: 28,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  selectCodeNumberText: {
    color: "#555555",
    width: 70,
    textAlign: "center",
    fontSize: 14,
    ...Tools.gStyle.font("500"),
  },
  selectCountryText: {
    paddingLeft: 24,
    opacity: 0.22,
    color: "#000000",
    fontSize: 13,
    textAlign: "left",
    ...Tools.gStyle.font("400"),
  },
});
