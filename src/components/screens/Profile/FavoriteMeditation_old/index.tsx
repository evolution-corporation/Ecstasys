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

import Tools from "~core";
import { useFavoriteMeditation } from "./hooks";

const FavoriteMeditationScreen = () => {
  const { listFavoriteMeditation, typesMeditation } = useFavoriteMeditation();

  return (
    <View style={styles.background}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {typesMeditation.map((typeMeditation) => (
          <View key={typeMeditation} style={styles.favoriteTypeMeditationCard}>
            <Text style={styles.typeName}>{Tools.i18n.t(typeMeditation)}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    alignItems: "flex-start",
    backgroundColor: colors.moreViolet,
    flex: 1,
  },
  typeName: {
    color: colors.white,
    fontSize: 20,
    ...style.getFontOption("600"),
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
