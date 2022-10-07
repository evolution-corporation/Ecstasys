import { getSubscribeInformation } from "./api";
import { useSubscribe, SubscribeProvider } from "./context";

const API = {
  getSubscribeInformatio: getSubscribeInformation,
};

export default SubscribeProvider;

export { API, useSubscribe };
