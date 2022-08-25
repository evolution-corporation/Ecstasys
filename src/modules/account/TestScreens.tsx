import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Button,
  Image,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import {
  useAccountContext,
  useTimerSMSRequestContext,
} from "~modules/account/AccountContext";

const AccountAuthentication = () => {
  const { func } = useAccountContext();
  const { timeLeft } = useTimerSMSRequestContext();
  const [phone, setPhone] = useState<string>("");
  const [inputSMSCode, setInputSMSCode] = useState<boolean>(false);
  return (
    // @ts-ignore
    <View style={styles.background}>
      {/*@ts-ignore*/}
      <Text> Авторизация по номеру телефона </Text>
      {/*@ts-ignore*/}
      <TextInput
        value={phone}
        onChangeText={(text) => {
          setPhone(text);
          setInputSMSCode(false);
        }}
        placeholder={"Номер телефона:"}
        style={styles.textInput}
      />
      {inputSMSCode ? (
        <>
          {/*@ts-ignore*/}
          <TextInput
            placeholder={"SMS код:"}
            onChangeText={(text) => {
              if (text.length == 6) {
                func.checkSMSCode(text).catch(console.error);
              }
            }}
            style={styles.textInput}
          />
          {timeLeft === null ? (
            // @ts-ignore
            <Button
              title={"Повторно получить выслать код"}
              onPress={() => {
                func.requestSMSCode().catch(console.error);
              }}
            />
          ) : (
            // @ts-ignore
            <Text>{timeLeft}</Text>
          )}
        </>
      ) : (
        //@ts-ignore
        <Button
          title={"Получить SMS код для авторизации"}
          onPress={() => {
            func.authenticationWithPhone(phone).catch(console.error);
            setInputSMSCode(true);
          }}
        />
      )}
    </View>
  );
};

const AccountRegistration = () => {
  const { func } = useAccountContext();
  const [nickname, setNickname] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const imageBase64 = useRef<string>();
  const [birthday, setBirthday] = useState<Date>(new Date());
  const [isShowDateTimePicker, setIsShowDateTimePicker] =
    useState<boolean>(false);
  const [statusPermission, requestPermission] =
    ImagePicker.useMediaLibraryPermissions();

  const selectImage = useCallback(async () => {
    if (!statusPermission?.granted) {
      let permission = await requestPermission();
      while (!permission.granted && permission.canAskAgain) {
        permission = await requestPermission();
      }
      if (!permission.canAskAgain || !permission.granted) {
        return;
      }
    }
    const image = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!image.cancelled && !!image.base64) {
      setImage(image.uri);
      imageBase64.current = image.base64;
      func.editUserData({ image: image.base64 }).catch(console.error);
    }
  }, [setImage]);

  const selectBirthday = useCallback(async () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: birthday,
        onChange: (_, selectDate) => {
          if (!!selectDate) {
            setBirthday(new Date(selectDate));
            func
              .editUserData({ birthday: new Date(selectDate) })
              .catch(console.error);
          }
        },
      });
    } else {
      setIsShowDateTimePicker(true);
    }
  }, [setBirthday]);

  return (
    // @ts-ignore
    <View style={styles.background}>
      {/* @ts-ignore */}
      <Text> Авторизация по номеру телефона </Text>
      {/* @ts-ignore */}
      <TextInput
        value={nickname}
        onChangeText={(text) => {
          setNickname(text);
          func.editUserData({ nickName: text }).catch(console.error);
        }}
        placeholder={"Никнейм:"}
        style={styles.textInput}
      />
      {/* @ts-ignore */}
      {image && <Image source={{ uri: image }} style={styles.avatar} />}
      {/* @ts-ignore */}

      <Button
        title={"Выбрать изображение пользователя"}
        onPress={() => selectImage()}
      />
      {/* @ts-ignore */}
      <Button
        title={"Выберите дату рождения"}
        onPress={() => selectBirthday()}
      />
      {isShowDateTimePicker && (
        <DateTimePicker
          value={birthday}
          mode={"date"}
          onChange={(_, date) => {
            if (!!date) setBirthday(date);
            setIsShowDateTimePicker(false);
          }}
        />
      )}
      {/* @ts-ignore */}
      <Button title={"Зарегестрироваться"} onPress={func.registration} />
    </View>
  );
};
const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  textInput: {
    borderColor: "#000000",
    borderWidth: 2,
    width: "100%",
  },
  avatar: {
    width: 200,
    height: 200,
  },
});

export { AccountAuthentication, AccountRegistration };
