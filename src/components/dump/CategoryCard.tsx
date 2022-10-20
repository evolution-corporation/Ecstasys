/** @format */

import React from "react";
import { View, Text, StyleSheet, Pressable, Dimensions, Image, ImageSourcePropType } from "react-native";
import Tools from "~core";

import Headphones from "assets/icons/Headphones_white.svg";

interface Props {
	onPress?: () => void;
	image: ImageSourcePropType;
	name: string;
	description: string;
	count: number;
}

const CategoryCard: React.FC<Props> = props => {
	const { description, image, name, onPress, count } = props;
	const [widthComponent, setWidthComponent] = React.useState<number>(Dimensions.get("window").width);
	return (
		<Pressable
			onPress={() => {
				if (onPress) onPress();
			}}
			onLayout={({ nativeEvent: { layout } }) => {
				setWidthComponent(layout.width);
			}}
		>
			<View style={styles.background}>
				<Image
					source={image}
					style={{ width: widthComponent, height: (widthComponent * 290) / 335 }}
					resizeMode={"cover"}
					resizeMethod={"scale"}
				/>
				<View style={styles.information}>
					<Text style={styles.name} adjustsFontSizeToFit>
						{name}
					</Text>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
						}}
					>
						<Text style={styles.description} adjustsFontSizeToFit>
							{description}
						</Text>
						<View style={{ alignItems: "center" }}>
							<Headphones />
							<Text style={styles.countMeditation}>
								{Tools.i18n.t("9790bd12-4b66-419f-a3e0-705134494734", {
									count,
								})}
							</Text>
						</View>
					</View>
				</View>
			</View>
		</Pressable>
	);
};

CategoryCard.defaultProps = {};

const styles = StyleSheet.create({
	background: {
		width: "100%",
		borderRadius: 20,
		justifyContent: "flex-start",
		overflow: "hidden",
		backgroundColor: "#9765A8",
		marginBottom: 150,
	},
	name: {
		color: "#FFFFFF",
		fontSize: 20,
		...Tools.gStyle.font("600"),
		marginBottom: 5,
		backgroundColor: "#9765A8",
	},
	information: {
		marginTop: -40,
		backgroundColor: "#9765A8",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingHorizontal: 19,
		paddingTop: 23,
		paddingBottom: 9,
		zIndex: 1,
		height: 119,
		width: "100%",
	},
	description: {
		fontSize: 14,
		lineHeight: 18,
		width: "70%",
		color: "#FFFFFF",
		...Tools.gStyle.font("400"),
	},
	countMeditation: {
		fontSize: 12,
		color: "#FFFFFF",
		...Tools.gStyle.font("400"),
	},
});

export default CategoryCard;
