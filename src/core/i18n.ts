import * as Localization from 'expo-localization';
import AsyncStorage from "@react-native-async-storage/async-storage";

import ru from '../i18n/ru.json';

export type LanguageApp = 'System' | 'ru-RU'

declare type Translates = {[index: string]: string | object}
declare type LibraryTranslates = {[index: string]: Translates}

type TextRow = string | {[index: string]: string} | {[index: number]: string}

declare interface TranslateOption {
  count?: number;
  paste?: string;
  composite?: { compositeIndex?: number, composite: boolean };
  indexName?: string;
}

class I18n{
  public language?: LanguageApp
  public listLanguage: Array<LanguageApp>
  protected translation: LibraryTranslates
  protected callback?: {(language: LanguageApp): void}
  protected defaultLanguage: LanguageApp
  constructor(translation:LibraryTranslates = {}, options: { defaultLanguage?: LanguageApp }={}) {
    this.translation = translation
    this.listLanguage = Object.keys(translation) as Array<LanguageApp>
    this.defaultLanguage = options.defaultLanguage ?? this.listLanguage[0] ?? 'en-EN'
    this.initLanguage().then((language)=>{
      this.setLanguage(language)
    })
  }
  
  private pluralization(count: number, textVariable: {[index: string]: string}) {
    let pluralizationCount: undefined | string
    const pluralizationType = Object.keys(textVariable)
    switch (this.language) {
      case 'ru-RU':
        if (count == 0 && pluralizationType.includes('zero')) {
          pluralizationCount = 'zero'
        } else if (count % 10 == 1 && count % 100 != 11 && pluralizationType.includes('one')) {
          pluralizationCount = 'one'
        } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100) && pluralizationType.includes('few')) {
          pluralizationCount = 'few'
        } else if (
          count % 10 == 0 ||
          [5, 6, 7, 8, 9].includes(count % 10) ||
          [11, 12, 13, 14].includes(count % 100)
          && pluralizationType.includes('many')) {
          pluralizationCount = 'many'
        }
        break
    }
    if (pluralizationCount == undefined) {
      pluralizationCount = 'other'
    }
    return (textVariable[pluralizationCount].replace('%{count}', String(count)))
  }
  
  public t(textId: string, translateOption?: TranslateOption): string {
    if (this.translation == {} || this.language == undefined) throw new Error('Not translate')
    const textRow: TextRow = this.translation[this.language]?.[textId] as TextRow ?? '--missing translate--'
    if (typeof textRow == 'string') {
      return textRow;
    }
    if ((translateOption?.composite?.composite ?? false) && Array.isArray(textRow)) {
      return textRow[translateOption?.composite?.compositeIndex ?? 0]
    }
    if (translateOption?.count != undefined && typeof textRow == 'object') {
      return this.pluralization(translateOption.count, textRow as {[index: string]: string})
    }
    if (translateOption?.indexName && !Array.isArray(textRow)) {
        return textRow[translateOption.indexName]
    }
    return '--Error translate--'
  }
  
  public on(callback: {(language: LanguageApp): void}): void {
    this.callback = callback
    if (this.language != undefined) {
      callback(this.language )
    }
  }

  public setLanguage(language: LanguageApp) {
    if (language != null) {
      this.language = language
      this.setMemoryLanguage(language)
      if (this.callback != undefined) {
        this.callback(language)
      }
    }
  }

  protected async initLanguage (): Promise<LanguageApp> {
    let language: LanguageApp
    const memoryLanguage = await this.getMemoryLanguage()
    const systemLanguage = this.getSystemLanguage()
    if (memoryLanguage != null && memoryLanguage != 'System') {
      language = memoryLanguage
    } else if (Object.keys(this.translation).includes(systemLanguage)) {
      language = systemLanguage
    } else {
      language = this.defaultLanguage
    }
    return language
  }

  protected MemoryLanguageKey = '@Language'
  public getSystemLanguage(): LanguageApp {
    return Localization.locale as LanguageApp
  }

  protected async getMemoryLanguage(): Promise<LanguageApp | null> {
    const memory = await AsyncStorage.getItem(this.MemoryLanguageKey)
    return memory != null ? memory as LanguageApp : null
  }

  protected setMemoryLanguage(language: LanguageApp): void {
    AsyncStorage.setItem(this.MemoryLanguageKey, language).then()
  }
  
  public get monthList(): Array<string> | Array<number> {
    if (this.translation == {} || this.language == undefined) throw new Error('Not translate')
    return this.translation[this.language]['[MonthList]'] as Array<string> ?? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  }
}

// initLanguage()

export default new I18n({ 'ru-RU': ru });
export type { I18n }