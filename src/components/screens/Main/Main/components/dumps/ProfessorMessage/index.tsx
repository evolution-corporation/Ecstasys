import React, { FC, useEffect, useState } from "react";
import { View, Text, ViewProps, Image, StyleSheet } from "react-native";
import { BlurView } from "@react-native-community/blur";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

import Tools from "~core";
import { contextHook } from "~modules/account";

import useCatchPhrases from "./hook";
import Quote from "./assets/quote.svg";

const ProfessorMessage: FC<ProfessorMessageProps> = (props) => {
  const {} = props;
  const { user } = contextHook.account();
  const { getItem, setItem } = useAsyncStorage("@LastDateOpenApp");
  const [message, setMessage] = useState<string | null>();
  const catchPhrases = useCatchPhrases();
  let isActivate = false;

  useEffect(() => {
    isActivate = true;
    let lastDateTime: Date | null;
    const createMessage = async () => {
      let lastDateTimeAS: string | null = await getItem();
      if (lastDateTimeAS) lastDateTime = new Date(lastDateTimeAS);
      let messageText: string | null;
      if (user?.displayName) {
        if (
          lastDateTime === null ||
          typeof lastDateTime === "string" ||
          (lastDateTime instanceof Date &&
            (Date.now() - lastDateTime.getTime()) / (12 * 60 * 60 * 1000))
        ) {
          messageText = Tools.i18n.t("8a5ee5df-a44d-4247-b0cc-fb85c65a9f9e", {
            name: user?.displayName?.split(" ")[0],
          });
        } else {
          messageText = `${user?.displayName}!`;
        }
      } else {
        messageText =
          lastDateTime === null ||
          typeof lastDateTime === "string" ||
          (lastDateTime instanceof Date &&
            Date.now() - lastDateTime.getTime() >= 5 * 60 * 1000)
            ? null
            : Tools.i18n.t("f47e47b2-9424-43a8-8d34-f10c3a2eb05f");
      }
      if (isActivate) {
        setMessage(messageText);
      }
    };

    createMessage().catch(console.error);

    return () => {
      if (lastDateTime === null) setItem(String(new Date()));
      isActivate = false;
    };
  }, [user?.displayName]);

  return (
    <View {...props} style={[styles.background]}>
      <View
        style={{
          width: 180,
          height: 180,
          borderRadius: 90,
          overflow: "hidden",
        }}
      >
        <BlurView
          blurAmount={5}
          blurType={"light"}
          style={{ flex: 1 }}
          blurRadius={25}
        >
          <Image
            source={require("./assets/professor.png")}
            style={styles.professor}
            resizeMethod={"scale"}
            resizeMode={"center"}
          />
        </BlurView>
      </View>
      <View style={styles.greetingView}>
        {message && <Text style={styles.greeting}>{message}</Text>}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-start",
            marginVertical: 17,
          }}
        >
          <View style={styles.lineBR} key={"leftLine"} />
          <Quote />
          <View style={styles.lineBR} key={"rightLine"} />
        </View>
        {catchPhrases && (
          <Text style={styles.catchPhrases}>{Tools.i18n.t(catchPhrases)}</Text>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  background: {
    justifyContent: "center",
    alignItems: "center",
  },
  professor: {
    flex: 1,
    alignSelf: "center",
  },

  greeting: {
    fontSize: 24,
    color: "#FFFFFF",
    textAlign: "center",
    ...Tools.gStyle.font("700"),
  },
  greetingView: {},
  lineBR: {
    width: "25%",
    height: 1,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 2,
  },
  catchPhrases: {
    fontSize: 14,
    textAlign: "center",
    color: "#FFFFFF",
    lineHeight: 16,
    maxWidth: "60%",
    ...Tools.gStyle.font("400"),
  },
});

interface ProfessorMessageProps extends ViewProps {}

export default ProfessorMessage;
