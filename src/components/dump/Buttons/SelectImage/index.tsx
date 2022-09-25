import React, { FC, useCallback, useEffect, useReducer, useState } from "react";
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  ColorValue,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import PhotoIcon from "./assets/PhotoIcon.svg";

interface SelectImageButtonProps extends TouchableOpacityProps {
  onChangeImage?: { (image: string): void };
  initImage?: string;
}

export const SelectImageButton: FC<SelectImageButtonProps> = (props) => {
  const { onChangeImage, initImage } = props;
  const [isLoading, setIsLoading] = useState<boolean>();
  const [image, setImage] = useState<string | null>(initImage ?? null);

  const [statusPermission, requestPermission] =
    ImagePicker.useMediaLibraryPermissions();

  const openPhotoLibrary = useCallback(async () => {
    setIsLoading(false);
    if (!statusPermission?.granted) {
      let permission = await requestPermission();
      let countTryGetPermission = 0;
      while (
        !permission.granted &&
        permission.canAskAgain &&
        countTryGetPermission <= 3
      ) {
        permission = await requestPermission();
        if (!permission.granted) {
          countTryGetPermission++;
        }
      }
      if (!permission.canAskAgain || !permission.granted) {
        setIsLoading(true);
        return;
      }
    }
    const image = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (image.cancelled) {
      setIsLoading(false);
    } else {
      setImage(image.uri);
      if (onChangeImage != undefined && image.base64) {
        onChangeImage(image.base64);
      }
    }
  }, [statusPermission]);

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
      {isLoading ? (
        <ActivityIndicator size={"large"} color={"#FFFFFF"} />
      ) : image == undefined ? (
        <PhotoIcon />
      ) : (
        <Image
          source={{ uri: image }}
          resizeMode={"cover"}
          style={{ width: 128, height: 128 }}
        />
      )}
    </TouchableOpacity>
  );
};

export default SelectImageButton;
