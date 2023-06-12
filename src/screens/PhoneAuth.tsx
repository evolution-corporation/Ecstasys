import React, { useState } from "react";
import {  } from "react-native";

import { Box, Flex, Text, TextInput } from "@react-native-material/core";
import { AuthScreenProperties } from "~types";
import { Masks, useMaskedInputProps } from 'react-native-mask-input';



const PhoneAuth: AuthScreenProperties<"PhoneAuth"> = ({ navigation }) => {
    const [phone, setPhone] = useState<string>("")

    const maskedInputPhoneProperty = useMaskedInputProps({
        value: phone,
        onChangeText: setPhone,
        mask: (text) => {
            return [
                "7", "(", /\d/, /\d/, /\d/, ")", /\d/, /\d/, /\d/, "-", /\d/, /\d/, "-", /\d/, /\d/
            ]
        },
    })

    const maskedInputCodeProperty = useMaskedInputProps({
        value: phone,
        onChangeText: setPhone,
        mask: (text) => {
            return [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
        },
    })

    return (
        <Flex 
            style={{ 
                backgroundColor: "#FFF"
            }}
            fill
            ph={20}
        >
            <TextInput 
                label="Номер телефона"
                {...maskedInputPhoneProperty}
            />
            <TextInput 
                label="SMS код"
                {...maskedInputCodeProperty}
            />
        </Flex>
    )
}


export default PhoneAuth