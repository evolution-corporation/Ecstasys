import React, { useReducer, useMemo, useEffect } from "react";
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
  const { onChange } = props;
  const [state, dispatch] = useReducer(
    SelectBirthdayReducer,
    SelectBirthdayInitState
  );

  const DateList = useMemo(() => {
    const dateList = [];
    for (
      let i = 1;
      i <= new Date(state.year_birthday, state.month_birthday + 1, 0).getDate();
      i++
    ) {
      dateList.push(i);
    }
    return dateList;
  }, [state.month_birthday, state.year_birthday]);
  const FullYearList = useMemo(() => {
    const fullYearList = [];
    for (let i = 0; i <= 100; i++) {
      fullYearList.push(toDay.getFullYear() - i);
    }
    return fullYearList;
  }, [dispatch]);
  useEffect(() => {
    onChange(
      new Date(state.year_birthday, state.month_birthday, state.date_birthday)
    );
  }, [state.month_birthday, state.year_birthday, state.date_birthday]);

  return (
    <View style={styles.background}>
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
          selectedIndex={toDay.getDate() - 1}
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
            dispatch({ type: "editDate", payload: Number(data) });
          }}
        />
        <ScrollPicker
          key={"month"}
          style={styles.dateScroll}
          dataSource={i18n.monthList.map((name) => name.toLowerCase())}
          selectedIndex={toDay.getMonth()}
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
            dispatch({ type: "editMonth", payload: Number(selectedIndex) });
          }}
        />
        <ScrollPicker
          key={"year"}
          style={styles.dateScroll}
          dataSource={FullYearList}
          selectedIndex={16}
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
            dispatch({ type: "editFullYear", payload: Number(data) });
          }}
        />
      </View>
      <Text
        style={[styles.standardTextStyle, { color: "#FFFFFF", fontSize: 15 }]}
      >
        {i18n.t("age", { count: state.age })}
      </Text>
    </View>
  );
};

function SelectBirthdayReducer(
  state: SelectBirthdayState,
  action: SelectBirthdayAction
): SelectBirthdayState {
  switch (action.type) {
    case "editDate":
      state.date_birthday = action.payload;
      break;
    case "editMonth":
      state.month_birthday = action.payload;
      break;
    case "editFullYear":
      state.year_birthday = action.payload;
      break;
  }
  state.age =
    toDay.getFullYear() -
    state.year_birthday -
    (toDay <
    new Date(toDay.getFullYear(), state.month_birthday, state.date_birthday)
      ? 1
      : 0);
  return { ...state };
}

type ScrollSelectAction = {
  type: "editDate" | "editMonth" | "editFullYear";
  payload: number;
};

interface SelectBirthdayState {
  date_birthday: number;
  month_birthday: number;
  year_birthday: number;
  age: number;
}

const SelectBirthdayInitState: SelectBirthdayState = {
  date_birthday: toDay.getDate(),
  month_birthday: toDay.getMonth(),
  year_birthday: toDay.getFullYear() - 16,
  age: 16,
};
type SelectBirthdayAction = {
  type: "editDate" | "editMonth" | "editFullYear";
  payload: number;
};

interface SelectBirthdayProps extends ViewProps {
  onChange: { (birthDay: Date): void };
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
