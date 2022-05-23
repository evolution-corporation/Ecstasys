import { StyleSheet, Dimensions, Platform } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadAsync as loadAsyncFont } from 'expo-font'
import { Roboto_100Thin, Roboto_300Light, Roboto_500Medium, Roboto_700Bold, Roboto_900Black } from '@expo-google-fonts/roboto'

export type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'

interface Theme {
	themeName: string
	fontFamily: string
}

interface ThemeOptions {
	fontFamily?: string
}

export const ThemeLibrary:{[index: string]: Theme} = {
	system: {
		themeName: 'system',
		fontFamily: 'System'
	},
	app: {
		themeName: 'app',
		fontFamily: Platform.OS == 'android' ? 'Roboto' : 'System'
	}
}

class Style {
	public callback?: {(themesName: string): void}
	private theme?: Theme
	constructor() {
		this.initTheme()
	}
	
	public on(callback: {(themesName: string): void}): void {
		this.callback = callback
		if (this.theme != undefined) {
			callback(this.theme.themeName)
		}
	}
	
	public settingThemes(nameThemes: string | null | 'custom' | 'system' | 'app', options?: ThemeOptions) {
		if (nameThemes == null || 'custom' && options != undefined) {
			this.theme = {
				themeName: 'custom',
				fontFamily: options?.fontFamily ?? this.theme?.fontFamily ?? 'System'
			}
		} else if (nameThemes == 'system') {
			this.theme = ThemeLibrary.system
		} else if (Object.keys(ThemeLibrary).includes(nameThemes)) {
			this.theme = ThemeLibrary[nameThemes]
		} else {
			this.theme = ThemeLibrary.app
		}
		this.setMemoryTheme()
		if (this.callback != undefined) {
			this.callback(this.theme.themeName)
		}
	}
	
	protected async initTheme() {
		await loadAsyncFont({
			Roboto_Thin: Roboto_100Thin,
			Roboto_Light: Roboto_300Light,
			Roboto_Medium: Roboto_500Medium,
			Roboto_Bold: Roboto_700Bold,
			Roboto_Black: Roboto_900Black,
		})
		
		const theme = await this.getMemoryTheme()
		if (typeof theme == 'string' || theme == null) {
			this.settingThemes(theme ?? 'app')
		} else {
			this.settingThemes('custom', theme)
		}
	}
	
	protected ThemesNameKey = '@Theme'
	
	protected async getMemoryTheme(): Promise<Theme | string | null> {
		let theme = await AsyncStorage.getItem(this.ThemesNameKey)
		return JSON.parse(theme ?? 'null')
		
	}
	
	protected async setMemoryTheme() {
		await AsyncStorage.setItem(
			this.ThemesNameKey,
			JSON.stringify(this.theme?.themeName == 'custom' ? this.theme : this.theme?.themeName ?? 'app')
		)
	}
	
	public StyleSheetTable = StyleSheet.create({
		h1: {
			color: '#FFFFFF',
			fontStyle: 'normal',
			...this.getFontOption('700'),
			textAlign: 'center',
			// marginBottom: 30,
			fontSize: 24,
		},
		h2: {
			color: '#FFFFFF',
			fontStyle: 'normal',
			...this.getFontOption('700'),
			textAlign: 'center',
			// marginBottom: 30,
			fontSize: 18,
		},
		standardTextStyle: {
			color: '#2B2A29',
			fontStyle: 'normal',
			...this.getFontOption('500'),
			fontSize: 11
		},
		hrefLink: {
			color: 'rgba(239, 239, 239, 0.75)',
			fontStyle: 'normal',
			...this.getFontOption('600'),
			textAlign: 'center',
			fontSize: 11,
		},
		transparentInputWithBorder: {
			color: '#FFFFFF',
			...this.getFontOption(),
			fontSize: 14,
			width: '100%',
			padding: 14,
			borderRadius: 10,
			borderColor: '#CBE1A8',
			borderWidth: 1,
			borderStyle: 'solid',
			backgroundColor: 'rgba(240, 242, 238, 0.19)',
			height: 45,
		},
		transparentInputSmall: {
			color: '#FFFFFF',
			fontFamily: Platform.OS == 'android' ? 'Roboto-Medium' : 'System',
			fontSize: 30,
			width: 29,
			padding: 0,
			borderRadius: 4,
			backgroundColor: 'rgba(255, 255, 255, 0.43)',
			height: 37,
			textAlign: 'center',
			textAlignVertical: 'center',
		},
	})
	
	public get h1(){
		return this.StyleSheetTable.h1
	}
	public get h2(){
		return this.StyleSheetTable.h2
	}
	
	public get standardTextStyle(){
		return this.StyleSheetTable.standardTextStyle
	}
	public get hrefLink(){
		return this.StyleSheetTable.hrefLink
	}
	public get transparentInputWithBorder(){
		return this.StyleSheetTable.transparentInputWithBorder
	}
	public get transparentInputSmall(){
		return this.StyleSheetTable.transparentInputSmall
	}
	
	public get fontFamily() {
		return this.theme?.fontFamily
	}
	
	public getFontOption(weight: FontWeight = 'normal'): { fontFamily: string, fontWeight?: FontWeight } {
		const fontFamily = this.theme?.fontFamily ?? 'System'
		switch (fontFamily) {
			case 'Roboto':
				let subName: string
				switch (weight) {
					case '100':
					case '200':
						subName = 'Thin'
						break
					case '300':
					case '400':
						subName = 'Light'
						break
					case 'normal':
					case '500':
					case '600':
						subName = 'Medium'
						break
					case '700':
					case '800':
						subName = 'Bold'
						break
					case '900':
					case 'bold':
						subName = 'Black'
						break
				}
				return {fontFamily: `Roboto_${subName}`}
			default:
				return {fontFamily: this.theme?.fontFamily ?? 'System', fontWeight: weight}
		}
	}
}

export const styleImage = StyleSheet.create({
	imageFullWidth: {
		width: '100%',
		resizeMode: 'contain',
	},
});

const styleSheet = new Style()

export default styleSheet
export type { Style }