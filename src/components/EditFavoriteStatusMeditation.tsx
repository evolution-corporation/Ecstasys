import React, { FC, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View, ViewProps } from "react-native";
import Icon from "~assets/icons";
import { useAppDispatch, useAppSelector } from "~store/index";
import {
  addFavoriteMeditation,
  removeFavoriteMeditation,
} from "~store/meditation";
import { colors } from "~styles";

const EditFavoriteStatusMeditation: FC<Props> = ({ id, style, onlyView }) => {
  const isFavorite = useAppSelector((store) =>
    store.meditation.favoriteMeditationId.includes(id)
  );
  const dispatch = useAppDispatch();
  const editStatus = () => {
    if (isFavorite) {
      dispatch(removeFavoriteMeditation(id));
    } else {
      dispatch(addFavoriteMeditation(id));
    }
  };

  if (onlyView) {
    if (isFavorite) {
      return (
        <View style={[styles.background, style]}>
          <Icon
            name={"Heart"}
            variable={"red"}
            style={styles.icon}
            key={"isFavorite"}
          />
        </View>
      );
    } else {
      return null;
    }
  }

  return (
    <TouchableOpacity
      style={[styles.background, style]}
      onPress={() => editStatus()}
    >
      {isFavorite ? (
        <Icon
          name={"Heart"}
          variable={"red"}
          style={styles.icon}
          key={"isFavorite"}
        />
      ) : (
        <Icon
          name={"Heart"}
          variable={"transparent"}
          style={styles.icon}
          key={"isNotFavorite"}
        />
      )}
    </TouchableOpacity>
  );
};

interface Props extends ViewProps {
  id: string;
  onlyView?: boolean;
}

const styles = StyleSheet.create({
  background: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.skin,
  },
  icon: {
    height: 16,
    width: 18,
  },
});

export default EditFavoriteStatusMeditation;
