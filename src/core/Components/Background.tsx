import React from 'react'
import RN, { View, ImageBackground, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import * as StatusBar from 'expo-status-bar';

interface universal {
	backgroundColor: RN.ColorValue,
	statusBarStyle: StatusBar.StatusBarStyle | 'hidden',
	children?: React.ReactChildren
}

interface WithImage {
	type: 'withImage'
	image: RN.ImageSourcePropType
	stretchToTheScreen?: boolean
	statusBarTranslucent?: boolean
}

interface OnlyColor {
	type: 'onlyColor'
}

type BackgroundProps = universal & (WithImage | OnlyColor)

export default (props: BackgroundProps) => {
	const { statusBarStyle } = props
	StatusBar.setStatusBarHidden(statusBarStyle == 'hidden', 'none')
	if (statusBarStyle != 'hidden') {
		StatusBar.setStatusBarStyle(statusBarStyle)
	}
	if (props.type == 'withImage') {
		StatusBar.setStatusBarTranslucent(props.statusBarTranslucent ?? true)
		const screenInfo = RN.useWindowDimensions()
		const imageInfo = getImageData(props.image)
		let imageSize: ImageSize
		if (props.stretchToTheScreen || screenInfo.width * imageInfo.ratio < screenInfo.height) {
			imageSize = {
				width: screenInfo.width,
				height: screenInfo.height,
				imageResize: 'stretch',
				top: 0,
				left: 0
			}
		} else {
			imageSize = {
				width: screenInfo.width,
				height: screenInfo.width * imageInfo.ratio,
				imageResize: 'center',
				top: screenInfo.height - screenInfo.width * imageInfo.ratio,
				left: 0
			}
		}
		return (
			<ImageBackground source={props.image} style={[imageSize, { backgroundColor: props.backgroundColor, position: 'absolute' }]}>
				<>
					{props.children}
				</>
			</ImageBackground>
		)
	} else if (props.type == 'onlyColor') {
		StatusBar.setStatusBarTranslucent(false)
	}
	return null
}

function getImageData(image: RN.ImageSourcePropType): { width: number, height: number, ratio: number } {
	const { width, height } = Image.resolveAssetSource(image)
	const ratio = height / width
	return { width, height, ratio }
}

type ImageSize = { width: number, height: number, imageResize: RN.ImageResizeMode, top: number, left: 0}