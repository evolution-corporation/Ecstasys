import react from "react";
import * as reactNative from "react-native";
import Icon from "~assets/icons";
import i18n from "~i18n";
import style, { colors } from "~styles";
import { checkNickname as checkNicknameServer } from "~api/user";
enum StatusCheck {
  NULL,
  FREE,
  USED,
  INCORRECT,
}

enum Status {
  INPUT,
  LOADING,
  READY,
}

const NicknameInput: react.FC<Props> = (props) => {
  const {
    generateNickname = false,
    onChange,
    onEndChange,
    styleNicknameInputView,
    styleNicknameInputText,
    autFocus = false,
    errorColor = colors.orange,
    placeHolderColor = colors.DarkGlass,
    nickNameInit,
    showMessage = false,
    styleMessage,
  } = props;
  const [state, dispatch] = react.useReducer(reducer, initState);
  const checkNickname = async (nickName: string) => {
    try {
      const { checking_unique_nick_name, nickname_variable } =
        await checkNicknameServer(nickName, generateNickname);
      dispatch({
        type: "VerificationResult",
        payload: {
          result: checking_unique_nick_name
            ? StatusCheck.FREE
            : StatusCheck.USED,
          possibleNicknames: nickname_variable,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const nickNameInput = (nickName: string) => {
    if (onChange) onChange(nickName);
    if (state.timer) clearTimeout(state.timer);
    dispatch({ type: "NicknameInput", payload: nickName });
    if (nickName.length == 0) {
      dispatch({
        type: "VerificationResult",
        payload: { result: StatusCheck.NULL },
      });
    } else if (
      !(
        /^[a-z\d\._]*$/.test(nickName)
        // /^[a-z][a-z\d\._]*[a-z]$/.test(nickName) &&
        // nickName.replace(/[^\._]/g, "").length <= 4 &&
        // !/(\._|_\.)|((\.|_){2,})/g.test(nickName)
      ) ||
      nickName.length > 16
    ) {
      dispatch({
        type: "VerificationResult",
        payload: { result: StatusCheck.INCORRECT },
      });
    } else if (nickName.length >= 1) {
      dispatch({
        type: "CheckNickname",
        payload: {
          nickName: nickName,
          timerID: setTimeout(() => checkNickname(nickName), 500),
        },
      });
    }
  };

  react.useEffect(() => {
    onEndChange(state.nickName, state.statusCheck == StatusCheck.FREE);
  }, [state.nickName, state.statusCheck]);

  const statusViewInfo = react.useMemo<StatusViewInfo>(() => {
    const info: StatusViewInfo = {
      color: {
        border: colors.StrokePanel,
        text: colors.white,
      },
    };
    switch (state.status) {
      case Status.INPUT:
        break;
      case Status.LOADING:
        info.image = (
          <reactNative.ActivityIndicator
            color={styleNicknameInputText?.color ?? colors.white}
            size={"small"}
          />
        );
        break;
      case Status.READY:
        switch (state.statusCheck) {
          case StatusCheck.FREE:
            info.image = <Icon name={"CheckMarker"} />;
            break;
          case StatusCheck.USED:
          case StatusCheck.INCORRECT:
            if (typeof errorColor == "string") {
              info.color = {
                border: errorColor,
                text: errorColor,
              };
            } else if (typeof errorColor == "object") {
              info.color = errorColor;
            }

            info.image = (
              <reactNative.Pressable onPress={() => clear()}>
                <Icon name={"CrossMarker"} />
              </reactNative.Pressable>
            );
            info.text =
              state.statusCheck == StatusCheck.INCORRECT
                ? i18n.t("d6a4f1c4-4344-4712-ac61-0c81292d0994")
                : i18n.t("564efb95-c192-4406-830f-13b3612bae0e");
        }
        break;
    }
    return info;
  }, [state.status, state.statusCheck]);

  const clear = () => {
    nickNameInput("");
  };

  react.useEffect(() => {
    if (nickNameInit) nickNameInput(nickNameInit);
  }, [dispatch]);

  return (
    <>
      <reactNative.View
        style={[
          styles.backgroundTextInput,
          styleNicknameInputView,
          {
            borderColor: statusViewInfo.color.border,
          },
        ]}
      >
        <reactNative.TextInput
          onChangeText={nickNameInput}
          style={[styles.textInputView, styleNicknameInputText]}
          autoFocus={autFocus}
          value={state.nickName}
          placeholderTextColor={placeHolderColor}
          maxLength={16}
          placeholder={i18n.t("f212a1ac-9688-4671-bbd1-6cbe20662ad7")}
        />
        <reactNative.View style={styles.indicatorImage}>
          {statusViewInfo.image}
        </reactNative.View>
      </reactNative.View>
      {showMessage && statusViewInfo.text && (
        <reactNative.Text
          style={[
            styles.messageStyle,
            styleMessage,
            { color: statusViewInfo.color.text },
          ]}
        >
          {statusViewInfo.text}
        </reactNative.Text>
      )}
      {generateNickname && (
        <VariableListNickname
          variableNickname={state.possibleNicknames}
          onChange={nickNameInput}
        />
      )}
    </>
  );
};

const initState: State = {
  nickName: "",
  statusCheck: StatusCheck.NULL,
  possibleNicknames: [],
  status: Status.READY,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "CheckNickname":
      state.nickName = action.payload.nickName;
      state.timer = action.payload.timerID;
      state.status = Status.LOADING;
      break;
    case "NicknameInput":
      state.status = Status.INPUT;
      state.nickName = action.payload;
      state.possibleNicknames = [];
      break;
    case "VerificationResult":
      state.status = Status.READY;
      state.statusCheck = action.payload.result;
      if (
        state.statusCheck == StatusCheck.USED &&
        action.payload.possibleNicknames
      ) {
        state.possibleNicknames = action.payload.possibleNicknames;
      } else {
        action.payload.possibleNicknames = [];
      }
      break;
  }
  return { ...state };
}

interface Props {
  generateNickname?: boolean;
  onChange?: (nickName: string) => void;
  onEndChange: (nickName: string, status: boolean) => void;
  styleNicknameInputText?: reactNative.TextStyle;
  styleNicknameInputView?: reactNative.ViewStyle;
  errorColor?: ErrorColor | reactNative.ColorValue;
  placeHolderColor?: reactNative.ColorValue;
  autFocus?: boolean;
  nickNameInit?: string;
  showMessage?: boolean;
  styleMessage?: reactNative.TextStyle;
}

interface State {
  nickName: string;
  statusCheck: StatusCheck;
  possibleNicknames: string[];
  status: Status;
  timer?: NodeJS.Timer;
}

type Action =
  | ActionReducerWithPayload<
      "CheckNickname",
      { timerID: NodeJS.Timer; nickName: string }
    >
  | ActionReducerWithPayload<"NicknameInput", string>
  | ActionReducerWithPayload<
      "VerificationResult",
      { result: StatusCheck; possibleNicknames?: string[] }
    >;

type StatusViewInfo = { text?: string; image?: JSX.Element; color: ErrorColor };

const VariableListNickname: react.FC<VariableListNicknameProps> = (props) => {
  const animation = react.useRef(new reactNative.Animated.Value(0)).current;
  react.useEffect(() => {
    if (props.variableNickname.length > 0) {
      reactNative.Animated.timing(animation, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      reactNative.Animated.timing(animation, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [props.variableNickname.length]);
  if (props.variableNickname.length == 0) return null;
  return (
    <reactNative.Animated.View
      style={[styles.VariableListNicknameBackGround, { opacity: animation }]}
    >
      {props.variableNickname.map((nickname, index) => (
        <RenderVariableNickname
          nickName={nickname}
          onPress={() => props.onChange(nickname)}
          key={nickname}
          showBorderTop={index != 0}
        />
      ))}
    </reactNative.Animated.View>
  );
};

const RenderVariableNickname: react.FC<{
  nickName: string;
  onPress: () => void;
  showBorderTop: boolean;
}> = (props) => {
  return (
    <reactNative.TouchableOpacity
      key={props.nickName}
      onPress={props.onPress}
      style={[
        styles.VariableNicknameBackground,
        props.showBorderTop
          ? { borderTopWidth: reactNative.StyleSheet.hairlineWidth }
          : null,
      ]}
    >
      <reactNative.Text style={styles.VariableNicknameText}>
        {props.nickName}
      </reactNative.Text>
      <Icon name={"CheckMarker"} variable={"green"} />
    </reactNative.TouchableOpacity>
  );
};

interface VariableListNicknameProps {
  variableNickname: string[];
  onChange: (nickName: string) => void;
}

const styles = reactNative.StyleSheet.create({
  textInputView: {
    color: colors.white,
    fontSize: 14,
    ...style.getFontOption("400"),
    flex: 1,
    paddingRight: 44,
  },
  backgroundTextInput: {
    width: "100%",
    height: 45,
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: colors.grayGlass,
    paddingHorizontal: 15,
  },
  indicatorImage: {
    minWidth: 20,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  VariableNicknameBackground: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    alignItems: "center",
    height: 44,
    borderColor: colors.StrokePanel,
  },
  separator: {
    borderColor: colors.StrokePanel,
    borderWidth: reactNative.StyleSheet.hairlineWidth,
    width: "100%",
  },
  VariableNicknameText: {
    color: colors.DarkLetters,
    fontSize: 13,
    ...style.getFontOption("400"),
  },
  messageStyle: {
    fontSize: 13,
    ...style.getFontOption("400"),
    textAlign: "center",
    marginVertical: 9,
  },
  VariableListNicknameBackGround: {
    backgroundColor: colors.white,
    borderRadius: 15,
    width: "100%",
  },
});

type ErrorColor = {
  border: reactNative.ColorValue;
  text: reactNative.ColorValue;
};

export default NicknameInput;
