/** @format */

import React from "react";
import { View, Text, StyleSheet, Image, Pressable, ViewProps } from "react-native";
import { SharedElement } from "react-navigation-shared-element";
import { State } from "~types";
import Animated, * as AnimatedTools from "react-native-reanimated";
import Lock from "assets/icons/Lock.svg";
import Heart from "assets/icons/Heart_Red.svg";
import Play from "assets/icons/Play_Violet.svg";
import i18n from "~i18n";
import gStyle from "~styles";

import { fontStyle, viewStyle } from "~styles";

interface GeneralProps extends ViewProps {
	typePractice: State.PracticesMeditation;
	description: string;
	name: string;
	image: string;
	isPermission: boolean;
	lengthAudio: number;
	id: string;
	onPress: () => void;
}

interface CarouselElementProps extends GeneralProps {
	isSelected: boolean;
	isFavorite: boolean;
}

const CarouselElement: React.FC<CarouselElementProps> = props => {
	const { isSelected, description, image, isPermission, name, onPress, lengthAudio, isFavorite, style } = props;
	const width = AnimatedTools.useSharedValue(182);

	const animatedShared = AnimatedTools.useAnimatedStyle(() => ({
		width: width.value,
		height: AnimatedTools.interpolate(width.value, [182, 254], [199, 277]),
		transform: [{ translateY: AnimatedTools.interpolate(width.value, [182, 254], [39, 0]) }],
	}));

	React.useEffect(() => {
		if (isSelected) {
			width.value = AnimatedTools.withTiming(254);
		} else {
			width.value = AnimatedTools.withTiming(182);
		}
	}, [isSelected]);

	return (
		<View style={[CarouselElementStyles.backgroundCard, style]}>
			<Pressable onPress={onPress}>
				<Animated.View style={[CarouselElementStyles.sharedImage, animatedShared]}>
					<Image source={{ uri: image }} style={CarouselElementStyles.image} />
					<View
						style={[CarouselElementStyles.backgroundImage, { justifyContent: isPermission ? "flex-end" : "center" }]}
					>
						{isPermission ? (
							<View style={CarouselElementStyles.imageFooter}>
								<Text style={CarouselElementStyles.audioLength}>
									{i18n.t("minute", {
										count: Math.floor(lengthAudio / 60000),
									})}
								</Text>
								{isFavorite && (
									<View style={CarouselElementStyles.heartView}>
										<Heart />
									</View>
								)}
							</View>
						) : (
							<View style={CarouselElementStyles.lock}>
								<Lock />
							</View>
						)}
					</View>
				</Animated.View>
			</Pressable>
			{isSelected && (
				<>
					<Text style={CarouselElementStyles.name} adjustsFontSizeToFit>
						{name}
					</Text>
					<Text style={CarouselElementStyles.description} adjustsFontSizeToFit>
						{description}
					</Text>
				</>
			)}
		</View>
	);
};

const CarouselElementStyles = StyleSheet.create({
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
		...gStyle.font("700"),
		marginTop: 24,
		marginBottom: 11,
		maxWidth: 254,
		height: 39,
		textAlign: "center",
	},
	description: {
		color: "rgba(64, 64, 64, 0.71)",
		fontSize: 13,
		...gStyle.font("400"),
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

interface CardProps extends GeneralProps {}

const Card: React.FC<CardProps> = props => {
	const { image, description, lengthAudio, name, typePractice, style, onPress, id } = props;
	const translateIdTime = typePractice === "RELAXATION" ? "baacc210-74b7-44f0-b59c-b08733b51adc" : "minute";
	return (
		<Pressable style={[cardStyles.container, style]} onPress={onPress}>
			<SharedElement id={`practice.item.${id}`} style={cardStyles.imageBackground}>
				<Image source={{ uri: image }} style={{ flex: 1 }} />
			</SharedElement>
			<View style={[viewStyle.temple.card, { width: "100%", height: "100%", position: "absolute" }]}>
				<View style={cardStyles.textInformation}>
					<Text style={{ ...gStyle.styles.NamePractice, color: "#ffffff" }}>{name}</Text>
					<Text style={{ ...gStyle.styles.Description, color: "#FFFFFF" }} numberOfLines={2}>
						{description}
					</Text>
				</View>
				<View style={cardStyles.footer}>
					<View
						style={{
							backgroundColor: "#9765A8",
							paddingHorizontal: 34,
							height: 30,
							borderRadius: 15,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Text
							style={{
								color: "#FFFFFF",
								...gStyle.font("600"),
								fontSize: 13,
							}}
						>
							{i18n.t(translateIdTime, { count: Math.round(lengthAudio / 60000) })}
						</Text>
					</View>
					<View>
						<Play />
					</View>
				</View>
			</View>
		</Pressable>
	);
};

const cardStyles = StyleSheet.create({
	container: {
		height: 200,
		width: "100%",
		borderRadius: 20,
		overflow: "hidden",
	},
	imageBackground: {
		width: "100%",
		height: "100%",
	},
	content: {
		width: "100%",
		height: "100%",
		justifyContent: "space-between",
		position: "absolute",
	},
	textInformation: {
		alignItems: "flex-start",
		justifyContent: "flex-start",
	},
	footer: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	timeLength: {
		color: "#FFFFFF",
		...gStyle.font("600"),
		fontSize: 13,
		backgroundColor: "#9765A8",
		paddingHorizontal: 34,
		height: 30,
		textAlign: "center",
		textAlignVertical: "center",
		borderRadius: 15,
	},
});

export { CarouselElement, Card };
