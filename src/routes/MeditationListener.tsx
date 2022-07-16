import React, { FC } from "react";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import i18n from "~i18n";

import PlayerScreen from "~screens/Player";
import useAudio from "~hooks/useAudio";
import AudioControlContext from "~contexts/audioControl";
import style, { colors } from "~styles";
import EditFavoriteStatusMeditation from "~components/EditFavoriteStatusMeditation";
import BackgroundMusicScreen from "~screens/BackgroundMusic";

const MeditationListenerStack =
  createNativeStackNavigator<MeditationListenerParametersList>();

const MeditationListenerRoutes: FC<
  RootStackScreenProps<"MeditationListener">
> = ({ route }) => {
  const {
    audioControl,
    audioData,
    meditationData,
    backgroundMusicName,
    backgroundMusicVolume,
  } = useAudio(route.params.meditationID);

  if (!audioData || !meditationData) return null;
  return (
    <AudioControlContext.Provider
      value={{
        audioControl,
        audioData,
        meditationData,
        backgroundMusicName,
        backgroundMusicVolume,
      }}
    >
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
            headerRight: () => (
              <EditFavoriteStatusMeditation id={route.params.id} />
            ),
          })}
          listeners={{
            transitionStart: ({ data, type }) => ({}),
          }}
        />
        <MeditationListenerStack.Screen
          component={BackgroundMusicScreen}
          name={"BackgroundMusic"}
          options={{
            title: i18n.t("12ee6d3a-ad58-4c4a-9b87-63645efe9c90"),
          }}
        />
      </MeditationListenerStack.Navigator>
    </AudioControlContext.Provider>
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
  FavoriteIcon: {},
});
