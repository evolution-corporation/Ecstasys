import { createContext, useContext } from "react";
import * as API from "./api";
import Meditation from "./models";

export const MeditationContext = createContext<Context | null>(null);

export const useMeditationContext = () => {
  const context = useContext(MeditationContext);
  if (!context) throw new Error("Context not found!");
  return context;
};

interface Context {
  meditation: Meditation;
}
