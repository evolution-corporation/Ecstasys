import { Platform } from "expo-modules-core";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  TextLayoutLine,
} from "react-native";

const TextAdjustsFontSizeToFit: FC<TextAdjustsFontSizeToFitProps> = (props) => {
  if (Platform.OS === "android") {
    const { style, fontSize } = props;

    const [size, setSize] = useState<{
      width: number;
      heigth: number;
    } | null>(null);
    const [_fontSize, setFontSize] = useState(0);

    const editFontSize = (width: number, heigth: number) => {
      if (size !== null) {
        let scale = 1;

        const scaleWidth = size.width / width;
        const scaleHeigth = size.heigth / heigth;
        console.log(scaleWidth, scaleHeigth);
        if (scaleWidth < 1 || scaleHeigth < 1) {
          if (scaleWidth < scaleHeigth) {
            scale = scaleWidth;
          } else {
            scale = scaleHeigth;
          }
          scale /= 1.4;
        }

        console.log(`scale=${scale}, fontSize=${[fontSize * scale, fontSize]}`);
        setFontSize(scale * fontSize);
      }
    };

    return (
      <>
        <Text
          {...props}
          onLayout={({ nativeEvent: { layout } }) => {
            if (size === null) {
              setSize({ heigth: layout.height, width: layout.width });
            }
          }}
          style={[
            style,
            { position: "absolute", opacity: 0, width: "100%", height: "100%" },
          ]}
        />
        {size && (
          <Text
            {...props}
            style={[
              style,
              { fontSize: _fontSize, width: "auto", height: "auto" },
            ]}
            // onTextLayout={({ nativeEvent: { lines } }) => {
            //   let heigth =
            //     lines[lines.length - 1].y + lines[lines.length - 1].height;
            //   let width = 0;
            //   for (let line of lines) {
            //     if (width <= line.width) width = line.width;
            //   }
            //   console.log(width, heigth, fontSize);
            //   editFontSize(width, heigth);
            // }}
            onLayout={({ nativeEvent: { layout } }) => {
              editFontSize(layout.width, layout.height);
            }}
          />
        )}
      </>
    );
  } else {
    return <Text {...props} adjustsFontSizeToFit />;
  }
};

export interface TextAdjustsFontSizeToFitProps extends TextProps {
  fontSize: number;
}

export default TextAdjustsFontSizeToFit;

const styles = StyleSheet.create({});
