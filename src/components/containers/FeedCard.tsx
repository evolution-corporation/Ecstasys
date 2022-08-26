import React, { FC } from "react";
import { View, ViewProps, Text, StyleSheet } from "react-native";
import style, { colors } from "~styles";

const FeedCard: FC<Props> = (props) => {
  const { title, subTitle, children, style } = props;

  return (
    <View style={style}>
      <Text style={styles.textTitle}>{title}</Text>
      <Text style={styles.textSubTitle}>{subTitle}</Text>
      {children}
    </View>
  );
};

interface Props extends ViewProps {
  title: string;
  subTitle: string;
}

const styles = StyleSheet.create({
  textTitle: {
    color: colors.DarkLetters,
    fontSize: 20,
    ...style.getFontOption("400"),
    marginBottom: 12,
  },
  textSubTitle: {
    color: colors.grayHell,
    fontSize: 14,
    ...style.getFontOption("400"),
    marginBottom: 15,
  },
});

export default FeedCard;
