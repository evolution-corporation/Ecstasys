/** @format */

import React from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { ColorButton, SelectTime } from "~components/dump";
import i18n from "~i18n";
import { actions, useAppDispatch, useAppSelector } from "~store";
import { RootScreenProps } from "~types";

const DMDSelectTimeBright: RootScreenProps<"DMDSelectTimeBright"> = ({ navigation, route }) => {
	const { type } = route.params;

	const value = useAppSelector(store =>
		type === "activate" ? store.DMD.configuratorNotification.activate : store.DMD.configuratorNotification.random
	);
	const selectTime = React.useRef<number>(value);
	const dispatch = useAppDispatch();

	return (
		<View style={{ flex: 1 }}>
			<Pressable style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", flexGrow: 1 }} onPress={() => navigation.goBack()} />
			<View style={styles.container}>
				<SelectTime
					start={type === "activate" ? [5, 0] : [35, 0]}
					end={type === "activate" ? [10, 0] : [45, 0]}
					onChange={time => {
						selectTime.current = (time[0] * 60 + time[1]) * 1000;
					}}
					style={styles.selectTime}
				/>
				<ColorButton
					styleButton={styles.button}
					styleText={styles.buttonText}
					onPress={() => {
						dispatch(
							actions.setTimeConfiguratorForDMD({
								type: type === "activate" ? "action" : "random",
								value: selectTime.current,
							})
						);
						navigation.goBack();
					}}
				>
					{i18n.t("ready")}
				</ColorButton>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#FFFFFF",
		alignItems: "center",
		paddingBottom: 31,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		position: "absolute",
		width: "100%",
		bottom: 0,
	},
	button: {
		backgroundColor: "#C2A9CE",
		height: 45,
		borderRadius: 100,
		paddingHorizontal: 25,
	},
	buttonText: {
		color: "#FFFFFF",
	},
	selectTime: {
		marginVertical: 9,
	},
});

export default DMDSelectTimeBright;
