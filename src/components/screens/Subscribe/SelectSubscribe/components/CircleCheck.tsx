import React, { useEffect } from "react";
import { ColorValue, ViewProps } from "react-native";
import Animated from "react-native-reanimated";
import Svg, { SvgProps, Path } from "react-native-svg";

const CircleCheck = (props: CircleCheckProps) => {
  const { isSelected, colorItem = "#FFFFFF", style } = props;
  return (
    <Animated.View {...props} style={[style]}>
      <Svg width={31} height={31} fill="none">
        <Path
          d="M13 27a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
          stroke={colorItem}
          strokeWidth={2}
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {isSelected ? (
          <Path
            d="m7.75 15.5 5.48 5.48 10.96-10.96"
            stroke={colorItem}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}
      </Svg>
    </Animated.View>
  );
};

interface CircleCheckProps extends ViewProps {
  isSelected: boolean;
  colorItem?: ColorValue;
}

export default CircleCheck;
