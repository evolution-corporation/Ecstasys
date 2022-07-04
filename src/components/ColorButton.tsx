import React, {
  FC,
  useCallback,
  useMemo,
  useState,
  useImperativeHandle,
  forwardRef,
  ComponentRef,
  RefObject,
  createRef,
  Component,
  FunctionComponent,
} from "react";
import {
  ColorValue,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import Icon, { IconName } from "~assets/icons";
import style, { colors } from "~styles";

const ColorButton = forwardRef<Ref, Props>((props, ref) => {
  const {
    styleButton,
    type,
    icon,
    isSwitch,
    onPress,
    styleText,
    text,
    iconPosition = "left",
  } = props;
  const [isSelected, setIsSelected] = useState<boolean>(
    props.isSwitch ? props.initValue ?? false : false
  );
  const action = useCallback(
    (value?: boolean) => {
      if (onPress) {
        if (isSwitch) {
          onPress(!isSelected);
          setIsSelected(!isSelected);
        } else {
          onPress();
        }
      }
    },
    [isSwitch, isSelected]
  );

  const color = useMemo(() => {
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

  useImperativeHandle(ref, () => ({
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
  textColorSelected?: ColorValue;
  buttonColorSelected?: ColorValue;
  onPress?: (value: boolean) => void;
  initValue?: boolean;
}

const ShowButton: FC<ButtonParameters> = (props) => {
  const [size, setSize] = useState<{ height: number; width: number }>({
    height: 0,
    width: 0,
  });
  return (
    <TouchableOpacity
      style={[
        styles.backgroundButton,
        props.type == "fullWidth" ? styles.fullWidthType : styles.smallType,
        props.styleButton,
        {
          backgroundColor: props.colorButton,
          flexDirection: props.iconPosition == "top" ? "column" : "row",
        },
      ]}
      onPress={props.onPress}
      onLayout={({ nativeEvent: { layout } }) =>
        setSize({ width: layout.width, height: layout.height })
      }
    >
      {!!props.icon && (size.width >= 300 || props.iconPosition == "top") && (
        <Icon
          name={props.icon}
          style={[
            styles.icon,
            props.iconPosition == "left"
              ? { position: "absolute", left: 10 }
              : {},
          ]}
        />
      )}
      <Text
        style={[styles.textButton, props.styleText, { color: props.colorText }]}
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  );
};

interface ButtonParameters extends General {
  onPress: () => void;
  colorText: ColorValue;
  colorButton: ColorValue;
}

interface General {
  text?: string;
  styleText?: TextStyle | TextStyle[];
  styleButton?: ViewStyle | ViewStyle[];
  type: "fullWidth" | "small";
  icon?: IconName;
  iconPosition?: "top" | "left";
}

const styles = StyleSheet.create({
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

export const TextButton: FC<TextButton> = (props) => {
  const { styleText, onPress, text } = props;

  return (
    <Pressable hitSlop={10} onPress={onPress}>
      <Text style={[styles.textLink, styleText]}>{text}</Text>
    </Pressable>
  );
};

interface TextButton {
  text?: string;
  styleText?: TextStyle | TextStyle[];
  onPress: () => void;
}

export default ColorButton;

interface Ref {
  select: () => void;
  noSelect: () => void;
}

export type ColorButtonRef = Ref;

export function createListSelectedUnique<WrapperProps>(
  ComponentWrapper: FunctionComponent<WrapperProps>,
  values: any[],
  ComponentProps: (item: any, index?: number) => WrapperProps
) {
  class SelectedList extends Component<SelectedProps, SelectedState> {
    private refElements: RefObject<ColorButtonRef>[] = [];
    constructor(props: SelectedProps) {
      super(props);
      for (let i = 0; i < values.length; i++) {
        this.refElements.push(createRef());
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
              initValue={this.props.initValue == index}
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
      this.props.onChange(index);
    }
  }
  return SelectedList;
}

interface SelectedProps {
  onChange: (data: any) => void;
  initValue?: number;
  ref?: RefObject<ColorButtonRef>;
}

interface SelectedState {
  selectedIndex?: number;
}
