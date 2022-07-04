import React, {
  FC,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useMemo,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import i18n from "~i18n";
import style, { colors } from "~styles";

const countCode = 6;
const keyList = [0, 1, 2, 3, 4, 5];

const SMSCodeInput = forwardRef<SMSCodeInputRef, SMSCodeInputProps>(
  (props, ref) => {
    const {
      autoFocus = false,
      onChange,
      onEndInput = (text) => console.info(text),
      style,
    } = props;
    const refList = keyList.map((key) => useRef<TextInput>(null));
    const [code, setCode] = useState<string>("");

    const inputCode = (codePart: string, key: number) => {
      const isLast = key == countCode - 1;
      if (code.length == key) {
        setCode(code + codePart);
      } else {
        setCode(
          code.slice(0, key) + codePart + (!isLast ? code.slice(key + 1) : "")
        );
      }
      if (onChange) onChange(Number(codePart));
    };

    useEffect(() => {
      if (code.length == countCode) {
        onEndInput(code);
        refList[countCode - 1].current?.blur();
      } else {
        refList[code.length].current?.focus();
      }
    }, [code]);

    const focusTextInput = () => {
      refList[
        code.length == countCode ? countCode - 1 : code.length
      ].current?.focus();
    };

    const clearAll = () => {
      refList.forEach((textInput) => textInput.current?.clear());
      refList[0].current?.focus();
    };

    const clear = () => {
      if (code.length > 0) {
        refList[code.length - 1].current?.clear();
        setCode(code.slice(0, code.length - 1));
      }
    };

    useImperativeHandle(ref, () => ({
      clear: clearAll,
    }));

    return (
      <View style={[styles.codeInputBackground, style]}>
        {keyList.map((key) => (
          <TextInput
            key={`SMSCodeKey_${key}`}
            ref={refList[key]}
            style={[
              styles.codeInputTextStyle,
              key == 0
                ? { marginLeft: 0 }
                : key == keyList.length - 1
                ? { marginRight: 0 }
                : null,
            ]}
            maxLength={1}
            autoCorrect={false}
            keyboardType={"numeric"}
            returnKeyType={"next"}
            contextMenuHidden={false}
            caretHidden={true}
            onFocus={focusTextInput}
            onChangeText={(text) => inputCode(text, key)}
            autoFocus={key == 0 && autoFocus}
            onKeyPress={({ nativeEvent: { key } }) => {
              if (key == "Backspace") {
                clear();
              }
            }}
          />
        ))}
      </View>
    );
  }
);

interface SMSCodeInputProps {
  onChange?: (code: number) => void;
  onEndInput?: (code: string) => void;
  style?: ViewStyle;
  autoFocus?: boolean;
}

interface SMSCodeInputRef {
  clear: () => void;
}

export default SMSCodeInput;

export const SMSCodeInputInfo: FC<SMSCodeInputInfoProps> = (props) => {
  const { status, onPress, style, seconds = 60 } = props;
  const [timerSeconds, setTimerSeconds] = useState<number>(seconds);
  const [timerID, setTimerID] = useState<NodeJS.Timeout | null>(null);

  const _seconds = useMemo<string>(() => {
    const second = timerSeconds % 60;
    if (second < 10) {
      return `0${second}`;
    } else {
      return second.toString();
    }
  }, [timerSeconds]);
  const _minutes = useMemo<string>(() => {
    const minute = Math.floor(timerSeconds / 60);
    if (minute < 10) {
      return `0${minute}`;
    } else {
      return minute.toString();
    }
  }, [Math.floor(timerSeconds)]);

  const startTimer = () => {
    if (timerID == null) timer(seconds);
  };

  const stopTimer = () => {
    if (timerID != null) {
      clearTimeout(timerID);
      setTimerID(null);
    }
  };

  const timer = (second_: number) => {
    setTimerSeconds(second_);
    if (second_ > 0) {
      setTimerID(setTimeout(timer, 1000, second_ - 1));
    } else {
      stopTimer();
    }
  };

  useEffect(() => {
    if (status == SMSCodeInputInfoShow.loadingIndicator) {
      stopTimer();
    } else {
      startTimer();
    }
  }, [status]);

  switch (status) {
    case SMSCodeInputInfoShow.loadingIndicator:
      return <ActivityIndicator color={colors.white} style={style} />;
    case SMSCodeInputInfoShow.requestSMS:
      if (timerSeconds == 0) {
        return (
          <Pressable onPress={onPress} style={style}>
            <Text style={styles.timerText}>
              {i18n.t("2f46f68f-1684-45e3-8e90-391b25bcbcba")}
            </Text>
          </Pressable>
        );
      } else {
        return (
          <View style={[styles.timerBackground, style]}>
            <Text style={styles.textPlaceHolder}>
              {i18n.t("70baccaa-b4de-4f71-8221-f5f16200887f")}
            </Text>
            <Text style={styles.timerText}>{`${_minutes}:${_seconds}`}</Text>
          </View>
        );
      }
  }
};

interface SMSCodeInputInfoProps {
  status: SMSCodeInputInfoShow;
  onPress?: () => void;
  style?: ViewStyle;
  seconds?: number;
}

const styles = StyleSheet.create({
  codeInputBackground: {
    flexDirection: "row",
  },
  codeInputTextStyle: {
    backgroundColor: colors.WhiteGlass,
    borderColor: colors.StrokePanel,
    borderRadius: 15,
    borderWidth: 1,
    color: colors.white,
    fontSize: 24,
    ...style.getFontOption("700"),
    height: 48,
    width: 48,
    textAlign: "center",
    textAlignVertical: "center",
    marginHorizontal: 3,
  },
  timerText: {
    color: colors.white,
    fontSize: 13,
    ...style.getFontOption("600"),
  },
  textPlaceHolder: {
    color: colors.TextOnTheBackground,
    fontSize: 13,
    ...style.getFontOption("400"),
  },
  timerBackground: {
    alignItems: "center",
  },
});

export enum SMSCodeInputInfoShow {
  loadingIndicator,
  requestSMS,
}
