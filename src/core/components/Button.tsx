import React, { FC } from "react"
import { 
    Button as ButtonMaterial, 
    ButtonProps as ButtonMaterialProperties 
} from "@react-native-material/core";

type IButtonProperties = ButtonMaterialProperties

const Button: FC<IButtonProperties> = ({ ...property }) => {
    return <ButtonMaterial {...property}/>
}

export default Button