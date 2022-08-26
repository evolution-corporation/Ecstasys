import React, {
  forwardRef,
  useState,
  useImperativeHandle,
  useEffect,
} from "react";
import { ViewProps, Modal, View, Pressable, StyleSheet } from "react-native";

const CustomModal = forwardRef<Ref, Props>((props, ref) => {
  const { children, style, onClose } = props;
  const [isShow, setIsShow] = useState<boolean>(false);

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
    >
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => setIsShow(false)}
      />
      <View style={style}>{children}</View>
    </Modal>
  );
});

export interface Props extends ViewProps {
  onClose?: () => void;
}

export interface Ref {
  close: () => void;
  open: () => void;
}

export default CustomModal;
