import * as React from "react";
import { ColorValue } from "react-native";
import Svg, { SvgProps, Path, Circle } from "react-native-svg";

const PracticesIcon = (props: IconProps) => {
  const { colorIcon } = props;
  return (
    <Svg width={24} height={24} fill="none" {...props}>
      <Path
        d="M3 14c6.64-.356 3.836-4 9-4s2.36 3.644 9 4"
        stroke={colorIcon}
        strokeWidth={2}
        strokeMiterlimit={22.93}
        strokeLinecap="round"
      />
      <Circle cx={11.5} cy={4.5} r={2.5} stroke={colorIcon} strokeWidth={2} />
      <Path
        d="M10.5 15a1 1 0 1 0-2 0h2Zm-1 3.5v1a1 1 0 0 0 1-1h-1Zm0 4.5a1 1 0 1 0 0-2v2Zm-1-8v3.5h2V15h-2Zm1 2.5H4.862v2H9.5v-2Zm-4.638 0c-.871 0-1.608.315-2.123.86A2.748 2.748 0 0 0 2 20.25c0 .668.236 1.359.739 1.89.515.545 1.252.86 2.123.86v-2c-.37 0-.565-.123-.67-.234A.75.75 0 0 1 4 20.25a.75.75 0 0 1 .192-.516c.105-.111.3-.234.67-.234v-2Zm0 5.5H9.5v-2H4.862v2ZM13.5 15a1 1 0 1 1 2 0h-2Zm1 3.5v1a1 1 0 0 1-1-1h1Zm0 4.5a1 1 0 1 1 0-2v2Zm1-8v3.5h-2V15h2Zm-1 2.5h4.638v2H14.5v-2Zm4.638 0c.871 0 1.608.315 2.123.86.503.531.739 1.222.739 1.89 0 .668-.236 1.359-.739 1.89-.515.545-1.252.86-2.123.86v-2c.37 0 .565-.123.67-.234A.75.75 0 0 0 20 20.25a.75.75 0 0 0-.192-.516c-.105-.111-.3-.234-.67-.234v-2Zm0 5.5H14.5v-2h4.638v2Z"
        fill={colorIcon}
      />
    </Svg>
  );
};

export interface IconProps extends SvgProps {
  colorIcon: ColorValue;
}

export default PracticesIcon;
