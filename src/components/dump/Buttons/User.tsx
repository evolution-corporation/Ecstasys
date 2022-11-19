/** @format */

import React, { FC } from "react";
import { Image, ViewProps, StyleSheet, Pressable, Text } from "react-native";

import UserInformation, { WrapperProps as UserInformationProps } from "../../HOC/UserInformation";
import Tools from "~core";

export const UserButtonUI: FC<Props & UserInformationProps> = props => {
	const { style, onPress, image, nickname } = props;
	return (
		<Pressable style={[{ ...styles.background }, style]} onPress={onPress}>
			<Image source={{ uri: image }} style={{ height: 38, width: 38, borderRadius: 19 }} />

			<Text style={styles.nickname}>{nickname}</Text>
		</Pressable>
	);
};

interface Props extends ViewProps {
	onPress?: () => void;
}

const styles = StyleSheet.create({
	background: {
		borderRadius: 22,
		backgroundColor: "#FFFFFF",
		paddingVertical: 3,
		alignItems: "center",
		flexDirection: "row",
		padding: 2,
		paddingRight: 0,
		height: 44,
		width: "auto",
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

export default UserInformation<Props>(UserButtonUI);
