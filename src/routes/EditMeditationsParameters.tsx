import React, { FC, useReducer } from "react";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import EditMeditationsParametersContexts, {
  ActionsEditParameters,
} from "~contexts/editMeditationsParameters";
import { useAppDispatch, useAppSelector } from "~store/index";
import EditMeditationsParametersDateScreen from "~screens/EditMeditationsParametersDate";
import EditMeditationsParametersTypeScreen from "~screens/EditMeditationsParametersTime";
import EditMeditationsParametersTimeScreen from "~screens/EditMeditationsParametersType";
import ScreenFinallyResultScreen from "~screens/ScreenFinallyResult";
import i18n from "~i18n";
import {
  editParametersMeditation,
  removeParametersMeditation,
} from "~store/meditation";

function reducer(
  state: ParametersMeditation,
  action: ActionsEditParameters
): ParametersMeditation {
  switch (action.type) {
    case "SelectDate":
      state.countDay = action.payload;
      break;
    case "SelectTime":
      state.time = action.payload;
      break;
    case "addType":
      if (!state.type.includes(action.payload)) {
        state.type = [...state.type, action.payload];
      }
      break;
    case "removeType":
      if (state.type.includes(action.payload)) {
        state.type = [...state.type.filter((item) => item != action.payload)];
      }
      break;
  }
  return { ...state };
}

const initialState: ParametersMeditation = {
  countDay: "4-5days",
  time: "moreThan15AndLessThan60Minutes",
  type: ["relaxation"],
};

const EditMeditationsParametersStack =
  createNativeStackNavigator<EditMeditationsParametersList>();

const EditMeditationsParametersRoutes: FC<
  NativeStackScreenProps<RootStackParamList, "EditMeditationsParameters">
> = () => {
  const editMeditationsParameters = useAppSelector(
    (state) => state.meditation.parametersMeditation ?? initialState
  );
  const dispatch = useAppDispatch();

  const [parametersMeditation, editParameters] = useReducer(
    reducer,
    editMeditationsParameters
  );

  const saveParameter = () => {
    dispatch(editParametersMeditation(parametersMeditation));
  };

  const removeParameters = () => {
    dispatch(removeParametersMeditation());
  };

  return (
    <EditMeditationsParametersContexts.Provider
      value={{
        parametersMeditation,
        editParameters,
        saveParameter,
        removeParameters,
      }}
    >
      <EditMeditationsParametersStack.Navigator
        initialRouteName="SelectDate"
        screenOptions={{
          animationTypeForReplace: "pop",
          headerTransparent: true,
          title: i18n.t("b18185ed-887d-4946-9bce-3daf791828ae"),
          animation: "fade",
        }}
      >
        <EditMeditationsParametersStack.Screen
          component={EditMeditationsParametersDateScreen}
          name={"SelectDate"}
        />
        <EditMeditationsParametersStack.Screen
          component={EditMeditationsParametersTypeScreen}
          name={"SelectTime"}
        />
        <EditMeditationsParametersStack.Screen
          component={EditMeditationsParametersTimeScreen}
          name={"SelectType"}
        />

        <EditMeditationsParametersStack.Screen
          component={ScreenFinallyResultScreen}
          name={"ScreenFinallyResult"}
          initialParams={{ result: false }}
        />
      </EditMeditationsParametersStack.Navigator>
    </EditMeditationsParametersContexts.Provider>
  );
};

export default EditMeditationsParametersRoutes;
