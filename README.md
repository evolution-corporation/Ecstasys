# ecstasys

## Установка

### Требования

\* - обязательны к установке

#### Программные платформы

- \* [Node.js ~16.16.0](https://nodejs.org/en/)
- [Evolution server ветка C#](https://github.com/evolution-corporation/EvolutionServer "Необходимо изменить в /src/api/config.ts адрес на внутренний IP адрес машины и порт указаный, который прослушивает Evolution server")
- [Flipper](https://fbflipper.com/docs/getting-started/ "Возможно придется скачивать через VPN")

#### Для Android

- \* [Java 18](https://www.oracle.com/java/technologies/javase/jdk18-archive-downloads.html)
- \*[Android Studio](https://developer.android.com/studio/)
  > -Android SDK Platform 31
  > -Intel x86 Atom_64 System Image или Google APIs Intel x86 Atom System Image
  > Более подробная инструкция находится [React-Native](https://reactnative.dev/docs/environment-setup)

#### Глобальные NPM пакеты

- \* [expo-cli ~6.0.1](https://docs.expo.dev/workflow/expo-cli/)
- \* [typescript ~4.7.4](https://www.typescriptlang.org/docs/)
- [eas-cli ~0.52.0](https://docs.expo.dev/build/setup/)
- [yarn ~1.22.18](https://yarnpkg.com/getting-started/install)
- [prettier ~2.7.1](https://prettier.io/)

### Установка

1. Клонировать проект.
2. Перейти в папку с проектов
3. Установить локальные пакеты
   > При использовании yarn
   >
   > > yarn install
4. Если приложение установленно и имеет последнюю dev-версию, пропустить этот шаг.
- Скачать с Firebase ключи для доступа. com.evodigital.dmdmeditation. 
    - GoogleService-Info.plist
    - google-services.json
- Для Android:

* Скачать и установить последнюю dev версию приложения на физическое устройство или эмулятор
* Запустить в папке с проектом:
  > EAS-cli установлен:
  >
  > > expo eas build --platform android --profile development --local

6. Запустите Expo Server:
   > expo start --dev-client
7. Дождаться конца загрузки Expo Server
8. Открыть приложение и загрузиться с нужного адреса

dmd meditation - кроссплатформенное приложение для прослушивание и изучение техник медитация от Владимера Козлова.

## Архитектурные особенности

> Все состоит из модулей, которые состоят из модулей.

> Мы едины так как не зависимы друг от друга

- Components/ : содержит в себе React компоненты.

  - Dump: содержит в себе React компоненты, которые не могут иметь children props.
  - Containers: содержит в себе React компоненты, которые работают совместно с children props.
  - element: простые jsx элементы

Screens содержит в себе React экраны-компонент. В качестве props принимают navigation, route.
- i18n: работа с переводами приложения и всем что с этим связанно.

- Core/
  - устарело

- store/
  - Redux элементы, actions и reducers

- api - методы основанные на http запросах, запросах к local storage, запросах к файловому хранилищу

- controllers - НОВОЕ

- models - НОВОЕ Бизнес модели и логика (какая-то часть тут)

- hooks - все кастомные React хуки лежат тут

- backgroundSound, baseMeditation - что-то на подобие стандартных данных, которые хранятся на клиенте 

- routes - список экранов и их настройки


ESlint не до конца настроен так что местами ide подсвечивает ошибки, просто нужно либо настроить eslint, либо же отключить правила

## Полезные команды
Сборка продакшин версии
> eas build --profile production
>
> eas build --profile production

Сборка dev версии (флаг local собрать на локальной машине)
> eas build --profile development
>
> build Dev

Выпуск приложения
> eas submit --platform *название платформы*

или скрипты
#### ВЫПУСКАЮТ ПОСЛЕДНЮЮ ЗАГРУЖЕННУЮ В EXPO СБОРКУ
> submit ios
> submit android


### Версирование 
Версия кода определяется на основание текущей даты времени

Версия приложения(видит пользователь) берется из package.json. 
- Минорную следует обновлять при изменении интерфейсов(не UI)/поведение методов/удаление публичных методов. Или при обновлении минорных/мидл версий пакетов
- Мидл при добавлении нового функционала
- Патч при фиксах/оптимизациях
