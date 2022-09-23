import React, { FC, useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewProps,
} from "react-native";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

import Like from "./assets/Like.svg";
import NoLike from "./assets/NoLike.svg";

const FavoriteMeditation: FC<FavoriteMeditationProps> = (props) => {
  const { idMeditation, displayWhenNotFavorite = false } = props;
  const { getItem, setItem } = useAsyncStorage("@FavoriteMeditationList");
  const [IsLoading, setIsLoading] = useState<boolean>(false);
  const [IsFavorite, setIsFavorite] = useState<boolean>(false);

  const addFavoriteMeditation = useCallback(async () => {
    let listMeditation: string[] = [];
    const listMeditationAsyncStorage = await getItem();
    if (!!listMeditationAsyncStorage) {
      listMeditation = JSON.parse(listMeditationAsyncStorage);
      if (
        Array.isArray(listMeditation) &&
        listMeditation.includes(idMeditation)
      ) {
        listMeditation.push(idMeditation);
      } else {
        listMeditation = [idMeditation];
      }
    } else {
      listMeditation = [idMeditation];
    }
    await setItem(JSON.stringify(listMeditation));
  }, [idMeditation]);

  const removeFavoriteMeditation = useCallback(async () => {
    setIsLoading(true);
    let listMeditation: string[] = [];
    const listMeditationAsyncStorage = await getItem();
    if (!!listMeditationAsyncStorage) {
      listMeditation = JSON.parse(listMeditationAsyncStorage);
      if (
        Array.isArray(listMeditation) &&
        listMeditation.includes(idMeditation)
      ) {
        listMeditation = [
          ...listMeditation.filter((item) => item !== idMeditation),
        ];
      }
    }

    await setItem(JSON.stringify(listMeditation));
  }, [idMeditation]);

  const editFavoriteStatus = useCallback(async () => {
    setIsLoading(true);
    let action: Promise<void>;
    if (IsFavorite) {
      action = removeFavoriteMeditation();
    } else {
      action = addFavoriteMeditation();
    }
    setIsFavorite(!IsFavorite);
    action.then(() => setIsLoading(false));
  }, [IsFavorite]);

  useEffect(() => {
    const init = async () => {
      let listMeditation: string[] = [];
      const listMeditationAsyncStorage = await getItem();
      if (!!listMeditationAsyncStorage) {
        listMeditation = JSON.parse(listMeditationAsyncStorage);
        setIsFavorite(listMeditation.includes(idMeditation));
      } else {
        setIsFavorite(false);
      }
    };

    init().catch(console.error);
  }, [setIsFavorite]);

  if (!IsFavorite && !displayWhenNotFavorite) return null;

  if (IsLoading) {
    return (
      <ActivityIndicator
        color={styles.background.backgroundColor}
        size={"small"}
      />
    );
  }
  return (
    <TouchableOpacity onPress={() => editFavoriteStatus()}>
      {IsFavorite ? <Like /> : <NoLike />}
    </TouchableOpacity>
  );
};

interface FavoriteMeditationProps extends ViewProps {
  idMeditation: string;
  displayWhenNotFavorite?: boolean;
}

export default FavoriteMeditation;

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#FEEBED",
  },
});
