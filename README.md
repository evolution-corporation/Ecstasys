# ecstasys

## Установка
### Требования
\* - обязательны к установке
#### Программные платформы
- \* [Node.js ~16.16.0](https://nodejs.org/en/)
- [Evolution server](https://github.com/evolution-corporation/EvolutionServer "Необходимо изменить в /src/api/config.ts адрес на внутренний IP адрес машины и порт указаный, который прослушивает Evolution server")
- [Flipper] (https://fbflipper.com/docs/getting-started/ "Возможно придется скачивать через VPN")
#### Для Android
- \* [Java 18](https://www.oracle.com/java/technologies/javase/jdk18-archive-downloads.html)
- *[Android Studio](https://developer.android.com/studio/)
  > -Android SDK Platform 31
  > -Intel x86 Atom_64 System Image или Google APIs Intel x86 Atom System Image
 Более подробная инструкция находится [React-Native](https://reactnative.dev/docs/environment-setup)
 
#### Глобальные NPM пакеты
- \* [expo-cli ~5.4.12](https://docs.expo.dev/workflow/expo-cli/)
- \* [typescript ~4.7.4](https://www.typescriptlang.org/docs/)
- [eas-cli ~0.52.0] (https://docs.expo.dev/build/setup/)
- [yarn ~1.22.18](https://yarnpkg.com/getting-started/install)
- [prettier ~2.7.1](https://prettier.io/)

### Установка
1. Клонировать проект.
2. Перейти в папку с проектов
3. Установить локальные пакеты
  >При использование npm
  >> npm install
  >
  >При использовании yarn
  >> yarn install
  >
4. Необходимо удостоверится, что адрес расположенный в /src/api/config.ts/HOST_URL успешно обрабатывает запросы. При необходимости изменить адрес на рабочий
5. Если приложение установленно и имеет последнюю dev-версию, пропустить этот шаг.
* Для Android: 
 - Скачать и установить последнюю dev версию приложения на физическое устройсво или эмулятор
 - Запустить в папке с проектом:
  > EAS-cli установлен:
  >> expo eas build --platform android --profile development --local
  >
  > EAS-cli не установлен
  >> expo run:android
  >
6. Запустите Expo Server:
  > expo start --dev-client
7. Дождаться конца загрузки Expo Servera
8. Открыть приложение и загрузиться с нужного адреса

Ecstasys - кроссплатформенное приложение для прослушивание и изучение техник медитация от Владимера Козлова. 

