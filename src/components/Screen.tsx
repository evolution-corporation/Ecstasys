import React, {
  Component,
  ComponentProps,
  ComponentRef,
  FC,
  FunctionComponent,
  RefObject,
} from "react";
import {
  StyleSheet,
  ViewProps,
  Animated,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import Icon, { IconName } from "~assets/icons";
import { colors, styleText } from "~styles";

export default function createScreen<WrapperProps>(
  ComponentWrapper: FunctionComponent<WrapperProps>
) {
  class Screen extends Component<Props & WrapperProps, State> {
    // private static _nameScreen: string = "--Name not found--";
    // public static setDisplayName(name: string) {
    //   this._nameScreen = name;
    // }

    // public static get displayName(): string {
    //   return `Screen: ${this._nameScreen}`;
    // }

    constructor(props: Props & WrapperProps) {
      super(props);
      // if (props.name) {
      //   Screen.setDisplayName(props.name);
      // }
      const screenWidth = Dimensions.get("screen").width;
      this.state = {
        animationContent: new Animated.Value(props.isAnimation ? 0 : 1),
        animationPage: new Animated.Value(props.isAnimation ? screenWidth : 0),
        children: props.children,
        nextUpdateWithAnimation: true,
        isActivate: false,
        screenWidth: screenWidth,
      };
    }

    render() {
      return (
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            transform: [{ translateX: this.state.animationPage }],
          }}
        >
          <ComponentWrapper {...this.props}>
            {this.props.header && <HeaderScreen {...this.props.header} />}
            <Animated.View
              {...this.props}
              style={[
                styles.background,
                this.props.style,
                { opacity: this.state.animationContent },
              ]}
            >
              {this.state.children}
            </Animated.View>
          </ComponentWrapper>
        </Animated.View>
      );
    }

    public setNextContentUpdateWithAnimation() {
      this.setState({ nextUpdateWithAnimation: true });
    }

    componentDidMount() {
      this.setState({ isActivate: true });

      //this.openPage(true);
    }

    componentDidUpdate() {
      if (this.props.children != this.state.children) {
        if (this.props.isAnimation && this.state.nextUpdateWithAnimation) {
          this.hideChildren();
        } else {
          this.setState({ children: this.props.children });
        }
      }
    }

    componentWillUnmount() {
      //this.closePage(true);
      this.setState({ isActivate: false });
    }

    private showChildren() {
      if (this.state.isActivate) {
        this.setState({
          children: this.props.children,
          nextUpdateWithAnimation: false,
        });
        Animated.timing(this.state.animationContent, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }
    }

    private hideChildren() {
      if (this.state.isActivate) {
        Animated.timing(this.state.animationContent, {
          toValue: 0,
          useNativeDriver: true,
        }).start(() => this.showChildren());
      }
    }

    public openPage(showChildren?: boolean, callback?: () => void) {
      Animated.timing(this.state.animationPage, {
        toValue: 0,
        useNativeDriver: true,
      }).start(() => {
        if (showChildren && this.state.isActivate) {
          this.showChildren();
        }
      });
    }

    public closePage(hideChildren?: boolean, callback?: () => void) {
      Animated.timing(this.state.animationPage, {
        toValue: this.state.screenWidth,
        useNativeDriver: true,
      }).start(() => {
        if (hideChildren && this.state.isActivate) {
          this.hideChildren();
        }
        if (callback) {
          callback();
        }
      });
    }
  }
  return Screen;
}

export interface ScreenRef {
  openPage: (showChildren?: boolean, callback?: () => void) => void;
  closePage: (hideChildren?: boolean, callback?: () => void) => void;
}

interface Props extends ViewProps {
  name?: string;
  isAnimation?: boolean;
  header?: ComponentProps<typeof HeaderScreen>;
  wrapper?: (content: React.ReactNode) => React.ReactNode;
  zIndex: number;
}

interface State {
  animationContent: Animated.Value;
  animationPage: Animated.Value;
  children: any;
  nextUpdateWithAnimation: boolean;
  isActivate: boolean;
  screenWidth: number;
}

export const HeaderScreen: FC<HeaderProps> = (props) => {
  let icon = null;
  if (
    typeof props.leftIcon == "string" ||
    typeof props.leftIcon == "undefined"
  ) {
    icon = <Icon name={props.leftIcon ?? "TheArrow"} />;
  } else if (typeof props.leftIcon == "object" && props.leftIcon) {
    icon = <Icon {...props.leftIcon} />;
  }
  return (
    <View style={styles.header} key={"Header"}>
      <TouchableOpacity
        style={styles.leftIcon}
        onPress={props.leftAction}
        hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
      >
        {icon}
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{props.title}</Text>
    </View>
  );
};

interface HeaderProps {
  leftIcon?: IconName | ComponentProps<typeof Icon> | null;
  leftAction?: () => void;
  title?: string;
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  header: {
    width: "100%",
    height: 50,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  headerTitle: {
    color: colors.white,
    ...styleText.h1,
  },
  leftIcon: {
    position: "absolute",
    left: 20,
  },
  baseWrapper: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
