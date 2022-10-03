import i18n, { getCountryName, getCountryList } from "./i18n";
import gStyle, {
  useCustomFonts,
  toastOptions,
  styleImage,
  styleText,
  setColorOpacity,
} from "./styles";
import {
  useApiOFF,
  getApiOff,
  getDevUserData,
  getIsCustomDataUser,
  setCustomDataUser,
  useCustomDataUser,
  createCustomerDatatUser,
  useShowIntroScreen,
  getSubscribe,
  setSubscribe,
} from "./dev";

export default {
  i18n,
  gStyle,
};
const customUserData = {
  getDevUserData,
  getIsCustomDataUser,
  setCustomDataUser,
  createCustomerDatatUser,
};

const subscribe = {
  getSubscribe,
  setSubscribe,
};

export {
  useCustomFonts,
  toastOptions,
  styleImage,
  styleText,
  setColorOpacity,
  useApiOFF,
  useCustomDataUser,
  getApiOff,
  customUserData,
  useShowIntroScreen,
  subscribe,
};
