/** @format */

import { useDimensions } from "@react-native-community/hooks";
import Constants from "expo-constants";
import React from "react";
import { Pressable, StyleProp, useWindowDimensions, View, ViewStyle } from "react-native";
import Animated, { max, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import DefaultText from "~components/Text/default-text";
import CustomModal from "./CustomModal";
import ViewPaddingList, { Direction } from "./view-padding-list";
import TheArrow from "~assets/icons/TheArrow_WhiteTop.svg";

export interface WithDropListProperty<T> {
	contentDopList: { name: string; value: T }[];
	children: JSX.Element;
	leftBorderDropList?: number;
	rightBorderDropList?: number;
	onChange?: (item: T) => void;
	style?: StyleProp<Omit<ViewStyle, "width">>;
	onOpen?: () => void;
	onClose?: () => void;
}

function createDropList<T>() {
	const WithDropList: React.FC<WithDropListProperty<T>> = property => {
		const { children, contentDopList, leftBorderDropList, rightBorderDropList, onChange, style, onOpen, onClose } =
			property;
		const customModalReference = React.useRef<React.ElementRef<typeof CustomModal>>(null);
		const viewReference = React.useRef<View>(null);

		const [layoutList, setLayoutList] = React.useState<{ y: number; left?: number; right?: number }>();

		const rotateChevron = useSharedValue("180deg");
		const { window } = useDimensions();
		const chevronStyle = useAnimatedStyle(() => ({
			transform: [{ rotate: withTiming(rotateChevron.value) }],
		}));

		const open = async () => {
			if (onOpen) onOpen();
			rotateChevron.value = "0deg";
			customModalReference.current?.open();
		};

		const close = async () => {
			if (onClose) onClose();
			rotateChevron.value = "180deg";
			customModalReference.current?.close();
		};

		const listComponents = contentDopList.map((item, index) => {
			return (
				<Pressable
					onPress={() => {
						if (onChange) onChange(item.value);
						close();
					}}
					key={`item.${index}`}
				>
					<View style={{ height: 28, paddingHorizontal: 20, justifyContent: "center", width: "100%" }}>
						<DefaultText color={"#555555"}>{item.name}</DefaultText>
					</View>
				</Pressable>
			);
		});
		return (
			<View
				ref={viewReference}
				onLayout={({ nativeEvent: { layout } }) => {
					setImmediate(() =>
						viewReference.current?.measureInWindow((x, y, width, height) => {
							let left: undefined | number;
							let right: undefined | number;
							if (leftBorderDropList !== undefined) {
								left = x + (x - layout.x) + 3 + leftBorderDropList;
							}
							if (rightBorderDropList !== undefined) {
								console.log(Math.abs(x - window.width));
								right = window.width - (x + width + (x - layout.x) + 4) + rightBorderDropList;
							}
							setLayoutList({
								y: y + height / 2,
								left,
								right,
							});
						})
					);
				}}
			>
				<Pressable onPress={() => open()}>
					<View
						style={[
							{
								justifyContent: "center",
								alignItems: "center",
								height: "100%",
								flexDirection: "row",
							},
							style,
						]}
					>
						<ViewPaddingList direction={Direction.Horizontal} paddings={[10, 5, 0]}>
							{children}
							<Animated.View style={chevronStyle}>
								<TheArrow />
							</Animated.View>
						</ViewPaddingList>
					</View>
				</Pressable>
				<CustomModal ref={customModalReference} onClose={() => close()}>
					<View
						style={{
							backgroundColor: "#FFFFFF",
							borderBottomLeftRadius: 15,
							borderBottomRightRadius: 15,
							position: "absolute",
							top: layoutList?.y ?? 0,
							right: layoutList?.right,
							left: layoutList?.left,
						}}
					>
						<ViewPaddingList direction={Direction.Vertical} paddings={1}>
							{listComponents}
						</ViewPaddingList>
					</View>
				</CustomModal>
			</View>
		);
	};
	return WithDropList;
}

export default createDropList;
