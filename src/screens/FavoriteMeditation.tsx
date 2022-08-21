import React, { useCallback, useMemo, useState } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView } from "react-native";
import i18n from "~i18n";
import BackgroundGradient from "~containers/BackgroundGradient";
import useIsServerAccess from "~hooks/useIsServerAccess";
import { useAppSelector } from "~store";
import style, { colors } from "~styles";
import MeditationCard from "~components/MeditationCard";

const FavoriteMeditationScreen: FC<Props> = () => {
  const meditationFavoriteList = useAppSelector(
    (state) => state.meditation.favoriteMeditation
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const serverAccess = useIsServerAccess();
  const typeMeditationList = useMemo(() => {
    const typeList = [];
    let listMeditation_ = [...meditationFavoriteList];
    let lastType: string | null = null;
    while (listMeditation_.length > 0) {
      lastType = listMeditation_[0].type;
      if (lastType != null) {
        typeList.push(lastType);
        listMeditation_ = [
          ...listMeditation_.filter((item) => item.type != lastType),
        ];
      }
    }
    return typeList;
  }, [meditationFavoriteList]);
  return (
    <View style={styles.background}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {typeMeditationList.map((typeMeditation) => (
          <View key={typeMeditation} style={styles.favoriteTypeMeditationCard}>
            <Text style={styles.typeName}>
              {i18n.getTypeMeditation(typeMeditation)}
            </Text>
            <FlatList
              data={meditationFavoriteList.filter(
                (meditation) => meditation.type == typeMeditation
              )}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <MeditationCard
                  type={"compact-vertical"}
                  meditation={item}
                  style={styles.meditationCard}
                />
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
});

interface Props {}
export default FavoriteMeditationScreen;
