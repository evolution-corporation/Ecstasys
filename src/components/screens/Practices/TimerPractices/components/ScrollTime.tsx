import React, { ElementRef, FC, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, ViewProps } from "react-native";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import { TextButton } from "~components/dump";

import Core from "~core";

const minutes = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25,
];

const seconds = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
  60,
];

const ScrollTime: FC<ScrollTimeProps> = (props) => {
  // const { data } = props;
  // const [selectedMinutesIndex, setSelectedMinutesIndex] = useState<number>(
  //   Math.floor(data.length / 2)
  // );

  // const _viewabilityConfig = useRef<ViewabilityConfig>({
  //   itemVisiblePercentThreshold: 70,
  //   waitForInteraction: true,
  // }).current;

  // const _onViewableItemsChanged = useRef(
  //   ({ viewableItems }: { viewableItems: ViewToken[] }) => {
  //     console.log("ted");
  //     if (viewableItems.length > 0) {
  //       const mediumIndex = Math.floor(viewableItems.length / 2);
  //       if (viewableItems[mediumIndex].index !== null) {
  //         setSelectedMinutesIndex(mediumIndex);
  //       }
  //     }
  //   }
  // ).current;
  // return (
  //   <FlatList
  //     data={data}
  //     key={"test"}
  //     renderItem={({ item }) => (
  //       <View>
  //         <Text style={[styles.item, styles.selectedItem]}>{item}</Text>
  //       </View>
  //     )}
  //     extraData={data}
  //     keyExtractor={(item) => `key-${item.toString()}`}
  //     style={styles.background}
  //     viewabilityConfig={_viewabilityConfig}
  //     onViewableItemsChanged={_onViewableItemsChanged}
  //     disableIntervalMomentum={true}
  //     snapToInterval={56}
  //   />
  // );
  const { initTime = { minutes: 5, seconds: 0 }, onChange, style } = props;
  const [selectedMinutesIndex, setSelectedMinutesIndex] = useState<number>(
    initTime.minutes
  );
  const [selectedSecondsIndex, setSelectedSecondsIndex] = useState<number>(
    initTime.seconds
  );

  useEffect(() => {
    if (onChange)
      onChange({
        minutes: selectedMinutesIndex,
        seconds: selectedSecondsIndex,
      });
  }, [selectedMinutesIndex, selectedSecondsIndex]);

  return (
    <View style={[styles.selectedTime, style]}>
      <View style={styles.wrapperScroll} key={"minuts"}>
        <ScrollPicker
          key={"minuts"}
          style={styles.timeScroll}
          dataSource={minutes}
          selectedIndex={selectedMinutesIndex}
          itemHeight={50}
          highlightColor={"#9765A8"}
          wrapperColor={"transparent"}
          highlightBorderWidth={2}
          wrapperHeight={150}
          renderItem={(data, index, isSelected) => {
            return (
              <Text
                style={[
                  styles.textItem,
                  { color: isSelected ? "#9765A8" : "#D3D3D3" },
                ]}
              >
                {index < 10 ? `0${index.toString()}` : `${index.toString()}`}
              </Text>
            );
          }}
          onValueChange={(data, selectedIndex) => {
            setSelectedMinutesIndex(selectedIndex);
          }}
        />
      </View>
      <View style={styles.wrapperScroll} key={"seconds"}>
        <ScrollPicker
          key={"seconds"}
          style={styles.timeScroll}
          dataSource={seconds}
          selectedIndex={selectedSecondsIndex}
          itemHeight={50}
          highlightColor={"#9765A8"}
          wrapperColor={"transparent"}
          highlightBorderWidth={2}
          wrapperHeight={150}
          renderItem={(data, index, isSelected) => {
            return (
              <Text
                style={[
                  styles.textItem,
                  { color: isSelected ? "#9765A8" : "#D3D3D3" },
                ]}
              >
                {index < 10 ? `0${index}` : `${index}`}
              </Text>
            );
          }}
          onValueChange={(data, selectedIndex) => {
            setSelectedSecondsIndex(selectedIndex);
          }}
        />
      </View>
    </View>
  );
};

export interface ScrollTimeProps extends ViewProps {
  initTime?: {
    minutes: number;
    seconds: number;
  };
  onChange?: (time: { minutes: number; seconds: number }) => void;
}

export default ScrollTime;

const styles = StyleSheet.create({
  // background: {},
  // item: {
  //   ...Core.gStyle.font(),
  //   backgroundColor: "red",
  //   marginVertical: 10,
  // },
  // selectedItem: {
  //   color: "#9765A8",
  //   fontSize: 48,
  // },
  // oneStepSelectedItem: { color: "#D3D3D3", fontSize: 40 },
  // twoStepSelectedItem: { color: "#F4F4F4", fontSize: 32 },
  background: {
    flex: 1,
  },
  selectedTime: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  textItem: {
    ...Core.gStyle.font("400"),
    fontSize: 40,
  },
  timeScroll: {
    marginHorizontal: 30,
    width: 60,
  },
  wrapperScroll: { width: 50, marginHorizontal: 10, height: 150 },
  returnDefaultText: {
    color: "#C2A9CE",
    fontSize: 12,
    ...Core.gStyle.font("500"),
  },
});
