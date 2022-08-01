import React, { useReducer, useMemo, useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import type { FC } from "react";
import type { ViewProps } from "react-native";
import i18n from "~i18n";
import style, { colors } from "~styles";

const toDay = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  new Date().getDate()
);

const SelectBirthday: FC<SelectBirthdayProps> = (props) => {
  const { onChange, init } = props;
  const [selectDay, setSelectDay] = useState<number>(
    init?.getDate() ?? new Date().getDate()
  );
  const [selectMonth, setSelectMonth] = useState<number>(
    init?.getMonth() ?? new Date().getMonth()
  );
  const [selectYear, setSelectYear] = useState<number>(
    init?.getFullYear() ?? new Date().getFullYear()
  );
  const DateList = useMemo(() => {
    const dateList = [];
    for (
      let i = 1;
      i <= new Date(selectYear, selectMonth + 1, 0).getDate();
      i++
    ) {
      dateList.push(i);
    }
    return dateList;
  }, [selectYear, selectMonth]);
  const FullYearList = useMemo(() => {
    const fullYearList = [];
    for (let i = 0; i <= 100; i++) {
      fullYearList.push(toDay.getFullYear() - i);
    }
    return fullYearList;
  }, [selectDay]);
  useEffect(() => {
    onChange({ year: selectYear, month: selectMonth, day: selectDay });
  }, [selectDay, selectMonth, selectYear]);

  const age = useMemo(
    () =>
      toDay.getFullYear() -
      selectYear -
      (toDay < new Date(toDay.getFullYear(), selectMonth, selectDay) ? 1 : 0),
    [selectDay, selectMonth, selectYear]
  );

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
          dataSource={DateList}
          selectedIndex={selectDay - 1}
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
            setSelectDay(Number(data));
          }}
        />
        <ScrollPicker
          key={"month"}
          style={styles.dateScroll}
          dataSource={i18n.monthList.map((name) => name.toLowerCase())}
          selectedIndex={selectMonth}
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
            setSelectMonth(selectedIndex);
          }}
        />
        <ScrollPicker
          key={"year"}
          style={styles.dateScroll}
          dataSource={FullYearList}
          selectedIndex={FullYearList.indexOf(selectYear)}
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
            setSelectYear(Number(data));
          }}
        />
      </View>
      <Text
        style={[styles.standardTextStyle, { color: "#FFFFFF", fontSize: 15 }]}
      >
        {i18n.t("age", { count: age })}
      </Text>
    </View>
  );
};

interface SelectBirthdayProps extends ViewProps {
  onChange: {
    (birthDay: { year: number; month: number; day: number }): void;
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
    color: colors.white,
    ...style.getFontOption("500"),
  },
});

export default SelectBirthday;
