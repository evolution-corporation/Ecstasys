import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TranslateLib from "~assets/i18n";

export class I18nClass {
  public language?: LanguageApp = "ru";
  public listLanguage: Array<LanguageApp>;
  protected translation: LibraryTranslates = {};
  protected callback?: callback;
  protected defaultLanguage: LanguageApp;
  protected translate?: Translates;
  protected errorTranslateMessage: string = "--Error translate--";
  constructor(translation: LibraryTranslates, options: initOptions = {}) {
    this.translation = translation;
    this.listLanguage = Object.keys(translation) as Array<LanguageApp>;
    this.defaultLanguage = options.defaultLanguage ?? "System";
    this.callback = options.callback;
    if (options.defaultLanguage) {
      this.translate = translation[options.defaultLanguage as languageCode];
    }
    this.initLanguage().then((language) => {
      this.setLanguage(language);
    });
  }

  private pluralization(
    count: number,
    textVariable: { [index: string]: string }
  ) {
    let pluralizationCount: undefined | string;
    const pluralizationType = Object.keys(textVariable);
    switch (this.language) {
      case "ru":
        if (count == 0 && pluralizationType.includes("zero")) {
          pluralizationCount = "zero";
        } else if (
          count % 10 == 1 &&
          count % 100 != 11 &&
          pluralizationType.includes("one")
        ) {
          pluralizationCount = "one";
        } else if (
          [2, 3, 4].includes(count % 10) &&
          ![12, 13, 14].includes(count % 100) &&
          pluralizationType.includes("few")
        ) {
          pluralizationCount = "few";
        } else if (
          count % 10 == 0 ||
          [5, 6, 7, 8, 9].includes(count % 10) ||
          ([11, 12, 13, 14].includes(count % 100) &&
            pluralizationType.includes("many"))
        ) {
          pluralizationCount = "many";
        }
        break;
    }
    if (pluralizationCount == undefined) {
      pluralizationCount = "other";
    }
    return textVariable[pluralizationCount].replace("%{count}", String(count));
  }

  public t(textId: string, translateOption?: TranslateOption): string {
    if (!this.translate) throw new Error("I18n don`t loading");
    const textRow: TextRowTranslate =
      this.translate[textId] ?? "--missing translate--";
    if (typeof textRow == "string") {
      return textRow;
    }
    if (
      (translateOption?.composite?.composite ?? false) &&
      Array.isArray(textRow)
    ) {
      return textRow[translateOption?.composite?.compositeIndex ?? 0];
    }
    if (translateOption?.count != undefined && typeof textRow == "object") {
      return this.pluralization(
        translateOption.count,
        textRow as { [index: string]: string }
      );
    }
    if (translateOption?.indexName && !Array.isArray(textRow)) {
      return textRow[translateOption.indexName];
    }
    return this.errorTranslateMessage;
  }

  public setLanguage(language: LanguageApp) {
    if (!this.language) throw new Error("I18n don`t loading");
    if (language != null) {
      this.language = language;
      this.setMemoryLanguage(language);
      this.translate =
        this.translation[
          language == "System" ? this.getSystemLanguage() : language
        ];
      if (this.callback) {
        this.callback({ language });
      }
    }
  }

  protected async initLanguage(): Promise<LanguageApp> {
    let language: LanguageApp;
    const memoryLanguage = await this.getMemoryLanguage();
    const systemLanguage = this.getSystemLanguage();
    if (memoryLanguage != null && memoryLanguage != "System") {
      language = memoryLanguage;
    } else if (Object.keys(this.translation).includes(systemLanguage)) {
      language = systemLanguage;
    } else {
      language = this.defaultLanguage;
    }
    return language;
  }

  protected MemoryLanguageKey = "@Language";
  public getSystemLanguage(): languageCode {
    return Localization.locale.slice(0, 2) as languageCode;
  }

  protected async getMemoryLanguage(): Promise<LanguageApp | null> {
    const memory = await AsyncStorage.getItem(this.MemoryLanguageKey);
    return memory != null ? (memory as LanguageApp) : null;
  }

  protected setMemoryLanguage(language: LanguageApp): void {
    AsyncStorage.setItem(this.MemoryLanguageKey, language).then();
  }

  public get monthList(): Array<string> {
    if (!this.translate) throw new Error("I18n don`t loading");
    return this.translate?.["[MonthList]"];
  }

  public on(callback: callback): void {
    this.callback = callback;
    this.callback({ language: this.language as LanguageApp });
  }

  public getCountryList(): { [index in CodeCountryISOType]: string } {
    if (!this.translate) throw new Error("I18n don`t loading");
    return this.translate?.["[CountryName]"];
  }

  public getCountryName(code: CodeCountryISOType): string {
    if (!this.translate) throw new Error("I18n don`t loading");
    return this.translate?.["[CountryName]"][code];
  }

  public getCodeCountryISO(sort: boolean = false) {
    if (sort) {
      return CodeCountryISO.sort((first, second) =>
        this.getCountryName(first) > this.getCountryName(second) ? 1 : -1
      );
    }
    return CodeCountryISO;
  }

  public getTime(time: number, format: "minute"): string {
    const timeTranslate = this.translate?.["[Time]"];
    if (timeTranslate == undefined) return this.errorTranslateMessage;
    switch (format) {
      case "minute":
        return `${this.pluralization(
          Math.round(time),
          timeTranslate["minute"]
        )}`;
    }
  }

  public getMood(mood: UserMood, variable: number = 0) {
    const moodTranslate = this.translate?.["[Mood]"];
    if (moodTranslate == undefined) return this.errorTranslateMessage;
    if (moodTranslate[mood].length - 1 < variable) variable = 0;
    return moodTranslate[mood][variable];
  }

  public getTypeMeditation(
    typeMeditation: TypeMeditation,
    variable: number = 0
  ) {
    const typeMeditationTranslate = this.translate?.["[TypeMeditation]"];
    if (typeMeditationTranslate == undefined) return this.errorTranslateMessage;
    if (typeMeditationTranslate[typeMeditation].length - 1 < variable)
      variable = 0;
    return typeMeditationTranslate[typeMeditation][variable];
  }

  public getSpecialTranslate(
    nameParameters:
      | "[CountDay_ParameterMeditation]"
      | "[Time_ParameterMeditation]",
    value: CountDay_ParameterMeditation | Time_ParameterMeditation
  ): string {
    const translate = this.translate?.[nameParameters];
    if (translate == undefined) return this.errorTranslateMessage;
    return translate[value];
  }

  public getLegalDocument(type: "userAgreement" | "privacyPolicy"): string {
    const LegalDocumentTranslate = this.translate?.["[DocumentName]"][type];
    if (LegalDocumentTranslate == undefined) return this.errorTranslateMessage;
    return LegalDocumentTranslate;
  }

  public getCountDay_ParameterMeditation(
    countDay: CountDay_ParameterMeditation
  ) {
    return this.getSpecialTranslate("[CountDay_ParameterMeditation]", countDay);
  }

  public getTime_ParameterMeditation(time: Time_ParameterMeditation) {
    return this.getSpecialTranslate("[Time_ParameterMeditation]", time);
  }

  public getTypeMeditationDescription(
    typeMeditation: TypeMeditation,
    variable: "small" | "full" = "small"
  ): string {
    const typeMeditationTranslate =
      this.translate?.["[TypeMeditationDescription]"];
    if (typeMeditationTranslate == undefined) return this.errorTranslateMessage;

    return typeMeditationTranslate[typeMeditation][variable];
  }

  public getBackgroundMusicImage(backgroundMusicName: BackgroundMusic): string {
    const typeMeditationTranslate = this.translate?.["[BackgroundMusicName]"];
    if (typeMeditationTranslate == undefined) return this.errorTranslateMessage;

    return typeMeditationTranslate[backgroundMusicName];
  }
}

const i18n = new I18nClass(TranslateLib as LibraryTranslates, {
  defaultLanguage: "ru",
});

export default i18n;

export type languageCode =
  | "aa"
  | "ab"
  | "af"
  | "ak"
  | "sq"
  | "am"
  | "ar"
  | "an"
  | "hy"
  | "as"
  | "av"
  | "ae"
  | "ay"
  | "az"
  | "ba"
  | "bm"
  | "eu"
  | "be"
  | "bn"
  | "bh"
  | "bi"
  | "bo"
  | "bs"
  | "br"
  | "bg"
  | "my"
  | "ca"
  | "cs"
  | "ch"
  | "ce"
  | "zh"
  | "cu"
  | "cv"
  | "kw"
  | "co"
  | "cr"
  | "cy"
  | "cs"
  | "da"
  | "de"
  | "dv"
  | "nl"
  | "dz"
  | "el"
  | "en"
  | "eo"
  | "et"
  | "eu"
  | "ee"
  | "fo"
  | "fa"
  | "fj"
  | "fi"
  | "fr"
  | "fr"
  | "fy"
  | "ff"
  | "ka"
  | "de"
  | "gd"
  | "ga"
  | "gl"
  | "gv"
  | "el"
  | "gn"
  | "gu"
  | "ht"
  | "ha"
  | "he"
  | "hz"
  | "hi"
  | "ho"
  | "hr"
  | "hu"
  | "hy"
  | "ig"
  | "is"
  | "io"
  | "ii"
  | "iu"
  | "ie"
  | "ia"
  | "id"
  | "ik"
  | "is"
  | "it"
  | "jv"
  | "ja"
  | "kl"
  | "kn"
  | "ks"
  | "ka"
  | "kr"
  | "kk"
  | "km"
  | "ki"
  | "rw"
  | "ky"
  | "kv"
  | "kg"
  | "ko"
  | "kj"
  | "ku"
  | "lo"
  | "la"
  | "lv"
  | "li"
  | "ln"
  | "lt"
  | "lb"
  | "lu"
  | "lg"
  | "mk"
  | "mh"
  | "ml"
  | "mi"
  | "mr"
  | "ms"
  | "mk"
  | "mg"
  | "mt"
  | "mn"
  | "mi"
  | "ms"
  | "my"
  | "na"
  | "nv"
  | "nr"
  | "nd"
  | "ng"
  | "ne"
  | "nl"
  | "nn"
  | "nb"
  | "no"
  | "ny"
  | "oc"
  | "oj"
  | "or"
  | "om"
  | "os"
  | "pa"
  | "fa"
  | "pi"
  | "pl"
  | "pt"
  | "ps"
  | "qu"
  | "rm"
  | "ro"
  | "ro"
  | "rn"
  | "ru"
  | "sg"
  | "sa"
  | "si"
  | "sk"
  | "sk"
  | "sl"
  | "se"
  | "sm"
  | "sn"
  | "sd"
  | "so"
  | "st"
  | "es"
  | "sq"
  | "sc"
  | "sr"
  | "ss"
  | "su"
  | "sw"
  | "sv"
  | "ty"
  | "ta"
  | "tt"
  | "te"
  | "tg"
  | "tl"
  | "th"
  | "bo"
  | "ti"
  | "to"
  | "tn"
  | "ts"
  | "tk"
  | "tr"
  | "tw"
  | "ug"
  | "uk"
  | "ur"
  | "uz"
  | "ve"
  | "vi"
  | "vo"
  | "cy"
  | "wa"
  | "wo"
  | "xh"
  | "yi"
  | "yo"
  | "za"
  | "zh"
  | "zu";

export type LanguageApp = "System" | languageCode;

export type TextRowTranslate =
  | string
  | {
      [index: string | number]: string | { [index: string]: string } | string[];
    }
  | string[];
export interface Translates {
  "[MonthList]": string[];
  "[LanguageName]": string;
  "[CountryName]": { [index in CodeCountryISOType]: string };
  "[Time]": {
    [index in "secund" | "minute" | "hour"]: { [index: string]: string };
  };
  "[Mood]": { [index in UserMood]: string[] };
  "[TypeMeditation]": { [index in TypeMeditation]: string[] };
  "[CountDay_ParameterMeditation]": {
    [index in CountDay_ParameterMeditation]: string;
  };
  "[Time_ParameterMeditation]": { [index in Time_ParameterMeditation]: string };
  "[DocumentName]": { userAgreement: string; privacyPolicy: string };
  "[TypeMeditationDescription]": {
    [index in TypeMeditation]: { [key in "small" | "full"]: string };
  };
  "[BackgroundMusicName]": {
    [key in BackgroundMusic]: string;
  };
  [index: string]: TextRowTranslate;
}

export type LibraryTranslates = {
  [index in languageCode]?: Translates;
};

export interface TranslateOption {
  count?: number;
  paste?: string;
  composite?: { compositeIndex?: number; composite: boolean };
  indexName?: string;
}

type callback = (returnData: { language: LanguageApp }) => void;

interface initOptions {
  defaultLanguage?: LanguageApp;
  callback?: callback;
}

export type CodeCountryISOType =
  | "AU"
  | "AT"
  | "AZ"
  | "AL"
  | "DZ"
  | "AO"
  | "AD"
  | "AG"
  | "AR"
  | "AM"
  | "AF"
  | "BS"
  | "BD"
  | "BB"
  | "BH"
  | "BZ"
  | "BY"
  | "BE"
  | "BJ"
  | "BG"
  | "BO"
  | "BA"
  | "BW"
  | "BR"
  | "BN"
  | "BF"
  | "BI"
  | "BT"
  | "VU"
  | "VA"
  | "GB"
  | "HU"
  | "VE"
  | "TL"
  | "VN"
  | "GA"
  | "HT"
  | "GY"
  | "GM"
  | "GH"
  | "GT"
  | "GN"
  | "GW"
  | "DE"
  | "HN"
  | "PS"
  | "GD"
  | "GR"
  | "GE"
  | "DK"
  | "DJ"
  | "DM"
  | "DO"
  | "CD"
  | "EG"
  | "ZM"
  | "ZW"
  | "IL"
  | "IN"
  | "ID"
  | "JO"
  | "IQ"
  | "IR"
  | "IE"
  | "IS"
  | "ES"
  | "IT"
  | "YE"
  | "CV"
  | "KZ"
  | "KH"
  | "CM"
  | "CA"
  | "QA"
  | "KE"
  | "CY"
  | "KG"
  | "KI"
  | "CN"
  | "KP"
  | "CO"
  | "KM"
  | "CR"
  | "CI"
  | "CU"
  | "KW"
  | "LA"
  | "LV"
  | "LS"
  | "LR"
  | "LB"
  | "LY"
  | "LT"
  | "LI"
  | "LU"
  | "MU"
  | "MR"
  | "MG"
  | "MW"
  | "MY"
  | "ML"
  | "MV"
  | "MT"
  | "MA"
  | "MH"
  | "MX"
  | "MZ"
  | "MD"
  | "MC"
  | "MN"
  | "MM"
  | "NA"
  | "NR"
  | "NP"
  | "NE"
  | "NG"
  | "NL"
  | "NI"
  | "NZ"
  | "NO"
  | "AE"
  | "OM"
  | "PK"
  | "PW"
  | "PA"
  | "PG"
  | "PY"
  | "PE"
  | "PL"
  | "PT"
  | "CG"
  | "KR"
  | "RU"
  | "RW"
  | "RO"
  | "SV"
  | "WS"
  | "SM"
  | "ST"
  | "SA"
  | "MK"
  | "SC"
  | "SN"
  | "VC"
  | "KN"
  | "LC"
  | "RS"
  | "SG"
  | "SY"
  | "SK"
  | "SI"
  | "SB"
  | "SO"
  | "SD"
  | "SR"
  | "US"
  | "SL"
  | "TJ"
  | "TH"
  | "TZ"
  | "TG"
  | "TO"
  | "TT"
  | "TV"
  | "TN"
  | "TM"
  | "TR"
  | "UG"
  | "UZ"
  | "UA"
  | "UY"
  | "FM"
  | "FJ"
  | "PH"
  | "FI"
  | "FR"
  | "HR"
  | "CF"
  | "TD"
  | "ME"
  | "CZ"
  | "CL"
  | "CH"
  | "SE"
  | "LK"
  | "EC"
  | "GQ"
  | "ER"
  | "SZ"
  | "EE"
  | "ET"
  | "ZA"
  | "OS"
  | "SS"
  | "JM"
  | "JP";

export const CodeCountryISO: CodeCountryISOType[] = [
  "AU",
  "AT",
  "AZ",
  "AL",
  "DZ",
  "AO",
  "AD",
  "AG",
  "AR",
  "AM",
  "AF",
  "BS",
  "BD",
  "BB",
  "BH",
  "BZ",
  "BY",
  "BE",
  "BJ",
  "BG",
  "BO",
  "BA",
  "BW",
  "BR",
  "BN",
  "BF",
  "BI",
  "BT",
  "VU",
  "VA",
  "GB",
  "HU",
  "VE",
  "TL",
  "VN",
  "GA",
  "HT",
  "GY",
  "GM",
  "GH",
  "GT",
  "GN",
  "GW",
  "DE",
  "HN",
  "PS",
  "GD",
  "GR",
  "GE",
  "DK",
  "DJ",
  "DM",
  "DO",
  "CD",
  "EG",
  "ZM",
  "ZW",
  "IL",
  "IN",
  "ID",
  "JO",
  "IQ",
  "IR",
  "IE",
  "IS",
  "ES",
  "IT",
  "YE",
  "CV",
  "KZ",
  "KH",
  "CM",
  "CA",
  "QA",
  "KE",
  "CY",
  "KG",
  "KI",
  "CN",
  "KP",
  "CO",
  "KM",
  "CR",
  "CI",
  "CU",
  "KW",
  "LA",
  "LV",
  "LS",
  "LR",
  "LB",
  "LY",
  "LT",
  "LI",
  "LU",
  "MU",
  "MR",
  "MG",
  "MW",
  "MY",
  "ML",
  "MV",
  "MT",
  "MA",
  "MH",
  "MX",
  "MZ",
  "MD",
  "MC",
  "MN",
  "MM",
  "NA",
  "NR",
  "NP",
  "NE",
  "NG",
  "NL",
  "NI",
  "NZ",
  "NO",
  "AE",
  "OM",
  "PK",
  "PW",
  "PA",
  "PG",
  "PY",
  "PE",
  "PL",
  "PT",
  "CG",
  "KR",
  "RU",
  "RW",
  "RO",
  "SV",
  "WS",
  "SM",
  "ST",
  "SA",
  "MK",
  "SC",
  "SN",
  "VC",
  "KN",
  "LC",
  "RS",
  "SG",
  "SY",
  "SK",
  "SI",
  "SB",
  "SO",
  "SD",
  "SR",
  "US",
  "SL",
  "TJ",
  "TH",
  "TZ",
  "TG",
  "TO",
  "TT",
  "TV",
  "TN",
  "TM",
  "TR",
  "UG",
  "UZ",
  "UA",
  "UY",
  "FM",
  "FJ",
  "PH",
  "FI",
  "FR",
  "HR",
  "CF",
  "TD",
  "ME",
  "CZ",
  "CL",
  "CH",
  "SE",
  "LK",
  "EC",
  "GQ",
  "ER",
  "SZ",
  "EE",
  "ET",
  "ZA",
  "OS",
  "SS",
  "JM",
  "JP",
];
