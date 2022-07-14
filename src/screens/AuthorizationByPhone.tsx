import React, {
  Component,
  ComponentRef,
  createRef,
  FC,
  RefObject,
} from "react";
import { Animated, StyleSheet, Text } from "react-native";
import BackgroundGradient from "~containers/BackgroundGradient";
import ColorButton from "~components/ColorButton";
import NumberInput from "~components/NumberInput";
import i18n from "~i18n";
import style, { colors, styleText } from "~styles";
import * as expoFirebaseRecaptcha from "expo-firebase-recaptcha";
import * as auth_1 from "firebase/auth";
import app from "~firebase";
import SMSCodeInput, * as SMSCodeInput_1 from "~components/SMSCodeInput";
import Toast from "~components/Toast";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { NavigatorScreenParams } from "@react-navigation/native";

const auth = auth_1.getAuth(app);

export class test extends Component<Props, State> {
  private reCAPTCHA: RefObject<expoFirebaseRecaptcha.FirebaseRecaptchaVerifierModal> =
    createRef();
  private codeInput: RefObject<ComponentRef<typeof SMSCodeInput>> = createRef();
  private toast: RefObject<ComponentRef<typeof Toast>> = createRef();

  constructor(props: Props) {
    super(props);
    this.state = {
      screenPart: ScreenPart.numberInput,
      numberIsValidate: false,
      statusSMSCode: SMSCodeInput_1.SMSCodeInputInfoShow.loadingIndicator,
    };
  }

  render() {
    let screenPart = null;
    switch (this.state.screenPart) {
      case ScreenPart.numberInput:
        screenPart = <></>;
        break;
      case ScreenPart.SMSCodeInput:
        screenPart = (
          <>
            <Text style={styles.header}>
              {i18n.t("cfdefbe6-ae49-4e17-8628-bbe46d144418")}
            </Text>
            <SMSCodeInput
              ref={this.codeInput}
              autoFocus
              onEndInput={(code) => this.checkSMSCode(code)}
            />
            <SMSCodeInput_1.SMSCodeInputInfo
              status={this.state.statusSMSCode}
              style={styles.SMSCodeInputInfoStyle}
              onPress={() => this.requestSMSCode()}
              seconds={10}
            />
          </>
        );
        break;
    }
    return (
      <BackgroundGradient
        title={i18n.t("aa8609dd-caa8-4563-a1b5-e4cb896d03ae")}
        style={[
          styles.background,
          {
            justifyContent:
              this.state.screenPart == ScreenPart.SMSCodeInput
                ? "center"
                : "flex-start",
          },
        ]}
      >
        <expoFirebaseRecaptcha.FirebaseRecaptchaVerifierModal
          ref={this.reCAPTCHA}
          firebaseConfig={app.options}
          languageCode={i18n.language}
        />
        {screenPart}
        <expoFirebaseRecaptcha.FirebaseRecaptchaBanner
          style={styles.firebaseRecaptchaBanner}
          textStyle={styles.firebaseRecaptchaBannerText}
        />
        <Toast
          text={i18n.t("cb73fed3-bf9e-4621-8db3-fc9471991792")}
          ref={this.toast}
        />
      </BackgroundGradient>
    );
  }

  private dispatch(action: Action): void {
    const state = { ...this.state };
    switch (action.type) {
      case "editNumber":
        state.phone = action.payload.number;
        state.numberIsValidate = action.payload.isValidate;
        break;
      case "SMSSent":
        state.verificationId = action.payload;
        state.statusSMSCode = SMSCodeInput_1.SMSCodeInputInfoShow.requestSMS;
        if (state.screenPart == ScreenPart.numberInput) {
          state.screenPart = ScreenPart.SMSCodeInput;
        }
        break;
      case "SMSRequest":
        state.statusSMSCode =
          SMSCodeInput_1.SMSCodeInputInfoShow.loadingIndicator;
        break;
    }
    this.setState(state);
  }

  private async requestSMSCode() {
    if (
      this.state.phone &&
      this.reCAPTCHA.current &&
      this.state.numberIsValidate
    ) {
      this.dispatch({ type: "SMSRequest" });
      const phoneProvider = new auth_1.PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        this.state.phone,
        this.reCAPTCHA.current
      );
      this.codeInput.current?.clear();
      this.dispatch({ type: "SMSSent", payload: verificationId });
    }
  }

  private async checkSMSCode(code: string) {
    try {
      if (this.state.verificationId) {
        const credential = auth_1.PhoneAuthProvider.credential(
          this.state.verificationId,
          code
        );
        await auth_1.signInWithCredential(auth, credential);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message == "Firebase: Error (auth/invalid-verification-code)."
        ) {
          this.toast.current?.show();
        }
      }
    }
  }
}

const styles = StyleSheet.create({
  background: {
    paddingHorizontal: 30,
  },
  colorButton: {
    marginTop: 14,
  },
  SMSCodeInputInfoStyle: {
    marginTop: 20,
  },
  header: {
    marginBottom: 25,
    color: colors.white,
    ...styleText.h1,
  },
  firebaseRecaptchaBanner: {
    position: "absolute",
    alignSelf: "center",
    bottom: 20,
  },
  firebaseRecaptchaBannerText: {
    textAlign: "center",
    color: colors.white,
    ...style.getFontOption("400"),
  },
});

type Action =
  | ActionReducerWithPayload<
      "editNumber",
      { number: string; isValidate: boolean }
    >
  | ActionReducerWithPayload<"SMSSent", string>
  | ActionReducerNoWithPayload<"SMSRequest">;

interface State {
  screenPart: ScreenPart;
  phone?: string;
  verificationId?: string;
  numberIsValidate: boolean;
  statusSMSCode: SMSCodeInput_1.SMSCodeInputInfoShow;
}

enum ScreenPart {
  numberInput,
  SMSCodeInput,
}

interface Props {}
