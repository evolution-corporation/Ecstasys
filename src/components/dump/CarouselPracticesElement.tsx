/** @format */

import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, Pressable, ViewProps } from "react-native";
import Animated, * as AnimatedTools from "react-native-reanimated";
import Lock from "assets/icons/Lock.svg";
import Heart from "assets/icons/Heart_Red.svg";
import core from "~core";
import { PracticesMeditation } from "~types";

interface Props extends ViewProps {
	isFavorite: boolean;
	description: string;
	name: string;
	image: string;
	isPermission: boolean;
	lengthAudio: number;
	onPress: () => void;
	isSelected: boolean;
}

const CarouselPracticesElement: React.FC<Props> = props => {
	const { isSelected, description, image, isPermission, name, onPress, lengthAudio, isFavorite, style } = props;
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
					<Image source={{ uri: image }} style={styles.image} />
					<View style={[styles.backgroundImage, { justifyContent: isPermission ? "flex-end" : "center" }]}>
						{isPermission ? (
							<View style={styles.imageFooter}>
								<Text style={styles.audioLength}>
									{core.i18n.t("minute", {
										count: Math.floor(lengthAudio / 60000),
									})}
								</Text>
								{isFavorite && (
									<View style={styles.heartView}>
										<Heart />
									</View>
								)}
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
					<Text style={styles.name} adjustsFontSizeToFit>
						{name}
					</Text>
					<Text style={styles.description} adjustsFontSizeToFit>
						{description}
					</Text>
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
		maxWidth: 254,
		height: 39,
		textAlign: "center",
	},
	description: {
		color: "rgba(64, 64, 64, 0.71)",
		fontSize: 13,
		...core.gStyle.font("400"),
		maxWidth: 200,
		maxHeight: 68,
		textAlign: "center",
		lineHeight: 15,
	},
	sharedImage: {
		borderRadius: 28,
		overflow: "hidden",
	},
	lock: {
		width: 110,
		height: 110,
		borderRadius: 55,
		backgroundColor: "rgba(0,0,0, 0.5)",
		alignItems: "center",
		justifyContent: "center",
	},
	backgroundImage: {
		width: "100%",
		height: "100%",
		backgroundColor: "rgba(0,0,0,0.35)",
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

export default CarouselPracticesElement;
