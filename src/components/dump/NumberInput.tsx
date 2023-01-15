/** @format */

import React, { FC, useState, useEffect } from "react";
import { TextInput, View } from "react-native";
import isMobilePhone from "validator/lib/isMobilePhone";
import i18n from "~i18n";
import gStyle from "~styles";

import listCodePhoneCountry from "assets/ListCodePhoneCountry.json";

import WithDropList from "~components/containers/with-drop-list";
import DefaultText from "~components/Text/default-text";
import { useDimensions } from "@react-native-community/hooks";

const SelectWithDropList = WithDropList<CodePhoneCountryType>();

type CodePhoneCountryType = keyof typeof listCodePhoneCountry;
const ListCodePhoneCountry = (Object.keys(listCodePhoneCountry) as CodePhoneCountryType[]).filter(name =>
	["RU", "UA", "OS", "KZ"].includes(name)
);
console.log(ListCodePhoneCountry);

const NumberInput: FC<Properties> = properties => {
	const {
		defaultCode = "RU",
		autoFocus = false,
		onChange = (number: string, isValidate) => {},
		onStatusViewDropList,
	} = properties;

	const [regionCode, setRegionCode] = useState<CodePhoneCountryType>(defaultCode);
	const [phone, setPhone] = useState<string>("");
	const onViewDropList = (isShow: boolean) => {
		if (onStatusViewDropList) onStatusViewDropList(isShow);
	};
	const { window } = useDimensions();
	useEffect(() => {
		onChange(
			`${listCodePhoneCountry[regionCode]}${phone}`,
			isMobilePhone(`${listCodePhoneCountry[regionCode]}${phone}`)
		);
	}, [regionCode, phone]);

	return (
		<>
			<SelectWithDropList
				contentDopList={ListCodePhoneCountry.map(name => ({ name: i18n.t(name), value: name }))}
				onChange={region => {
					setRegionCode(region);
				}}
				leftBorderDropList={-15}
				onOpen={() => onViewDropList(true)}
				onClose={() => onViewDropList(false)}
				style={{ height: "100%" }}
				renderItem={(name, value) => (
					<View
						style={{
							height: 50,
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<View>
							<DefaultText color={"#555555"}>{listCodePhoneCountry[value]}</DefaultText>
						</View>
						<View>
							<DefaultText color={"rgba(0, 0, 0, 0.22)"}>{name}</DefaultText>
						</View>
					</View>
				)}
			>
				<DefaultText color={"#FFF"}>{listCodePhoneCountry[regionCode]}</DefaultText>
			</SelectWithDropList>
			<TextInput
				style={{
					color: "#FFFFFF",
					...gStyle.styles.default,
					flex: 1,
					marginLeft: 15,
					borderLeftColor: "#C2A9CE",
					borderLeftWidth: 1,
					height: "100%",
					paddingLeft: 10,
				}}
				placeholder={i18n.t("c44c1286-2e08-4c18-ac68-4bae712c26a8")}
				placeholderTextColor={"#E7DDEC"}
				autoFocus={autoFocus}
				autoComplete={"tel-device"}
				textContentType={"telephoneNumber"}
				importantForAutofill={"yes"}
				keyboardType={"number-pad"}
				maxLength={10}
				returnKeyType={"go"}
				selectionColor={"#FFFFFF"}
				onChangeText={(number: string) => setPhone(number)}
			/>
			{/* <Animated.View
				style={[styles.background, backgroundAnimatedStyle]}
				onLayout={({ nativeEvent: { layout } }) => {
					if (widthAndPositionRegionList === null) {
						if (Platform.OS !== "web") {
							setWidthAndPositionRegionList({
								width: layout.width / 3,
								y: layout.y + layout.height + fixHeigth,
								x: layout.x,
							});
						}
					}
				}}
			>
				<TouchableOpacity
					style={styles.buttonRegionSelect}
					onPress={() => {
						customModalRef.current?.open();
						openList();
					}}
				>
					<Text style={styles.phoneStyle}>{listCodePhoneCountry[regionCode]}</Text>
					<Animated.View style={[arrowAnimatedStyle, { marginLeft: 5 }]}>
						<TheArrow />
					</Animated.View>
				</TouchableOpacity>
				<TextInput
					style={[styles.textInputStyle, styles.phoneStyle]}
					placeholder={i18n.t("c44c1286-2e08-4c18-ac68-4bae712c26a8")}
					placeholderTextColor={"#E7DDEC"}
					autoFocus={autoFocus}
					autoComplete={"tel-device"}
					textContentType={"telephoneNumber"}
					importantForAutofill={"yes"}
					keyboardType={"number-pad"}
					maxLength={10}
					returnKeyType={"go"}
					selectionColor={"#FFFFFF"}
					onChangeText={(number: string) => setPhone(number)}
				/>
			</Animated.View>
			<CustomModal ref={customModalRef} onClose={() => closeList()}>
				<FlatList
					style={[
						styles.flatListStyle,
						widthAndPositionRegionList
							? {
									left: widthAndPositionRegionList.x,
									top: widthAndPositionRegionList.y,
							  }
							: null,
					]}
					data={ListCodePhoneCountry}
					initialScrollIndex={ListCodePhoneCountry.indexOf(regionCode)}
					renderItem={({ item }) => (
						<ColorButtonDoubleText
							leftText={listCodePhoneCountry[item]}
							styleLeftText={styles.selectCodeNumberText}
							styleText={styles.selectCountryText}
							styleButton={styles.selectCodeNumberView}
							onPress={() => {
								customModalRef.current?.close();
								setRegionCode(item);
								closeList();
							}}
						>
							{i18n.t(item)}
						</ColorButtonDoubleText>
					)}
					showsVerticalScrollIndicator={false}
					initialNumToRender={Object.keys(regionCode).length}
					keyExtractor={item => item}
					getItemLayout={(data, index) => ({
						length: styles.selectCodeNumberView.height,
						offset: styles.selectCodeNumberView.height * index,
						index,
					})}
				/>
			</CustomModal> */}
		</>
	);
};

interface Properties {
	defaultCode?: keyof typeof listCodePhoneCountry;
	autoFocus?: boolean;
	onChange?: (number: string, isValidate: boolean) => void;
	onStatusViewDropList?: (isShow: boolean) => void;
}

export default NumberInput;
