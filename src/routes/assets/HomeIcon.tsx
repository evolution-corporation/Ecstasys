import * as React from "react";
import { ColorValue } from "react-native";
import Svg, { SvgProps, Path } from "react-native-svg";

const HomeIcon = (props: IconProps) => {
  const { colorIcon } = props;
  return (
    <Svg width={18} height={19} fill="none" {...props}>
      <Path
        d="m16.659 7.375-7-6.125a1 1 0 0 0-1.318 0l-7 6.125A1 1 0 0 0 1 8.127V17a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V8.127a1 1 0 0 0-.341-.752Z"
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

export default HomeIcon;
