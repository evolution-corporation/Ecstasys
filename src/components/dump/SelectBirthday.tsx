import React, {
  useReducer,
  useMemo,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import type { FC } from "react";
import type { ViewProps } from "react-native";
import Tools from "~core";
import { createArrayLength } from "~tools";

const toDay = new Date();
toDay.setFullYear(toDay.getFullYear());
toDay.setHours(0, 0, 0, 0);

const yearPayloadList = createArrayLength(toDay.getFullYear() - 1899).map(
  (_, index) => 1900 + index
);

const monthPayloadList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
].map((item) => Tools.i18n.t(item));

function getAge(date: Date) {
  const birthday = new Date(toDay.getTime() - date.getTime());
  return birthday.getFullYear() - 1970;
}

function copyDate(original: Date): Date {
  return new Date(original);
}

const SelectBirthday: FC<SelectBirthdayProps> = (props) => {
  const { onChange, init } = props;
  const [age, setAge] = useState<number>(() => {
    if (init) {
      return getAge(init);
    }
    return 16;
  });
  const [currentDate, setCurrentDate] = useState<{
    date: number;
    month: number;
    year: number;
  }>({
    date: (init ?? toDay).getDate(),
    month: (init ?? toDay).getMonth(),
    year: (init ?? toDay).getFullYear() - (init ? 0 : 16),
  });
  const [selectedIsCurrentDate, setSelectedIsCurrentDate] = useState<{
    month: boolean;
    year: boolean;
  }>({
    year: toDay.getFullYear() === currentDate.year,
    month: toDay.getMonth() === currentDate.month,
  });
  const [dateList, setDateList] = useState<number[]>(
    createArrayLength(
      new Date(currentDate.year, currentDate.month + 1, 0).getDate()
    ).map((_, index) => index + 1)
  );

  useEffect(() => {
    setDateList(
      createArrayLength(
        new Date(currentDate.year, currentDate.month + 1, 0).getDate()
      ).map((_, index) => index + 1)
    );
    setSelectedIsCurrentDate({
      year: toDay.getFullYear() === currentDate.year,
      month:
        toDay.getFullYear() === currentDate.year &&
        toDay.getMonth() === currentDate.month,
    });
    const _currentDate = new Date(
      currentDate.year,
      currentDate.month,
      currentDate.date
    );
    setAge(getAge(_currentDate));
    if (onChange) {
      onChange(_currentDate);
    }
  }, [currentDate]);

  return (
    <View style={styles.background} {...props}>
      <View
        style={{
          flexDirection: "row",
          marginBottom: 20,
          width: 187,
          justifyContent: "space-between",
        }}
      >
        <ScrollPicker
          key={"Date"}
          style={styles.dateScroll}
          dataSource={dateList.filter(
            (_, index) =>
              !selectedIsCurrentDate.month || index < toDay.getDate()
          )}
          selectedIndex={currentDate.date - 1}
          itemHeight={46}
          highlightColor={"#FFFFFF"}
          wrapperColor={"transparent"}
          highlightBorderWidth={2}
          wrapperHeight={122}
          renderItem={(data, index, isSelected) => {
            return (
              <Text
                style={[
                  styles.standardTextStyle,
                  { opacity: isSelected ? 1 : 0.5, color: "#FFFFFF" },
                ]}
              >
                {data}
              </Text>
            );
          }}
          onValueChange={(data, selectedIndex) => {
            setCurrentDate({ ...currentDate, date: Number(data) });
          }}
        />
        <ScrollPicker
          key={"month"}
          style={styles.dateScroll}
          dataSource={monthPayloadList.filter(
            (_, index) =>
              !selectedIsCurrentDate.year || index <= toDay.getMonth()
          )}
          selectedIndex={currentDate.month}
          itemHeight={46}
          highlightColor={"#FFFFFF"}
          wrapperColor={"transparent"}
          highlightBorderWidth={2}
          wrapperHeight={122}
          renderItem={(data, index, isSelected) => {
            return (
              <Text
                style={[
                  styles.standardTextStyle,
                  { opacity: isSelected ? 1 : 0.5, color: "#FFFFFF" },
                ]}
              >
                {data}
              </Text>
            );
          }}
          onValueChange={(data, selectedIndex) => {
            setCurrentDate({ ...currentDate, month: selectedIndex });
          }}
        />
        <ScrollPicker
          key={"year"}
          style={styles.dateScroll}
          dataSource={yearPayloadList}
          selectedIndex={yearPayloadList.indexOf(currentDate.year)}
          itemHeight={46}
          highlightColor={"#FFFFFF"}
          wrapperColor={"transparent"}
          highlightBorderWidth={2}
          wrapperHeight={122}
          renderItem={(data, index, isSelected) => {
            return (
              <Text
                style={[
                  styles.standardTextStyle,
                  { opacity: isSelected ? 1 : 0.5, color: "#FFFFFF" },
                ]}
              >
                {data}
              </Text>
            );
          }}
          onValueChange={(data, selectedIndex) => {
            setCurrentDate({ ...currentDate, year: Number(data) });
          }}
        />
      </View>
      <Text
        style={[styles.standardTextStyle, { color: "#FFFFFF", fontSize: 15 }]}
      >
        {Tools.i18n.t("age", { count: age })}
      </Text>
    </View>
  );
};

interface SelectBirthdayProps extends ViewProps {
  onChange?: {
    (birthDay: Date): void;
  };
  init?: Date;
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    alignItems: "center",
  },
  dateScroll: {
    marginHorizontal: 1,
  },
  standardTextStyle: {
    fontSize: 11,
    color: "#FFFFFF",
    ...Tools.gStyle.font("500"),
  },
});

export default SelectBirthday;
