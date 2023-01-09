/** @format */

import { useDimensions } from "@react-native-community/hooks";
import React from "react";
import { PixelRatio, Pressable, StyleProp, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import DefaultText from "~components/Text/default-text";
import CustomModal from "./CustomModal";
import ViewPaddingList, { Direction } from "./view-padding-list";
import TheArrow from "~assets/icons/TheArrow_WhiteTop.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import gStyle from "~styles";

export interface WithDropListProperty<T> {
	contentDopList: { name: string; value: T }[];
	children: JSX.Element;
	leftBorderDropList?: number;
	rightBorderDropList?: number;
	onChange?: (item: T) => void;
	style?: StyleProp<Omit<ViewStyle, "width">>;
	onOpen?: () => void;
	onClose?: () => void;
	renderItem?: (name: string, value: T) => JSX.Element;
	pixelRatio?: number;
}

function createDropList<T>() {
	const WithDropList: React.FC<WithDropListProperty<T>> = property => {
		const {
			children,
			contentDopList,
			leftBorderDropList,
			rightBorderDropList,
			onChange,
			style,
			onOpen,
			onClose,
			renderItem,
			pixelRatio = 1,
		} = property;
		const customModalReference = React.useRef<React.ElementRef<typeof CustomModal>>(null);
		const viewReference = React.useRef<View>(null);

		const [layoutList, setLayoutList] = React.useState<{ y: number; left?: number; right?: number }>();

		const rotateChevron = useSharedValue("180deg");
		const { window } = useDimensions();
		const chevronStyle = useAnimatedStyle(() => ({
			transform: [{ rotate: withTiming(rotateChevron.value) }],
		}));

		const open = async () => {
			viewReference.current?.measureInWindow((x, y, width, height) => {
				let left: undefined | number;
				let right: undefined | number;
				if (leftBorderDropList !== undefined) {
					left = x / pixelRatio;
				}
				if (rightBorderDropList !== undefined) {
					right = window.width - x / pixelRatio - width;
				}
				const t = {
					y: y / pixelRatio + insets.top + height - 24,
					left: left === undefined ? undefined : left + insets.left,
					right: right === undefined ? undefined : right + insets.right,
				};
				setLayoutList(t);
				if (onOpen) onOpen();
				rotateChevron.value = "0deg";
				customModalReference.current?.open();
			});
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
					{renderItem === undefined ? (
						<View style={{ height: 50, paddingHorizontal: 20, justifyContent: "center", width: "100%" }}>
							<DefaultText color={"#555555"}>{item.name}</DefaultText>
						</View>
					) : (
						renderItem(item.name, item.value)
					)}
				</Pressable>
			);
		});
		const insets = useSafeAreaInsets();
		return (
			<View
				ref={viewReference}
				onLayout={({ nativeEvent: { layout } }) => {
					// setImmediate(() =>
					// 	viewReference.current?.measureInWindow((x, y, width, height) => {
					// 		let left: undefined | number;
					// 		let right: undefined | number;
					// 		console.log({ x, y, width, height });
					// 		if (leftBorderDropList !== undefined) {
					// 			left = x / PixelRatio.get();
					// 		}
					// 		if (rightBorderDropList !== undefined) {
					// 			right = x / PixelRatio.get() - width;
					// 		}
					// 		const t = {
					// 			y: y / PixelRatio.get() + height + insets.top,
					// 			left: left === undefined ? undefined : left + insets.left,
					// 			right: right === undefined ? undefined : right + insets.right,
					// 		};
					// 		console.log(t);
					// 		setLayoutList(t);
					// 		if (onOpen) onOpen();
					// 		rotateChevron.value = "0deg";
					// 		customModalReference.current?.open();
					// 	})
					// );
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
				<CustomModal
					ref={customModalReference}
					onClose={() => close()}
					style={{
						backgroundColor: "#FFFFFF",
						borderBottomLeftRadius: 15,
						borderBottomRightRadius: 15,
						position: "absolute",
						top: layoutList?.y ?? 0,
						right: layoutList?.right,
						left: layoutList?.left,
						...gStyle.shadows(2, 3),
						marginLeft: leftBorderDropList ?? 0,
						marginRight: rightBorderDropList ?? 0,
					}}
				>
					<ViewPaddingList direction={Direction.Vertical} paddings={1}>
						{listComponents}
					</ViewPaddingList>
				</CustomModal>
			</View>
		);
	};
	return WithDropList;
}

export default createDropList;
