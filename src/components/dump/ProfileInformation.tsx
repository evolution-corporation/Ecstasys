/** @format */

import React from "react";
import RN, { StyleSheet } from "react-native";

import Tools from "~core";
import TextButton from "./Buttons/Text";
import * as UIText from "../UIText";
import i18n from "~i18n";

import SelectImageButton from "./Buttons/SelectImage";

interface Props extends RN.ViewProps {
	displayName?: string;
	image: string;
	subscribeInformation?: {
		isAutoPayment: boolean;
		endSubscribe: Date;
	};
	onPress?: () => void;
	onChangeImage?: (image: string) => void;
}

const ProfileInformation: React.FC<Props> = props => {
	const { image, displayName, subscribeInformation, onPress, onChangeImage } = props;
	const isActivateSubscribe = subscribeInformation !== undefined && subscribeInformation.endSubscribe > new Date();
	return (
		<RN.View style={styles.container}>
			{onChangeImage === undefined ? (
				<RN.Image
					source={{
						uri: image,
					}}
					style={styles.image}
					resizeMethod={"resize"}
					resizeMode={"contain"}
				/>
			) : (
				<SelectImageButton
					initImage={image}
					onChangeImage={image => {
						onChangeImage(image);
					}}
				/>
			)}
			<RN.View style={styles.backgroundInfo}>
				{displayName && <RN.Text style={styles.displayName}>{displayName}</RN.Text>}
				<RN.Text style={styles.nameSubscribe}>
					{i18n.t("d275f2aa-4a42-47cd-86a5-0ae9cbc3ab30", {
						name: isActivateSubscribe ? "Premium" : "Base",
					})}
				</RN.Text>

				<RN.Text style={styles.timeSubscribe}>
					{isActivateSubscribe
						? UIText.getSubscribeInformation(subscribeInformation.endSubscribe, subscribeInformation.isAutoPayment)
						: i18n.t("indefinitely")}
				</RN.Text>
				{onPress && <TextButton onPress={onPress}>{i18n.t("edit")}</TextButton>}
			</RN.View>
		</RN.View>
	);
};

ProfileInformation.defaultProps = {};

const styles = StyleSheet.create({
	container: {
		width: "100%",
		paddingTop: 46,
	},
	background: {
		width: "100%",
		marginBottom: 55,
	},
	backgroundInfo: {
		borderRadius: 20,
		backgroundColor: "#7C3D91",
		width: "100%",
		paddingTop: 58,
		paddingBottom: 11,
		alignItems: "center",
	},
	image: {
		width: 92,
		height: 92,
		borderRadius: 46,
		borderWidth: 3,
		borderColor: "#FFFFFF",
		alignSelf: "center",
		position: "absolute",

		zIndex: 1,
	},
	displayName: {
		color: "#FFFFFF",
		fontSize: 20,
		...Tools.gStyle.font("700"),
	},
	nameSubscribe: {
		color: "#FFFFFF",
		fontSize: 16,
		...Tools.gStyle.font("700"),
		marginTop: 9,
	},
	timeSubscribe: {
		color: "#FFFFFF",
		fontSize: 14,
		...Tools.gStyle.font("400"),
		textAlign: "center",
	},
	editButton: {
		color: "#E7DDEC",
		fontSize: 13,
		...Tools.gStyle.font("600"),
		marginTop: 9,
	},
});

export default ProfileInformation;
