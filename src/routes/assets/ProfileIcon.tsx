import * as React from "react";
import { ColorValue } from "react-native";
import Svg, { SvgProps, Path } from "react-native-svg";

const ProfileIcon = (props: IconProps) => {
  const { colorIcon } = props;
  return (
    <Svg width={24} height={24} fill="none" {...props}>
      <Path
        d="M4 21c0-2.761 3.582-5 8-5s8 2.239 8 5M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
        stroke={colorIcon}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export interface IconProps extends SvgProps {
  colorIcon: ColorValue;
}

export default ProfileIcon;
