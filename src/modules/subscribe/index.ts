import { getSubscribeInformatio } from "./api";
import { useSubscribe, SubscribeProvider } from "./context";

const API = {
  getSubscribeInformatio,
};

export default SubscribeProvider;

export { API, useSubscribe };
