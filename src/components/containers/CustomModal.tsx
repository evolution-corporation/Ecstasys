import { useDimensions } from "@react-native-community/hooks";
import React, {
  forwardRef,
  useState,
  useImperativeHandle,
  useEffect,
} from "react";
import {
  ViewProps,
  Modal,
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
} from "react-native";

const CustomModal = forwardRef<Ref, Props>((props, ref) => {
  const { children, style, onClose, styleBackground, mainStyle } = props;
  const [isShow, setIsShow] = useState<boolean>(false);
  const {
    window: { height, width },
  } = useDimensions();
  useEffect(() => {
    if (!isShow && onClose) onClose();
  }, [isShow]);

  useImperativeHandle(ref, () => ({
    close: () => {
      setIsShow(false);
    },
    open: () => {
      setIsShow(true);
    },
  }));
  return (
    <Modal
      transparent={true}
      animationType={"fade"}
      hardwareAccelerated={true}
      onRequestClose={() => setIsShow(false)}
      visible={isShow}
      style={[{ width, height }, mainStyle]}
    >
      <View style={[{ width, height }, mainStyle]}>
        <Pressable
          style={[StyleSheet.absoluteFill, styleBackground]}
          onPress={() => setIsShow(false)}
        />
        <View style={style}>{children}</View>
      </View>
    </Modal>
  );
});

export interface Props extends ViewProps {
  onClose?: () => void;
  styleBackground?: ViewStyle;
  mainStyle?: ViewStyle;
}

export interface Ref {
  close: () => void;
  open: () => void;
}

export default CustomModal;
