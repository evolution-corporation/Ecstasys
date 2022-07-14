import React, { useMemo } from "react";
import * as reactNative from "react-native";
import Icon, { IconName } from "~assets/icons";
import style, { colors } from "~styles";

const ColorButton = React.forwardRef<Ref, Props>((props, ref) => {
  const {
    styleButton,
    type,
    icon,
    isSwitch,
    onPress,
    styleText,
    text,
    iconPosition = "left",
    iconStyle,
  } = props;
  const [isSelected, setIsSelected] = React.useState<boolean>(
    props.isSwitch ? props.initValue ?? false : false
  );
  const action = React.useCallback(() => {
    if (onPress) {
      if (isSwitch) {
        onPress(!isSelected);
        setIsSelected(!isSelected);
      } else {
        onPress();
      }
    }
  }, [isSwitch, isSelected]);

  const color = React.useMemo(() => {
    if (isSelected && isSwitch) {
      return {
        text: props.textColorSelected ?? colors.white,
        background: props.buttonColorSelected ?? colors.StrokePanel,
      };
    } else {
      return {
        text:
          (Array.isArray(styleText)
            ? styleText[styleText.length - 1]?.color
            : styleText?.color) ?? styles.textButton.color,
        background:
          (Array.isArray(styleButton)
            ? styleButton[styleButton.length - 1]?.backgroundColor
            : styleButton?.backgroundColor) ??
          styles.backgroundButton.backgroundColor,
      };
    }
  }, [isSelected]);

  const noSelect = () => setIsSelected(false);
  const select = () => setIsSelected(true);

  React.useImperativeHandle(ref, () => ({
    select,
    noSelect,
  }));

  return (
    <ShowButton
      onPress={action}
      type={type}
      text={text}
      icon={icon}
      styleText={styleText}
      styleButton={styleButton}
      colorText={color.text}
      colorButton={color.background}
      iconPosition={iconPosition}
      iconStyle={iconStyle}
    />
  );
});

type Props = General & (SimpleButton | Switch);

interface SimpleButton {
  isSwitch?: false;
  onPress?: () => void;
}

interface Switch {
  isSwitch: true;
  textColorSelected?: reactNative.ColorValue;
  buttonColorSelected?: reactNative.ColorValue;
  onPress?: (value: boolean) => void;
  initValue?: boolean;
}

const ShowButton: React.FC<ButtonParameters> = (props) => {
  const {
    colorButton,
    colorText,
    onPress,
    type,
    icon,
    iconPosition,
    styleButton,
    styleText,
    text,
    iconStyle,
  } = props;
  const [size, setSize] = React.useState<{ height: number; width: number }>({
    height: 0,
    width: 0,
  });

  const iconView = useMemo(() => {
    if (!!icon) {
      if (
        iconPosition == "top" ||
        (size.width >= 300 && iconPosition == "left")
      ) {
        if (typeof icon == "string") {
          return (
            <Icon
              name={icon}
              style={[
                styles.icon,
                iconPosition == "left"
                  ? { position: "absolute", left: 10 }
                  : {},
              ]}
            />
          );
        } else {
          return (
            <reactNative.Image
              source={icon}
              style={[
                styles.icon,
                iconStyle,
                iconPosition == "left"
                  ? { position: "absolute", left: 10 }
                  : {},
              ]}
              resizeMethod={"resize"}
              resizeMode={"contain"}
            />
          );
        }
      }
    }
    return null;
  }, [icon, iconPosition, iconStyle, size.width]);

  return (
    <reactNative.TouchableOpacity
      style={[
        styles.backgroundButton,
        type == "fullWidth" ? styles.fullWidthType : styles.smallType,
        styleButton,
        {
          backgroundColor: colorButton,
          flexDirection: iconPosition == "top" ? "column" : "row",
        },
      ]}
      onPress={onPress}
      onLayout={({ nativeEvent: { layout } }) =>
        setSize({ width: layout.width, height: layout.height })
      }
    >
      {iconView}
      <reactNative.Text
        adjustsFontSizeToFit={true}
        style={[styles.textButton, styleText, { color: colorText }]}
      >
        {text}
      </reactNative.Text>
    </reactNative.TouchableOpacity>
  );
};

interface ButtonParameters extends General {
  onPress: () => void;
  colorText: reactNative.ColorValue;
  colorButton: reactNative.ColorValue;
}

interface General {
  text?: string;
  styleText?: reactNative.TextStyle | reactNative.TextStyle[];
  styleButton?: reactNative.ViewStyle | reactNative.ViewStyle[];
  type: "fullWidth" | "small";
  icon?: IconName | reactNative.ImageSourcePropType;
  iconStyle?: reactNative.ImageStyle;
  iconPosition?: "top" | "left";
}

const styles = reactNative.StyleSheet.create({
  backgroundButton: {
    backgroundColor: colors.white,
    borderRadius: 100,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    color: colors.DarkLetters,
    fontSize: 14,
    ...style.getFontOption("500"),
  },
  textLink: {
    color: colors.TextOnTheBackground,
    fontSize: 13,
    ...style.getFontOption("500"),
    textAlignVertical: "center",
    textAlign: "center",
  },
  fullWidthType: {
    width: "100%",
  },
  smallType: {
    paddingHorizontal: 15,
  },
  icon: {
    width: "100%",
    alignSelf: "center",
  },
});

export const TextButton: React.FC<TextButton> = (props) => {
  const { styleText, onPress, text } = props;

  return (
    <reactNative.Pressable hitSlop={10} onPress={onPress}>
      <reactNative.Text
        style={[styles.textLink, styleText]}
        adjustsFontSizeToFit
      >
        {text}
      </reactNative.Text>
    </reactNative.Pressable>
  );
};

interface TextButton {
  text?: string;
  styleText?: reactNative.TextStyle | reactNative.TextStyle[];
  onPress: () => void;
}

export default ColorButton;

interface Ref {
  select: () => void;
  noSelect: () => void;
}

export type ColorButtonRef = Ref;

export function createListSelectedUnique<WrapperProps>(
  ComponentWrapper: React.FunctionComponent<WrapperProps>,
  values: [any, any][],
  ComponentProps: (item: any, index?: number) => WrapperProps
) {
  class SelectedList extends React.Component<SelectedProps, SelectedState> {
    private refElements: React.RefObject<ColorButtonRef>[] = [];
    constructor(props: SelectedProps) {
      super(props);
      for (let i = 0; i < values.length; i++) {
        this.refElements.push(React.createRef());
      }
      this.state = {
        selectedIndex: props.initValue,
      };
    }

    render() {
      return (
        <>
          {values.map((item, index) => (
            <ComponentWrapper
              {...ComponentProps(item, index)}
              ref={this.refElements[index]}
              initValue={this.props.initValue == item[0]}
              onChange={() => this.selectItem(index)}
              key={index.toString()}
            />
          ))}
        </>
      );
    }

    private selectItem(index: number) {
      this.refElements.forEach((elementRef) => elementRef.current?.noSelect());
      this.refElements[index].current?.select();
      this.props.onChange(values[index][0]);
    }
  }
  return SelectedList;
}

interface SelectedProps {
  onChange: (data: any) => void;
  initValue?: number | string;
  ref?: React.RefObject<ColorButtonRef>;
}

interface SelectedState {
  selectedIndex?: any;
}
