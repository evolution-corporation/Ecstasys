import React, { useCallback, useEffect, useReducer } from "react";
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import type { FC } from "react";
import type { TouchableOpacityProps, ColorValue } from "react-native";
import Icon from "~assets/icons";

interface SelectImageButtonState {
  uri?: string;
  isLoading: boolean;
}

type SelectImageButtonAction =
  | { type: "cancel" }
  | { type: "loading" }
  | { type: "selectImage"; payload: string };

const SelectImageButtonInitState: SelectImageButtonState = {
  isLoading: false,
};

function SelectImageButtonReducer(
  state: SelectImageButtonState,
  action: SelectImageButtonAction
): SelectImageButtonState {
  switch (action.type) {
    case "cancel":
      state.isLoading = false;
      break;
    case "loading":
      state.isLoading = true;
      break;
    case "selectImage":
      state.uri = action.payload;
      state.isLoading = false;
      break;
  }
  return { ...state };
}

interface SelectImageButtonProps extends TouchableOpacityProps {
  onChangeImage?: { (image: { uri?: string; base64?: string }): void };
  typeReturn?: "base64" | "uri" | "all";
  initImage?: string;
  colorIndicatorLoading?: ColorValue;
}

const SelectImageButton: FC<SelectImageButtonProps> = (props) => {
  const {
    onChangeImage,
    typeReturn,
    initImage,
    colorIndicatorLoading = "#FFFFFF",
  } = props;
  const [state, dispatch] = useReducer(
    SelectImageButtonReducer,
    SelectImageButtonInitState,
    () => ({ uri: initImage, isLoading: false })
  );
  const [statusPermission, requestPermission] =
    ImagePicker.useMediaLibraryPermissions();
  const openPhotoLibrary = useCallback(async () => {
    dispatch({ type: "loading" });
    if (!statusPermission?.granted) {
      let permission = await requestPermission();
      while (!permission.granted && permission.canAskAgain) {
        permission = await requestPermission();
      }
      if (!permission.canAskAgain || !permission.granted) {
        dispatch({ type: "cancel" });
        return;
      }
    }
    const image = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: typeReturn == "base64" || typeReturn == "all",
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (image.cancelled) {
      dispatch({ type: "cancel" });
    } else {
      dispatch({ type: "selectImage", payload: image.uri });
      if (onChangeImage != undefined) {
        onChangeImage({
          uri: image.uri,
          base64: `'data:image/base64, ${image.base64}`,
        });
      }
    }
  }, [statusPermission]);

  useEffect(() => {
    if (initImage) {
      if (onChangeImage != undefined) {
        onChangeImage({ uri: initImage });
      }
    }
  }, [dispatch]);

  return (
    <TouchableOpacity
      {...props}
      style={[
        props.style,
        { overflow: "hidden", alignItems: "center", justifyContent: "center" },
      ]}
      onPress={() => {
        openPhotoLibrary();
      }}
    >
      {state.isLoading ? (
        <ActivityIndicator size={"large"} color={colorIndicatorLoading} />
      ) : state.uri == undefined ? (
        <Icon name={"PhotoIcon"} />
      ) : (
        <Image
          source={{ uri: state.uri }}
          resizeMode={"cover"}
          style={{ width: 128, height: 128 }}
        />
      )}
    </TouchableOpacity>
  );
};

export default SelectImageButton;
