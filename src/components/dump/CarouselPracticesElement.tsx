/** @format */

import React, { memo, useEffect } from "react";
import { View, Text, StyleSheet, Image, Pressable, ViewProps } from "react-native";
import Animated, * as AnimatedTools from "react-native-reanimated";
import Lock from "assets/icons/Lock.svg";
import Heart from "assets/icons/Heart_Red.svg";
import core from "~core";
import { PracticesMeditation, State } from "~types";

import i18n from "~i18n";
import { SharedElement } from "react-navigation-shared-element";
import IsFavorite from "./IsFavorite";

interface Props extends ViewProps {
	practice: State.Practice;
	isPermission: boolean;
	onPress: () => void;
	isSelected: boolean;
	sharedID?: string;
	isNoShowFavorite?: boolean;
}

const CarouselPracticesElement: React.FC<Props> = props => {
	const { isSelected, practice, isPermission, onPress, style, sharedID, isNoShowFavorite = false } = props;
	const width = AnimatedTools.useSharedValue(182);

	const animatedShared = AnimatedTools.useAnimatedStyle(() => ({
		width: width.value,
		height: AnimatedTools.interpolate(width.value, [182, 254], [199, 277]),
		transform: [{ translateY: AnimatedTools.interpolate(width.value, [182, 254], [39, 0]) }],
	}));

	useEffect(() => {
		if (isSelected) {
			width.value = AnimatedTools.withTiming(254);
		} else {
			width.value = AnimatedTools.withTiming(182);
		}
	}, [isSelected]);

	return (
		<View style={[styles.backgroundCard, style]}>
			<Pressable onPress={onPress}>
				<Animated.View style={[styles.sharedImage, animatedShared]}>
					{sharedID ? (
						<SharedElement id={sharedID} style={styles.image}>
							<Image
								source={typeof practice.image === "string" ? { uri: practice.image } : practice.image}
								style={{ width: "100%", height: "100%", borderRadius: 20 }}
							/>
						</SharedElement>
					) : (
						<Image source={{ uri: practice.image }} style={styles.image} />
					)}

					<View
						style={[
							styles.backgroundImage,
							{ justifyContent: isPermission ? "flex-end" : "center" },
							isPermission ? null : { backgroundColor: "rgba(0,0,0,0.55)" },
						]}
					>
						{isPermission ? (
							<View style={styles.imageFooter}>
								{practice.length > 0 ? (
									<Text style={styles.audioLength}>
										{i18n.t("minute", {
											count: Math.floor(practice.length / 60000),
										})}
									</Text>
								) : (
									<View />
								)}
								{!isNoShowFavorite &&
								!["9ce4657e-2d0a-405a-b02f-408dd76cc8f7", "32c996f7-13e6-4604-966d-b96a8bf0e7c3"].includes(
									practice.id
								) ? (
									<IsFavorite practice={practice} noShowWereNoFavorite />
								) : null}
							</View>
						) : (
							<View style={styles.lock}>
								<Lock />
							</View>
						)}
					</View>
				</Animated.View>
			</Pressable>
			{isSelected && (
				<>
					<Text style={styles.name}>{practice.name}</Text>
					<Text style={styles.description}>{practice.description}</Text>
				</>
			)}
		</View>
	);
};

CarouselPracticesElement.defaultProps = {};

const styles = StyleSheet.create({
	backgroundCard: {
		alignItems: "center",
	},
	image: {
		width: "100%",
		height: "100%",
		position: "absolute",
	},
	imageFooter: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-end",
	},
	audioLength: {
		color: "#FFFFFF",
	},
	name: {
		color: "#3D3D3D",
		fontSize: 24,
		...core.gStyle.font("700"),
		marginTop: 24,
		marginBottom: 11,
		maxWidth: 238,
		// height: 39,
		textAlign: "center",
	},
	description: {
		color: "rgba(64, 64, 64, 0.71)",
		fontSize: 14,
		...core.gStyle.font("400"),
		maxWidth: "100%",
		// maxHeight: 68,
		textAlign: "center",
		// lineHeight: 15,
	},
	sharedImage: {
		borderRadius: 28,
		overflow: "hidden",
	},
	lock: {
		width: 110,
		height: 110,
		borderRadius: 55,
		alignItems: "center",
		justifyContent: "center",
	},
	backgroundImage: {
		width: "100%",
		height: "100%",
		borderRadius: 28,
		paddingHorizontal: 18,
		paddingBottom: 18,
		alignItems: "center",
	},
	heartView: {
		height: 38,
		width: 38,
		borderRadius: 19,
		backgroundColor: "#FEEBED",
		justifyContent: "center",
		alignItems: "center",
	},
});

export default memo(CarouselPracticesElement);
