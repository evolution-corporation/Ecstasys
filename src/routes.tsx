import React, { FC } from "react";
import {createNativeStackNavigator, NativeStackScreenProps} from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { View } from 'react-native'
import i18n from "~i18n";


const TabNavigator = createBottomTabNavigator()

const TabRoutes = () => (
	//@ts-ignore
	<TabNavigator.Navigator>
		<TabNavigator.Screen name={"Profile"} component={() => (<View>{null}</View>)}/>
	</TabNavigator.Navigator>
)

const RootNavigation = createNativeStackNavigator<RootStackList>()

const RootRoutes: FC = () => {
	console.log('root')
	return(
		//@ts-ignore
		<RootNavigation.Navigator>
			<RootNavigation.Screen name={"TabNavigator"} component={TabRoutes}/>
		</RootNavigation.Navigator>
	)
}


export default RootRoutes

export type RootStackList = {
	TabNavigator: undefined
};
export type RootScreenProps<T extends keyof RootStackList> = FC <NativeStackScreenProps<RootStackList, T >>;