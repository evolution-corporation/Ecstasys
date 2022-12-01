/** @format */

import React from "react";
import {
	View,
	Text,
	StyleSheet,
	Pressable,
	Dimensions,
	Image,
	ViewProps,
	ImageSourcePropType,
	ActivityIndicator,
} from "react-native";
import Tools from "~core";
import i18n from "~i18n";
import gStyle from "~styles";

import Headphones from "assets/icons/Headphones_gray.svg";

interface Props extends ViewProps {
	onPress?: () => void;
	image: ImageSourcePropType;
	name: string;
	description: string;
	count: number | null;
}

const CategoryCard: React.FC<Props> = props => {
	const { description, image, name, onPress, count, style } = props;
	const [widthComponent, setWidthComponent] = React.useState<number>(Dimensions.get("window").width);
	return (
		<Pressable
			onPress={() => {
				if (onPress) onPress();
			}}
			onLayout={({ nativeEvent: { layout } }) => {
				setWidthComponent(layout.width);
			}}
			style={style}
		>
			<View style={styles.background}>
				<Image
					source={image}
					style={{ width: widthComponent, height: (widthComponent * 290) / 335 }}
					resizeMode={"cover"}
					resizeMethod={"scale"}
				/>
				<View style={styles.information}>
					<Text style={styles.name}>{name}</Text>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
						}}
					>
						<Text style={styles.description}>{description}</Text>
						<View style={{ alignItems: "center", width: 100 }}>
							<Headphones />
							{count === null ? (
								<ActivityIndicator size={"small"} color={"#FFFF"} />
							) : (
								<Text style={styles.countMeditation}>
									{i18n.t("9790bd12-4b66-419f-a3e0-705134494734", {
										count,
									})}
								</Text>
							)}
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
		backgroundColor: "#FFFFFF",
		...gStyle.shadows(1, 1),
		shadowColor: "rgba(0,0,0,0.7)",
	},
	name: {
		color: "#3d3d3d",
		fontSize: 20,
		...Tools.gStyle.font("600"),
		marginBottom: 5,
		backgroundColor: "#fff",
	},
	information: {
		marginTop: -40,
		backgroundColor: "#fff",
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
		width: "70%",
		maxHeight: 53,
		color: "#3d3d3d",
		...Tools.gStyle.font("400"),
	},
	countMeditation: {
		fontSize: 12,
		color: "#3d3d3d",
		...Tools.gStyle.font("400"),
		textAlign: "center",
		textAlignVertical: "center",
	},
});

export default CategoryCard;
