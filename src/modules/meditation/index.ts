import React, { FC, useRef } from "react";
import { MeditationContext, useMeditationContext } from "./context";
import * as API from "./api";
import { Meditation as MeditationType } from "./types";
import * as Hooks from "./hook";

const e = React.createElement;

const Meditation: FC<Props> = (props) => {
  const { children } = props;
  const meditation = useRef<MeditationType>();
  if (meditation.current === undefined) {
    return null;
  }

  return e(
    MeditationContext.Provider,
    { value: { meditation: meditation.current } },
    children
  );
};

interface Props {}
export default Meditation;

export { useMeditationContext, API, Hooks, MeditationType };
