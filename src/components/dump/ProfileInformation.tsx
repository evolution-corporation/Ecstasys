/** @format */

import React from "react";
import RN, { StyleSheet, View } from "react-native";

import Tools from "~core";
import TextButton from "./Buttons/Text";
import i18n from "~i18n";

import SelectImageButton from "./Buttons/SelectImage";
import useIsActivateSubscribe from "src/hooks/use-is-activate-subscribe";
import { developmentConfig } from "src/read-config";

import Star from "assets/icons/Star22.svg";

interface Props extends RN.ViewProps {
	name: string;
	image: string;
	subscribeInformation?: {
		isAutoPayment: boolean;
		endSubscribe: Date;
	};
	onPress?: () => void;
	onChangeImage?: (image: string) => void;
}

const ProfileInformation: React.FC<Props> = props => {
	const { image, name, subscribeInformation, onPress, onChangeImage } = props;
	const isActivateSubscribe = developmentConfig("customHook")
		? useIsActivateSubscribe()
		: subscribeInformation !== undefined && subscribeInformation.endSubscribe > new Date();
	const refSelectImage = React.useRef<React.ElementRef<typeof SelectImageButton>>(null);

	React.useEffect(() => {
		refSelectImage.current?.setImage(image);
	}, [image]);

	return (
		<RN.View style={styles.container}>
			{onChangeImage === undefined ? (
				<RN.Image
					source={{
						uri: image,
					}}
					style={styles.image}
					resizeMethod={"resize"}
					// resizeMode={"contain"}
				/>
			) : (
				<SelectImageButton
					ref={refSelectImage}
					style={styles.image}
					onChangeImage={base64 => {
						if (base64) {
							console.log("test");
							onChangeImage(base64);
						}
					}}
				/>
			)}

			<RN.View style={styles.backgroundInfo}>
				<RN.Text style={styles.displayName}>
					{name}
					{isActivateSubscribe && <Star />}
				</RN.Text>
				<RN.Text style={styles.nameSubscribe}>
					{i18n.t("d275f2aa-4a42-47cd-86a5-0ae9cbc3ab30", {
						name: isActivateSubscribe ? "Premium" : "Base",
					})}
				</RN.Text>

				<RN.Text style={styles.timeSubscribe}>
					{isActivateSubscribe
						? i18n.t(
								subscribeInformation.isAutoPayment
									? "392fd6e3-9b0c-4673-b1c2-45deeaadd7b1"
									: "048d71cd-03e2-4c8f-9f29-d2e5e9576a07",
								{
									dateTime: i18n.strftime(new Date(subscribeInformation.endSubscribe), "%d.%m.%Y"),
								}
						  )
						: i18n.t("indefinitely")}
				</RN.Text>
				<View style={{ alignItems: "flex-start", marginTop: 10 }}>
					{onPress && <TextButton onPress={onPress}>{i18n.t("edit")}</TextButton>}
				</View>
			</RN.View>
		</RN.View>
	);
};

ProfileInformation.defaultProps = {};

const styles = StyleSheet.create({
	container: {
		width: "100%",
		flexDirection: "row",
		paddingHorizontal: 20,
	},
	background: {
		width: "100%",
		marginBottom: 55,
	},
	backgroundInfo: {
		width: "100%",
		paddingLeft: 13,
	},
	image: {
		width: 123,
		height: 123,
		borderRadius: 62,
		borderWidth: 3,
		borderColor: "#FFFFFF",
		alignSelf: "center",

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
		marginTop: 11,
	},
	timeSubscribe: {
		color: "#FFFFFF",
		fontSize: 14,
		...Tools.gStyle.font("400"),
		backgroundColor: "Red",
	},
	editButton: {
		color: "#E7DDEC",
		fontSize: 13,
		...Tools.gStyle.font("600"),
	},
});

export default ProfileInformation;
