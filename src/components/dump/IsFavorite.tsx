/** @format */

import React from "react";
import { ViewProps, Pressable, ViewStyle, StyleSheet, StyleProp } from "react-native";
import { actions, useAppDispatch, useAppSelector } from "~store";
import { State } from "~types";
import RedHeart from "assets/icons/Heart_Red.svg";
import HeartTransparent from "assets/icons/Heart_Transparent.svg";
import { useIsFavoriteMeditation } from "src/hooks";
interface Props {
	onPress: () => void;
	isFavorite: boolean;
	style?: StyleProp<ViewStyle>;
}

export const IsFavorite: React.FC<Props> = props => {
	const { onPress, isFavorite, style } = props;

	return (
		<Pressable
			onPress={() => onPress()}
			style={[styles.background, style, isFavorite ? {} : { backgroundColor: "transparent" }]}
		>
			{isFavorite ? <RedHeart /> : <HeartTransparent />}
		</Pressable>
	);
};

export function OnFavoritePractice(WrapperComponent: React.FC<Props>) {
	return (props: { practice: State.Practice; noShowWereNoFavorite?: boolean } & ViewProps) => {
		const { practice, style, noShowWereNoFavorite = false } = props;
		const [isFavorite, setIsFavorite] = useIsFavoriteMeditation(practice);

		return noShowWereNoFavorite && !isFavorite ? undefined : (
			<WrapperComponent isFavorite={isFavorite} onPress={() => setIsFavorite()} style={style} />
		);
	};
}

export default OnFavoritePractice(IsFavorite);

const styles = StyleSheet.create({
	background: {
		width: 38,
		height: 38,
		borderRadius: 19,
		alignItems: "center",
		justifyContent: "center",
	},
});
