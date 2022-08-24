import React, { FC, useEffect } from "react";
import {
  NavigationContainer,
} from "@react-navigation/native";
import { useCustomFonts } from '~core'
import {Platform, UIManager, View} from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import FlipperAsyncStorage from "rn-flipper-async-storage-advanced";
import Account from '~modules/account'
import RootRoutes from "./routes";
import * as TestAccount from "~screens/Test/Account"

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
const AppCore: FC<Props> = (props) => {

  const [loaded] = useCustomFonts() // Загрузка кастомных шрифтов
  useEffect(() => {
    console.log(`Hermes ${!!global.HermesInternal ? "" : "не"} используется`);
  }, [1]);

  if (loaded) {
    return (
      <RootSiblingParent>
        <FlipperAsyncStorage />
        <NavigationContainer>
          <Account routes={{
            authorization: <TestAccount.AccountAuthentication />,
            registration: <TestAccount.AccountRegistration />,
            root: <View />
          }}/>
        </NavigationContainer>
      </RootSiblingParent>
    );
  }
  return null;
};

interface Props {}

export default AppCore;
