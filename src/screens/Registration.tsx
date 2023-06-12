import React, { FC } from "react"
import { RegistrationScreenProperties } from "~types"

import { Flex } from "@react-native-material/core"


const Registration: RegistrationScreenProperties<"Registration"> = ({ route }) => {
    const { avatar, name, nickname } = route.params
    return (
        <Flex />
    )
}


export default Registration