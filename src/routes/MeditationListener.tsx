import React, { FC, useReducer } from "react";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import i18n from "~i18n";
import {
  editParametersMeditation,
  removeParametersMeditation,
} from "~store/meditation";
import PlayerScreen from "~screens/Player";
import useAudio from "~hooks/useAudio";
import AudioControlContext from "~contexts/audioControl";
import style, { colors } from "~styles";

const MeditationListenerStack =
  createNativeStackNavigator<MeditationListenerParametersList>();

const MeditationListenerRoutes: FC<
  NativeStackScreenProps<RootStackParamList, "MeditationListener">
> = ({ route }) => {
  const { audioControl, meditationData, audioData } = useAudio(
    route.params.meditationID
  );
  if (!audioData?.isLoaded || !meditationData || !audioData) return null;
  return (
    <MeditationListenerStack.Navigator
      initialRouteName="Player"
      screenOptions={{ headerTransparent: true }}
    >
      <MeditationListenerStack.Screen
        component={PlayerScreen}
        name={"Player"}
        initialParams={meditationData}
        options={({ route }) => ({
          headerShown: true,
          headerTitle: () => (
            <View style={styles.headerPlayer}>
              <Text
                style={[
                  styles.headerMeditationText,
                  styles.headerMeditationName,
                ]}
              >
                {meditationData.name}
              </Text>
              <Text
                style={[
                  styles.headerMeditationText,
                  styles.headerMeditationType,
                ]}
              >
                {i18n.getTypeMeditation(meditationData.type, 0)}
              </Text>
            </View>
          ),
          headerTintColor: colors.white,
          headerTitleAlign: "center",
        })}
        listeners={{
          transitionStart: ({ data, type }) => ({}),
        }}
      />
    </MeditationListenerStack.Navigator>
  );
};

export default MeditationListenerRoutes;

const styles = StyleSheet.create({
  headerPlayer: {
    alignItems: "center",
  },
  headerMeditationName: {
    fontSize: 20,
    ...style.getFontOption("700"),
  },
  headerMeditationType: {
    fontSize: 14,
    ...style.getFontOption("700"),
  },
  headerMeditationText: {
    color: colors.white,
  },
});
