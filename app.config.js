const IS_DEV = process.env.APP_VARIANT === 'development';


export default {
  expo: {
    jsEngine: "hermes",
    name: `DMD Meditation${IS_DEV ? ' dev' : ''}`,
    slug: "dmd_meditation",
    version: "0.0.14",
    orientation: "portrait",
    githubUrl: "https://github.com/HardKot/ecstasys",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#FFFFFF"
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/65b7d342-ce66-4baa-9507-071987162a44"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColo: "#FFFFFF"
      },
      icon: "./assets/icon.png",
      package: `com.ecorp.dmd_meditation${IS_DEV ? '_dev' : ''}`,
      googleServicesFile: `./google-services.json`,
      permissions: ["android.permission.RECORD_AUDIO"]
    },
    plugins: [
      "expo-dev-client",
      "expo-splash-screen",
      "expo-image-picker",
      "@react-native-firebase/app",
      "expo-av",
      "expo-updates",
    ],
    extra: {
      eas: {
        projectId: "65b7d342-ce66-4baa-9507-071987162a44"
      },
      isDebug: IS_DEV
    },
    runtimeVersion: {
      policy: "sdkVersion"
    },
  }
}
