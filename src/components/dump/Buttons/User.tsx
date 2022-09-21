import React, { FC } from "react";
import { Image, ViewProps, StyleSheet } from "react-native";

import { useUserContext } from "~modules/account/AccountContext";
import Base from "./Base";
import Tools from "~core";

const UserButton: FC<Props> = (props) => {
  const { style, onPress } = props;
  const { user } = useUserContext();

  if (!user) return null;

  return (
    <Base
      styleButton={[style, styles.background]}
      onPress={onPress}
      secondItem={<Image source={{ uri: user.image }} style={styles.image} />}
      styleText={styles.nickname}
    >
      {user.nickName}
    </Base>
  );
};

interface Props extends ViewProps {
  onPress?: () => void;
}

const styles = StyleSheet.create({
  background: {
    borderRadius: 90,
    backgroundColor: "#FFFFFF",
    paddingVertical: 3,
    alignItems: "center",
    flexDirection: "row",
    
  },
  image: {
    width: 38,
    height: 38,
    borderRadius: 22,
    marginLeft: 4,
    
    
  },
  nickname: {
    marginHorizontal: 9,
    color: "#3D3D3D",
    fontSize: 14,
    ...Tools.gStyle.font("500"),
  },
});

export default UserButton;
