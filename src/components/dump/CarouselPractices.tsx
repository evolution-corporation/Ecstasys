/** @format */

import React, { FC, useCallback, useEffect, useRef } from "react";
import {
	StyleSheet,
	FlatList,
	ViewProps,
	Dimensions,
	ViewToken,
	ViewabilityConfig,
	StyleProp,
	ViewStyle,
	View,
} from "react-native";
import Animated, {
	interpolate,
	SharedValue,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { MeditationType } from "~modules/meditation";
import CarouselPracticesElement from "./CarouselPracticesElement";
import Tools from "~core";
import { State } from "~types";

interface AnimatedValue {
	scale: SharedValue<number>;
	translateX: SharedValue<number>;
	zIndex: SharedValue<number>;
}

type AnimateStyle = StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>>;

const CarouselMeditation: FC<CarouselMeditationProps> = props => {
	const { data, style, onChange, onPress } = props;
	//* состояния
	const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
	const [widthCarousel, setWidthCarousel] = React.useState<number>(Dimensions.get("window").width);

	//* переменны вне рендера
	const isFlatListRender = useRef<boolean>(false);
	const _viewabilityConfig = useRef<ViewabilityConfig>({
		viewAreaCoveragePercentThreshold: 90,
		waitForInteraction: true,
	}).current;

	const refFlatList = useRef<FlatList>(null);

	const _onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
		if (viewableItems.length > 0) {
			const mediumIndex = Math.floor(viewableItems.length / 2);
			if (viewableItems[mediumIndex].index !== null) {
				setSelectedIndex(viewableItems[mediumIndex].index ?? 0);
				if (onChange) {
					const index = viewableItems[mediumIndex].index;
					onChange(index !== null ? data[index].id : null);
				}
			}
		}
	}).current;

	const onPressElement = useCallback(
		(index: number, practiceId: string) => {
			if (index === selectedIndex) {
				if (onPress) onPress(practiceId);
			} else {
				refFlatList.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
				setSelectedIndex(index);
			}
		},
		[selectedIndex]
	);

	if (widthCarousel <= 300) {
		return null;
	}

	return (
		<View
			style={[{ flex: 1, overflow: "hidden" }, style]}
			onLayout={({ nativeEvent: { layout } }) => {
				setWidthCarousel(layout.width);
			}}
		>
			<FlatList
				data={data}
				ref={refFlatList}
				horizontal={true}
				// * настройка элемента списка
				keyExtractor={item => item.id}
				renderItem={({ item, index }) => (
					<View style={styles.elementList}>
						<CarouselPracticesElement
							description={item.description}
							image={item.image}
							isSelected={index === selectedIndex}
							isFavorite={false}
							isPermission={true}
							lengthAudio={item.length}
							name={item.name}
							onPress={() => onPressElement(index, item.id)}
						/>
					</View>
				)}
				//* Разбивка на страницы
				snapToInterval={254}
				pagingEnabled
				decelerationRate={0.98}
				disableIntervalMomentum
				//* визуальные настройки
				style={styles.flatList}
				contentContainerStyle={{
					paddingHorizontal: (widthCarousel - 254) / 2 + Math.abs(styles.flatList.left), //* скрываем индикатор начала/конца прокрутки
				}}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				//* настройка логики
				viewabilityConfig={_viewabilityConfig}
				onViewableItemsChanged={_onViewableItemsChanged}
				onLayout={() => {
					if (!isFlatListRender.current) {
						isFlatListRender.current = true;
						let index = 0;
						if (data.length >= 3) {
							index = 1;
						}
						refFlatList.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
						setSelectedIndex(index);
					}
				}}
			/>
		</View>
	);
};

interface CarouselMeditationProps extends ViewProps {
	data: State.Practice[];
	onChange?: (practiceId: string | null) => void;
	onPress?: (practiceId: string) => void;
}
const styles = StyleSheet.create({
	backgroundCard: {
		alignItems: "center",
		marginHorizontal: 0,
	},
	separator: {
		width: 16,
		backgroundColor: "red",
	},
	elementList: {
		width: 254,
	},
	flatList: {
		position: "absolute",
		top: 0,
		left: -55, //* скрываем индикатор начала/конца прокрутки
		right: -55, //* скрываем индикатор начала/конца прокрутки
	},
});

export default CarouselMeditation;
{
	/* <View style={styles.informationMeditation}>
              <Text style={styles.name}>{meditationData.name}</Text>
              <Text style={styles.description}>
                {meditationData.description}
              </Text>
            </View>
            <ColorButton
              styleButton={styles.buttonStyle}
              styleText={styles.buttonStyleText}
            >
              {Tools.i18n.t("38554780-274e-4802-9d07-fd4332c7a29d")}
            </ColorButton> */
}
