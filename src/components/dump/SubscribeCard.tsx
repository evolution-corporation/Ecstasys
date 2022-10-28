/** @format */

import React, { FC } from "react";
import {
	StyleSheet,
	TextStyle,
	TouchableOpacity,
	View,
	ViewProps,
	ViewStyle,
	Text,
	Image,
	ImageSourcePropType,
	ColorValue,
} from "react-native";
import { TextButton } from "~components/dump";

import gStyles from "~styles";
import i18n from "~i18n";

const SubscribeCard: FC<SubscribeCardProps> = props => {
	const {
		stylesContent,
		style,
		image,
		isSelected,
		onPress,
		secondElement,
		isUsed,
		mainColor,
		countMonth,
		textPrice,
		isShowCancelButton,
	} = props;
	const isFirstPayment = false;
	return (
		<>
			<TouchableOpacity style={[styles.background, stylesContent.background, style]} onPress={() => onPress()}>
				<View style={styles.textPrice}>
					<View style={{ alignItems: "flex-start" }}>
						<Text style={[styles.month, stylesContent.textStyle]}>
							{i18n.t("d4778887-6b9d-44fc-a20e-c042f82ef115", {
								count: countMonth,
							})}
						</Text>
						{secondElement}
					</View>
					<Text style={[styles.priceSubs, stylesContent.textStyle]}>
						<Text style={styles.price}>{textPrice.top}</Text>
						{"\n"}
						{textPrice.bottom}
						{isFirstPayment && i18n.t("a8ffa396-e17e-4836-817a-f4f61bad261d")}
					</Text>
				</View>
				<View style={styles.imageCard}>
					<Bird color={mainColor} />
					<Image source={image} style={styles.imagePeople} />
				</View>
				{!isUsed && <CircleCheck isSelected={isSelected} style={styles.checkSelectedSubscribe} colorItem={mainColor} />}
			</TouchableOpacity>
			{isShowCancelButton && isUsed && (
				<TextButton style={styles.cancelSubs}>{i18n.t("c0c032e5-8965-4703-bed6-77f919acd4d5")}</TextButton>
			)}
		</>
	);
};

interface SubscribeCardProps extends ViewProps {
	stylesContent: {
		background: ViewStyle;
		textStyle: TextStyle;
	};
	onPress: () => void;
	onCancelSubscribe: () => void;
	isSelected: boolean;
	image: ImageSourcePropType;
	price: number;
	secondElement?: JSX.Element;
	isUsed: boolean;
	mainColor: ColorValue;
	countMonth: number;
	textPrice: { top: string; bottom: string };
	isShowCancelButton: boolean;
}

const styles = StyleSheet.create({
	priceSubs: {
		fontSize: 14,
		...gStyles.font("400"),
		width: 160,
		lineHeight: 16,
	},
	price: {
		...gStyles.font("600"),
	},
	background: {
		width: "100%",
		height: 150,
		justifyContent: "space-between",
		borderRadius: 20,
		padding: 12,
		flexDirection: "row",
		marginVertical: 9,
	},

	month: {
		fontSize: 20,
		...gStyles.font("600"),
	},
	textPrice: {
		justifyContent: "space-between",
	},
	imageCard: {
		flexDirection: "row",
	},
	imagePeople: {
		position: "absolute",
		alignSelf: "center",
		right: 38,
	},

	checkSelectedSubscribe: {
		position: "absolute",
		bottom: 10,
		right: 10,
	},

	benefitPrice: {
		color: "#FBBC05",
		backgroundColor: "#FFFFFF",
		paddingHorizontal: 27,
		paddingVertical: 7,
		borderRadius: 15,
		fontSize: 13,
		...gStyles.font("600"),
		marginTop: 12,
	},
	cancelSubs: {
		fontSize: 14,
		color: "#C2A9CE",
		...gStyles.font("400"),
		marginVertical: 10,
	},
});

export default SubscribeCard;
