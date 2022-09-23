import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { DoubleColorView } from "~components/containers";
import core from "~core";

import Tools from "~core";
import { useFavoriteMeditation } from "./hooks";

const FavoriteMeditationScreen = () => {
  const { listFavoriteMeditation, typesMeditation } = useFavoriteMeditation();

  return (
    <DoubleColorView style={styles.background} heightViewPart={140}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {typesMeditation.map((typeMeditation, index) => (
          <View key={typeMeditation} style={styles.favoriteTypeMeditationCard}>
            <Text
              style={[
                styles.typeName,
                { color: index === 0 ? "#FFFFFF" : "#3D3D3D" },
              ]}
            >
              {Tools.i18n.t(typeMeditation)}
            </Text>
            <FlatList
              data={listFavoriteMeditation.filter(
                (meditation) => meditation.category == typeMeditation
              )}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity>
                  <Image source={{ uri: item.image }} />
                  <Text style={styles.nameMeditation}>{item.name}</Text>
                </TouchableOpacity>
              )}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: -styles.meditationCard.marginHorizontal,
              }}
            />
          </View>
        ))}
      </ScrollView>
    </DoubleColorView>
  );
};

const styles = StyleSheet.create({
  background: {
    alignItems: "flex-start",
    flex: 1,
  },
  typeName: {
    fontSize: 20,
    ...core.gStyle.font("600"),
    marginLeft: 30,
    marginBottom: 30,
  },
  meditationCard: {
    marginHorizontal: 13,
  },
  favoriteTypeMeditationCard: {
    marginBottom: 30,
  },
  nameMeditation: {
    color: "rgba(61, 61, 61, 1)",
    fontSize: 16,
    ...Tools.gStyle.font("600"),
  },
  imageMeditation: {},
});

interface Props {}
export default FavoriteMeditationScreen;
