import React, { useEffect, useRef, useState } from "react";
import { ColorValue, View, Text, StyleSheet, ViewProps } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";

import Tools from "~core";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

const ViewStatisticsMeditation: React.FC<Props> = (props) => {
  const {
    style,
    type = "week",
    colorR = "#9765A8",
    colorL = "#9765A8",
  } = props;
  const [count, setCount] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const { getItem } = useAsyncStorage("@StatisticsMeditation");

  useEffect(() => {
    const initStatistics = async () => {
      const statisticsAS = await getItem();
      if (!!statisticsAS) {
        const statistics: { timeLength: number; time: Date }[] = JSON.parse(
          statisticsAS
        ).map((item: { timeLength: number; time: string }) => ({
          ...item,
          time: new Date(item.time),
        }));
        let timeFilter: Date | null;
        switch (type) {
          case "week":
            timeFilter = new Date();
            timeFilter.setHours(23, 59, 59, 999);
            timeFilter.setDate(timeFilter.getDate() - timeFilter.getDay());
            break;
          case "month":
            timeFilter = new Date();
            timeFilter.setHours(23, 59, 59, 999);
            timeFilter.setMonth(timeFilter.getMonth() + 1);
            timeFilter.setDate(0);
            break;
          case "all":
            timeFilter = null;
            break;
        }
        if (timeFilter === null) {
          setCount(statistics.length);
          setTime(
            Math.floor(
              statistics.reduce((sum, item) => sum + item.timeLength, 0) / 60000
            )
          );
        } else {
          const flittedMeditation = statistics.filter((item) =>
            timeFilter !== null
              ? timeFilter.getTime() >= item.time.getTime()
              : false
          );
          setCount(flittedMeditation.length);
          setTime(
            Math.floor(
              flittedMeditation.reduce(
                (sum, item) => sum + item.timeLength,
                0
              ) / 60000
            )
          );
        }
      } else {
        setCount(0);
        setTime(0);
      }
    };

    initStatistics().catch(console.error);
  }, [type]);

  return (
    <View style={[style, { flexDirection: "row" }]}>
      {count !== null && (
        <View
          style={[
            styles.staticCardBackground,
            styles.staticCardBackgroundLeft,
            { borderColor: colorL },
          ]}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <Feather name={"headphones"} size={40} color={colorL} />
            <Text style={[styles.staticCardText, { color: colorL }]}>
              {Tools.i18n.t("8f6752b0-6ada-4344-a0b9-dd471eee1297", {
                count: count,
              })}
            </Text>
          </View>
          <Text style={[styles.staticCardData, { color: colorL }]}>
            {count}
          </Text>
        </View>
      )}

      {time !== null && (
        <View
          style={[
            styles.staticCardBackground,
            styles.staticCardBackgroundRight,
            { backgroundColor: colorR },
          ]}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <MaterialIcons name={"timer"} size={40} color={"#FFFFFF"} />
            <Text style={[styles.staticCardText, { color: "#FFFFFF" }]}>
              {Tools.i18n.t("dc1fa27d-9146-4a08-a241-7c10997eb654", {
                count: time,
              })}
            </Text>
          </View>
          <Text style={[styles.staticCardData, { color: "#FFFFFF" }]}>
            {time}
          </Text>
        </View>
      )}
    </View>
  );
};

export type ViewStatisticsMeditationType = "week" | "month" | "all";

interface Props extends ViewProps {
  type: ViewStatisticsMeditationType;
  colorR?: ColorValue;
  colorL?: ColorValue;
}

const styles = StyleSheet.create({
  staticCardBackground: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 20,
    flex: 1,
  },
  staticCardBackgroundLeft: {
    borderColor: "#9765A8",
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    marginRight: 7.5,
  },
  staticCardBackgroundRight: {
    marginLeft: 7.5,
  },
  staticCardText: {
    lineHeight: 14,
    textAlign: "center",
    fontSize: 12,
    ...Tools.gStyle.font("400"),
  },
  staticCardData: {
    fontSize: 32,
    ...Tools.gStyle.font("700"),
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
  },
  row: {
    transform: [{ rotateZ: "180deg" }, { scale: 1.7 }],
    alignSelf: "center",
  },
});

export default ViewStatisticsMeditation;
