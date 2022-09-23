import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { DevelopmentThumbler } from "~components/dump";

const DevSetting = () => {
  return (
    <View style={styles.background}>
      <DevelopmentThumbler />
    </View>
  );
};

export default DevSetting;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#9765A8",
    paddingHorizontal: 20,
  },
});
