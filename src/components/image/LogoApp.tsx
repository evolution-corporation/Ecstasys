import React, { useMemo } from "react";
import { ColorValue, ViewProps, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import style from "~styles";

const LogoApp = (props: Props) => {
  const { scale = 1, colorLogo = "#FFFFFF", style } = props;
  const scaleSize = useMemo(() => (scale * 100) / 637, [scale]);
  return (
    <View {...props} style={[style, { transform: [{ scale: scaleSize }] }]}>
      <Svg
        width={637}
        height={698}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M631.965 191.101a73.758 73.758 0 0 0-3.754-32.715 73.84 73.84 0 0 0-17.618-27.833 73.958 73.958 0 0 0-27.979-17.418 74.027 74.027 0 0 0-32.779-3.54 80.7 80.7 0 0 0-24.212 7.046 74.071 74.071 0 0 0-31.826 29.964 73.943 73.943 0 0 0-9.369 42.67 76.757 76.757 0 0 0 18.638 43.493 74.479 74.479 0 0 0 37.39 22.369 74.544 74.544 0 0 0 43.52-2.362 79.828 79.828 0 0 0 11.409-5.306 72.67 72.67 0 0 0 29.787-32.272 82.66 82.66 0 0 0 4.529-11.657 85.575 85.575 0 0 0 2.264-12.352v-.087ZM364.847 413.439c-71.217-37.073-127.936-96.92-161.091-169.976A358.241 358.241 0 0 1 181.95 10.43a8.014 8.014 0 0 1 10.103-5.828C636.233 134.386 460.39 790.44 10.548 681.01a8.197 8.197 0 0 1-5.032-3.825 8.171 8.171 0 0 1-.803-6.266c22.598-76.933 70.343-144.091 135.617-190.759a359.576 359.576 0 0 1 224.517-66.722Z"
          fill={colorLogo}
        />
      </Svg>
    </View>
  );
};
interface Props extends ViewProps {
  scale?: number;

  colorLogo?: ColorValue;
}

export default LogoApp;
