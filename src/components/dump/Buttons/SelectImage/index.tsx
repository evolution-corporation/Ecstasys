/** @format */

import React, { FC, useCallback, useState, forwardRef, useImperativeHandle } from "react";
import {
	TouchableOpacity,
	Image,
	StyleSheet,
	ActivityIndicator,
	TouchableOpacityProps,
	ColorValue,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import PhotoIcon from "./assets/PhotoIcon.svg";

interface SelectImageButtonProperties extends TouchableOpacityProps {
	onChangeImage?: { (image: string): void };
	initImage?: string;
}

interface Reference {
	setImage: (image: string) => void;
}

export const SelectImageButton = forwardRef<Reference, SelectImageButtonProperties>((properties, reference) => {
	const { onChangeImage, initImage } = properties;
	const [isLoading, setIsLoading] = useState<boolean>();
	const [image, setImage] = useState<string | null>(initImage ?? null);

	const [statusPermission, requestPermission] = ImagePicker.useMediaLibraryPermissions();

	const openPhotoLibrary = useCallback(async () => {
		setIsLoading(false);
		if (!statusPermission?.granted) {
			let permission = await requestPermission();
			let countTryGetPermission = 0;
			while (!permission.granted && permission.canAskAgain && countTryGetPermission <= 3) {
				permission = await requestPermission();
				if (!permission.granted) {
					countTryGetPermission++;
				}
			}
			if (!permission.canAskAgain || !permission.granted) {
				setIsLoading(true);
				return;
			}
		}
		const image = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			base64: true,
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			quality: 0.8,
		});

		if (image.canceled || image.assets.length === 0) {
			setIsLoading(false);
		} else {
			const { uri, base64 } = image.assets[0];
			setImage(uri);
			if (onChangeImage != undefined && base64) {
				onChangeImage(base64);
			}
		}
	}, [statusPermission]);

	useImperativeHandle(reference, () => ({
		setImage: image => {
			setImage(image);
		},
	}));

	return (
		<TouchableOpacity
			{...properties}
			style={[
				properties.style,
				{
					overflow: "hidden",
					alignItems: "center",
					justifyContent: "center",
					height: 92,
					width: 92,
					borderRadius: 46,
					borderColor: "#FFFFFF",
					borderWidth: 3,
					backgroundColor: "#E7DDEC",
				},
			]}
			onPress={() => {
				openPhotoLibrary();
			}}
		>
			{isLoading ? (
				<ActivityIndicator size={"large"} color={"#FFFFFF"} />
			) : image == undefined ? (
				<PhotoIcon />
			) : (
				<Image source={{ uri: image }} resizeMode={"cover"} style={{ width: 128, height: 128 }} />
			)}
		</TouchableOpacity>
	);
});

export default SelectImageButton;
