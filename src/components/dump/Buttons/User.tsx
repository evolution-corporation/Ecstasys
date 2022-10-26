/** @format */

import React, { FC } from "react";
import { Image, ViewProps, StyleSheet } from "react-native";

import Base from "./Base";
import Tools from "~core";

const UserButton: FC<Props> = props => {
	const { style, onPress, image, nickname } = props;

	return (
		<Base
			styleButton={[style, styles.background]}
			onPress={onPress}
			secondItem={<Image source={{ uri: image }} style={styles.image} />}
			styleText={styles.nickname}
		>
			{nickname}
		</Base>
	);
};

interface Props extends ViewProps {
	onPress?: () => void;
	image: string;
	nickname: string;
}

const styles = StyleSheet.create({
	background: {
		borderRadius: 90,
		backgroundColor: "#FFFFFF",
		paddingVertical: 3,
		alignItems: "center",
		flexDirection: "row",

		paddingRight: 9,
	},
	image: {
		width: 38,
		height: 38,
		borderRadius: 22,
		marginLeft: 4,
		resizeMode: "center",
	},
	nickname: {
		marginHorizontal: 9,
		color: "#3D3D3D",
		fontSize: 14,
		...Tools.gStyle.font("500"),
	},
});

export default UserButton;
