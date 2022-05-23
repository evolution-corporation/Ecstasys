// import React, { Component } from 'react'
// import { Dimensions, View } from 'react-native'
// import type { ViewProps } from 'react-native'
// import type { ReactChildren, FC } from 'react'
// import {BackGroundProps} from "../elements/background/background";
//
// interface ScreenProps {
// }
//
// interface ScreenState {}
//
//
// export default class Screen extends Component<ScreenProps, ScreenState> {
// 	protected heightScreen: number = Dimensions.get('screen').height
// 	protected widthScreen: number = Dimensions.get('screen').width
// 	protected screenView?: ReactChildren | JSX.Element
// 	protected background?: FC<any>
// 	protected backgroundProps?: any
// 	protected screenViewList: Array<JSX.Element | ReactChildren> = []
//
// 	constructor(props: ScreenProps, state: ScreenState) {
// 		super(props);
// 		this.state = state
// 	}
//
//
//
// 	protected editBackground(component: FC<any>, props?: any ) {
// 		this.background = component
// 		this.backgroundProps = props
// 		this.forceUpdate()
// 	}
//
//
// 	protected editScreenView(jsxConstruction: JSX.Element | ReactChildren) {
// 		this.screenView = jsxConstruction
// 		this.forceUpdate()
// 	}
//
// 	render() {
// 		if (this.background != undefined && this.screenView != undefined) {
// 			return (
// 				<this.background {...this.backgroundProps}>
// 					{this.screenView}
// 				</this.background>
// 			)
// 		}
// 		return null
// 	}
// }