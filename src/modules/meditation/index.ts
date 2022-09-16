import React, { FC, useRef } from "react";
import { MeditationContext, useMeditationContext } from "./context";
import * as API from "./api";
import { Meditation as MeditationType } from "./types";
import MeditationModel, { Relax } from "./models";
import * as Hooks from "./hook";
import BackgroundSound, {
  playFragmentMeditationBackground,
} from "./backgroundSound";

const e = React.createElement;

const Meditation: FC<Props> = (props) => {
  const { children, meditation } = props;
  // const meditation = useRef<MeditationModel>();
  if (meditation === undefined) {
    return null;
  }

  return e(
    MeditationContext.Provider,
    { value: { meditation: meditation } },
    children
  );
};

interface Props {
  meditation: MeditationModel;
}
export default Meditation;

export {
  useMeditationContext,
  API,
  Hooks,
  MeditationType,
  BackgroundSound,
  playFragmentMeditationBackground,
};
