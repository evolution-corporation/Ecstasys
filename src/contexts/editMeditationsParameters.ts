import { createContext, Dispatch } from "react";

const editMeditationsParametersContext = createContext<{
  parametersMeditation: ParametersMeditation;
  editParameters: Dispatch<ActionsEditParameters>;
  saveParameter: () => void;
  removeParameters: () => void;
} | null>(null);
export default editMeditationsParametersContext;

export type ActionsEditParameters =
  | ActionReducerWithPayload<"SelectDate", CountDay_ParameterMeditation>
  | ActionReducerWithPayload<"SelectTime", Time_ParameterMeditation>
  | ActionReducerWithPayload<"addType" | "removeType", TypeMeditation>;
