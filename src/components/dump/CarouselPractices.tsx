/** @format */

import React, { FC, useCallback, useRef } from "react";
import { StyleSheet, FlatList, ViewProps, Dimensions, ViewToken, ViewabilityConfig, View } from "react-native";

import CarouselPracticesElement from "./CarouselPracticesElement";
import { State } from "~types";

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
				refFlatList.current?.scrollToIndex({ index, animated: false });
				setSelectedIndex(index);
			}
		},
		[selectedIndex]
	);

	const fixRefonLayout = useRef<() => void>();

	if (widthCarousel <= 300 || data.length === 0) {
		return null;
	}

	return (
		<View
			style={[{ flex: 1, overflow: "hidden" }, style]}
			onLayout={({ nativeEvent: { layout } }) => {
				if (widthCarousel === null) setWidthCarousel(layout.width);
				if (!isFlatListRender.current) {
					isFlatListRender.current = true;
					let index = 0;
					if (data.length >= 3) {
						index = 1;
					}
					fixRefonLayout.current = () => {
						refFlatList.current?.scrollToIndex({ index, animated: false, viewOffset: widthCarousel - 254 });

						setSelectedIndex(index);
						if (onChange) onChange(data[index].id);
					};
				}
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
							practice={item}
							isSelected={index === selectedIndex}
							isPermission={item.isPermission}
							onPress={() => onPressElement(index, item.id)}
							sharedID={`practice.item.${item.id}`}
						/>
					</View>
				)}
				//* Разбивка на страницы
				snapToInterval={254}
				pagingEnabled
				// initialScrollIndex={data.length >= 3 ? 1 : 0}
				decelerationRate={0.98}
				disableIntervalMomentum
				//* визуальные настройки
				style={styles.flatList}
				contentContainerStyle={{
					paddingHorizontal: (widthCarousel - 254) / 2 + Math.abs(styles.flatList.left), //* скрываем индикатор начала/конца прокрутки
				}}
				onLayout={() => {
					if (fixRefonLayout.current !== undefined) {
						fixRefonLayout.current();
						fixRefonLayout.current = undefined;
					}
				}}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				//* настройка логики
				viewabilityConfig={_viewabilityConfig}
				onViewableItemsChanged={_onViewableItemsChanged}
				// getItemLayout={(data, index) => ({
				// 	length: styles.elementList.width,
				// 	offset: styles.elementList.width * index,
				// 	index,
				// })}
				onScrollToIndexFailed={() => alert("ERRRRROR jhfdakvhdbfahjsbdsaljbfldhafdjsblhasjblfahjdsbf")}
			/>
		</View>
	);
};

interface CarouselMeditationProps extends ViewProps {
	data: (State.Practice & { isPermission: boolean })[];
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
