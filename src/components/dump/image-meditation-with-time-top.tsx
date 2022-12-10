/** @format */

import React from "react";
import { View, Image, StyleSheet, ImageSourcePropType } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SharedElement } from "react-navigation-shared-element";
import DateTime from "src/global/class/date-time";
import useSizeElement from "src/hooks/use-size-element";
import ViewFullSpace, { Direction } from "~components/layouts/view-full-space";
import { PositionElements } from "~components/layouts/view-full-width";
import ViewPadding from "~components/layouts/view-padding";
import ViewSizeHidden from "~components/layouts/view-size-hidden";
import GradientShowTimeMeditation from "./gradient-show-time-meditation";

interface ImageMeditationWitTimeTopProperties {
	image: ImageSourcePropType;
	time: DateTime;
	bottomContent?: JSX.Element;
	id: string;
}

const ImageMeditationWitTimeTop: React.FC<ImageMeditationWitTimeTopProperties> = property => {
	const { image, time, bottomContent, id } = property;
	const insets = useSafeAreaInsets();
	const headerHeight = 55; //! Добавить хук для получения высоты шапки
	return (
		<View style={{ width: "100%", flex: 1 }}>
			<ViewSizeHidden
				style={{ width: "100%", height: "100%", borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
			>
				<SharedElement id={`practice.item.${id}`}>
					<Image source={image} style={{ width: "100%", height: "100%" }} />
				</SharedElement>
			</ViewSizeHidden>
			<ViewFullSpace
				style={{ position: "absolute", alignItems: "center" }}
				direction={Direction.TopBottom}
				mainPositionElements={PositionElements.StartEnd}
			>
				<ViewPadding top={insets.top + headerHeight} flexSize={0}>
					<GradientShowTimeMeditation timeMilliseconds={time.getTime()} />
				</ViewPadding>
				{bottomContent ? <ViewPadding bottom={17}>{bottomContent}</ViewPadding> : <View />}
			</ViewFullSpace>
		</View>
	);
};

ImageMeditationWitTimeTop.defaultProps = {};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
	},
});

export default ImageMeditationWitTimeTop;
