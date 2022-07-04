import React, { Component, FC } from "react";
import {
  ImageBackground,
  View,
  Text,
  ViewProps,
  StyleSheet,
} from "react-native";
import createScreen from "~components/Screen";
import Meditation from "~models/Meditation";

export default class PlayerScreen extends Component<Props, State> {
  private isActivate: boolean = false;
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    if (this.state.meditation) {
      return (
        <Background
          image={this.state.meditation.image}
          isAnimation={true}
          ref={this.props.screenControl}
          zIndex={this.props.zIndex}
        >
          <Text>test</Text>
        </Background>
      );
    } else {
      return <View></View>;
    }
  }

  componentDidMount() {
    this.isActivate = true;
  }

  componentWillUnmount() {
    this.isActivate = false;
  }

  public setParams(data: Meditation) {
    if (this.isActivate) {
      this.setState({ meditation: data });
    }
  }
}

interface Props extends ScreenProps {}

interface State {
  meditation?: Meditation;
}

const BackgroundView: FC<{ image: string } & ViewProps> = (props) => {
  return (
    <ImageBackground
      source={{ uri: props.image }}
      style={StyleSheet.absoluteFill}
    >
      {props.children}
    </ImageBackground>
  );
};

const Background = createScreen(BackgroundView);
