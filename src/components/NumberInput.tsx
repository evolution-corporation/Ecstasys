import React, { FC, useEffect, useReducer, useRef } from "react";
import * as reactNative from "react-native";
import isMobilePhone from "validator/lib/isMobilePhone";
import Icon from "~assets/icons";
import i18n, { CodeCountryISOType } from "~i18n";
import style, { colors } from "~styles";

const NumberInput: FC<Props> = (props) => {
  const {
    autoFocus = false,
    onChange = (number: string, isValidate) => console.info(number, isValidate),
  } = props;

  const [state, dispatch] = useReducer(
    reducer,
    initState,
    initializationState(props)
  );
  const { regionCode, showSelectRegionList, positionSelectRegionList, phone } =
    state;
  const animation = useRef(new reactNative.Animated.Value(0)).current;
  const animationList = {
    rotate: animation.interpolate({
      inputRange: [0, 1],
      outputRange: ["180deg", "0deg"],
    }),
    editBorderRadius: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [15, 0],
    }),
  };

  useEffect(() => {
    onChange(
      `${listCodePhoneCountry[regionCode]}${phone}`,
      isMobilePhone(`${listCodePhoneCountry[regionCode]}${phone}`)
    );
  }, [regionCode, phone]);

  useEffect(() => {
    if (showSelectRegionList) {
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
  }, [showSelectRegionList]);
  return (
    <>
      <reactNative.Animated.View
        style={[
          styles.background,
          { borderBottomLeftRadius: animationList.editBorderRadius },
        ]}
        onLayout={({ nativeEvent: { layout } }) => {
          dispatch({
            type: "editPositionSelectRegionList",
            payload: {
              x: layout.x,
              y: layout.y + layout.height,
            },
          });
        }}
      >
        <reactNative.TouchableOpacity
          style={styles.buttonRegionSelect}
          onPress={() => dispatch({ type: "reversVisibleModal" })}
        >
          <reactNative.Text style={styles.phoneStyle}>
            {listCodePhoneCountry[regionCode]}
          </reactNative.Text>
          <reactNative.Animated.View
            style={{
              transform: [{ rotate: animationList.rotate }],
              marginLeft: 5,
            }}
          >
            <Icon name="TheArrow" variable={"whiteTop"} />
          </reactNative.Animated.View>
        </reactNative.TouchableOpacity>
        <reactNative.TextInput
          style={[styles.textInputStyle, styles.phoneStyle]}
          placeholder={i18n.t("c44c1286-2e08-4c18-ac68-4bae712c26a8")}
          placeholderTextColor={colors.TextOnTheBackground}
          autoFocus={autoFocus}
          autoComplete={"tel-device"}
          textContentType={"telephoneNumber"}
          importantForAutofill={"yes"}
          keyboardType={"number-pad"}
          maxLength={10}
          returnKeyType={"go"}
          selectionColor={colors.white}
          onChangeText={(number: string) =>
            dispatch({ type: "editPhone", payload: number })
          }
        />
      </reactNative.Animated.View>
      <reactNative.Modal
        transparent={true}
        animationType={"fade"}
        hardwareAccelerated={true}
        onRequestClose={() => dispatch({ type: "closeModal" })}
        visible={showSelectRegionList}
      >
        <reactNative.Pressable
          style={reactNative.StyleSheet.absoluteFill}
          onPress={() => dispatch({ type: "closeModal" })}
        />
        <reactNative.FlatList
          style={[
            styles.flatListStyle,
            {
              left: positionSelectRegionList.x,
              top: positionSelectRegionList.y,
            },
          ]}
          data={CodeCountryISO}
          initialScrollIndex={CodeCountryISO.indexOf(regionCode)}
          renderItem={({ item }) => (
            <FlatListItem
              item={item}
              onChange={(regionCode: CodeCountryISOType) =>
                dispatch({ type: "editRegionCode", payload: regionCode })
              }
            />
          )}
          showsVerticalScrollIndicator={false}
          initialNumToRender={CodeCountryISO.length}
          keyExtractor={(item) => item}
          getItemLayout={(data, index) => ({
            length: styles.selectCodeNumberView.height,
            offset: styles.selectCodeNumberView.height * index,
            index,
          })}
        />
      </reactNative.Modal>
    </>
  );
};

interface Props {
  defaultCode?: CodeCountryISOType;
  autoFocus?: boolean;
  onChange?: (number: string, isValidate: boolean) => void;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "reversVisibleModal":
    case "openModal":
    case "closeModal":
      if (action.type == "reversVisibleModal") {
        state.showSelectRegionList = !state.showSelectRegionList;
      } else {
        state.showSelectRegionList = action.type == "openModal";
      }
      break;
    case "editPositionSelectRegionList":
      state.positionSelectRegionList = action.payload;
      break;
    case "editRegionCode":
      state.regionCode = action.payload;
      state.showSelectRegionList = false;
      break;
    case "editPhone":
      state.phone = action.payload;
      state.showSelectRegionList = false;
      break;
  }
  return { ...state };
}

type Action =
  | ActionReducerWithPayload<"editRegionCode", CodeCountryISOType>
  | ActionReducerWithPayload<"editPositionSelectRegionList", PositionComponent>
  | ActionReducerWithPayload<"editPhone", string>
  | ActionReducerNoWithPayload<"closeModal">
  | ActionReducerNoWithPayload<"openModal">
  | ActionReducerNoWithPayload<"reversVisibleModal">;

interface State {
  regionCode: CodeCountryISOType;
  showSelectRegionList: boolean;
  positionSelectRegionList: PositionComponent;
  phone: string;
}

const initState: State = {
  showSelectRegionList: false,
  positionSelectRegionList: { x: 0, y: 0 },
  regionCode: "RU",
  phone: "",
};

function initializationState(props: Props): (state: State) => State {
  return (state) => {
    state.regionCode = props.defaultCode ?? "RU";
    return {
      ...state,
    };
  };
}

const CodeCountryISO = i18n.getCodeCountryISO(true);

const FlatListItem: FC<{
  item: CodeCountryISOType;
  onChange: (code: CodeCountryISOType) => void;
}> = ({ item, onChange }) => (
  <reactNative.TouchableOpacity
    style={styles.selectCodeNumberView}
    onPress={() => onChange(item)}
  >
    <reactNative.Text style={styles.selectCodeNumberText}>
      {listCodePhoneCountry[item]}
    </reactNative.Text>
    <reactNative.Text style={styles.selectCountryText}>
      {i18n.getCountryName(item)}
    </reactNative.Text>
  </reactNative.TouchableOpacity>
);

const styles = reactNative.StyleSheet.create({
  background: {
    borderRadius: 15,
    backgroundColor: colors.WhiteGlass,
    borderWidth: 1,
    borderColor: colors.StrokePanel,
    height: 45,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  buttonRegionSelect: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 55,
    height: "100%",
  },
  phoneStyle: {
    color: "#FFFFFF",
    fontSize: 14,
    ...style.getFontOption("500"),
  },
  textInputStyle: {
    borderLeftColor: colors.StrokePanel,
    borderLeftWidth: 1,
    width: "100%",
    height: "100%",
    paddingHorizontal: 10,
  },
  flatListStyle: {
    position: "absolute",
    top: 45,
    maxHeight: 144,
    width: "80%",
    alignSelf: "flex-start",
    backgroundColor: colors.white,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    transform: [{ translateY: -1 }],
  },
  selectCodeNumberView: {
    width: "100%",
    height: 28,
    flexDirection: "row",
    alignItems: "center",
  },
  selectCodeNumberText: {
    color: colors.DarkLetters,
    width: 55,
    textAlign: "center",
    fontSize: 14,
    ...style.getFontOption("500"),
  },
  selectCountryText: {
    paddingLeft: 24,
    opacity: 0.22,
    color: colors.black,
    fontSize: 13,
    ...style.getFontOption("400"),
  },
});

const listCodePhoneCountry: { [index in CodeCountryISOType]: string } = {
  AU: "+61",
  AT: "+43",
  AZ: "+994",
  AL: "+355",
  DZ: "+213",
  AO: "+244",
  AD: "+376",
  AG: "+1 268",
  AR: "+54",
  AM: "+374",
  AF: "+93",
  BS: "+1 242",
  BD: "+880",
  BB: "+1 246",
  BH: "+973",
  BZ: "+501",
  BY: "+375",
  BE: "+32",
  BJ: "+229",
  BG: "+359",
  BO: "+591",
  BA: "+387",
  BW: "+267",
  BR: "+55",
  BN: "+673",
  BF: "+226",
  BI: "+257",
  BT: "+975",
  VU: "+678",
  VA: "+379",
  GB: "+44",
  HU: "+36",
  VE: "+58",
  TL: "+670",
  VN: "+84",
  GA: "+241",
  HT: "+509",
  GY: "+592",
  GM: "+220",
  GH: "+233",
  GT: "+502",
  GN: "+224",
  GW: "+245",
  DE: "+49",
  HN: "+504",
  PS: "+970",
  GD: "+1 473",
  GR: "+30",
  GE: "+995",
  DK: "+45",
  DJ: "+253",
  DM: "+1 767",
  DO: "+1 809",
  CD: "+243",
  EG: "+20",
  ZM: "+260",
  ZW: "+263",
  IL: "+972",
  IN: "+91",
  ID: "+62",
  JO: "+962",
  IQ: "+964",
  IR: "+98",
  IE: "+353",
  IS: "+354",
  ES: "+34",
  IT: "+39",
  YE: "+967",
  CV: "+238",
  KZ: "+7",
  KH: "+855",
  CM: "+237",
  CA: "+1",
  QA: "+974",
  KE: "+254",
  CY: "+357",
  KG: "+996",
  KI: "+686",
  CN: "+86",
  KP: "+850",
  CO: "+57",
  KM: "+269",
  CR: "+506",
  CI: "+225",
  CU: "+53",
  KW: "+965",
  LA: "+856",
  LV: "+371",
  LS: "+266",
  LR: "+231",
  LB: "+961",
  LY: "+218",
  LT: "+370",
  LI: "+423",
  LU: "+352",
  MU: "+230",
  MR: "+222",
  MG: "+261",
  MW: "+265",
  MY: "+60",
  ML: "+223",
  MV: "+960",
  MT: "+356",
  MA: "+212",
  MH: "+692",
  MX: "+52",
  MZ: "+258",
  MD: "+373",
  MC: "+377",
  MN: "+976",
  MM: "+95",
  NA: "+264",
  NR: "+674",
  NP: "+977",
  NE: "+227",
  NG: "+234",
  NL: "+31",
  NI: "+505",
  NZ: "+64",
  NO: "+47",
  AE: "+971",
  OM: "+968",
  PK: "+92",
  PW: "+680",
  PA: "+507",
  PG: "+675",
  PY: "+595",
  PE: "+51",
  PL: "+48",
  PT: "+351",
  CG: "+242",
  KR: "+82",
  RU: "+7",
  RW: "+250",
  RO: "+40",
  SV: "+503",
  WS: "+685",
  SM: "+378",
  ST: "+239",
  SA: "+966",
  MK: "+389",
  SC: "+248",
  SN: "+221",
  VC: "+1 784",
  KN: "+1 869",
  LC: "+1 758",
  RS: "+381",
  SG: "+65",
  SY: "+963",
  SK: "+421",
  SI: "+386",
  SB: "+677",
  SO: "+252",
  SD: "+249",
  SR: "+597",
  US: "+1",
  SL: "+232",
  TJ: "+992",
  TH: "+66",
  TZ: "+255",
  TG: "+228",
  TO: "+676",
  TT: "+1 868",
  TV: "+688",
  TN: "+216",
  TM: "+993",
  TR: "+90",
  UG: "+256",
  UZ: "+998",
  UA: "+380",
  UY: "+598",
  FM: "+691",
  FJ: "+679",
  PH: "+63",
  FI: "+358",
  FR: "+33",
  HR: "+385",
  CF: "+236",
  TD: "+235",
  ME: "+382",
  CZ: "+420",
  CL: "+56",
  CH: "+41",
  SE: "+46",
  LK: "+94",
  EC: "+593",
  GQ: "+240",
  ER: "+291",
  SZ: "+268",
  EE: "+372",
  ET: "+251",
  ZA: "+27",
  OS: "+7",
  SS: "+211",
  JM: "+1 876",
  JP: "+81",
};

export default NumberInput;
