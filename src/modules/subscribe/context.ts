import {
  createContext,
  useContext,
  useState,
  createElement,
  FC,
  useCallback,
  useEffect,
} from "react";
import { getSubscribeInformation } from "./api";
const e = createElement;

export const subscribeContext = createContext<{
  info: SubscribeInfo;
  setSubscribe: (
    date: Date,
    type: typeSubscribe,
    autoPayment: boolean
  ) => Promise<void>;
  name: string;
} | null>(null);

export function useSubscribe() {
  const context = useContext(subscribeContext);
  if (subscribeContext === null) {
    return null;
  }
  return context;
}

export const SubscribeProvider: FC<Props> = ({ children }) => {
  const [subscribeInfo, setSubscribeInfo] = useState<SubscribeInfoNew>(null);
  const [nameSubscribe, setNameSubscribe] = useState<string>("Base");

  const setSubscribe = useCallback(
    async (date: Date, type: typeSubscribe, autoPayment: boolean) => {
      //! DEV
      setNameSubscribe(date.getTime() > Date.now() ? "Premium" : "Base");
    },
    []
  );

  useEffect(() => {
    const init = async () => {
      const subscribeInformation = await getSubscribeInformation();
      let name = "Base";
      let information: SubscribeInfoNew = null;
      if (
        subscribeInformation &&
        subscribeInformation.nextPayment.getTime() > Date.now()
      ) {
        name = "Premium";
        information = {
          nextPayment: subscribeInformation.nextPayment,
          type: subscribeInformation.type,
          autoPayment: subscribeInformation.auto,
        };
      }
      setNameSubscribe(name);
      setSubscribeInfo(information);
    };
    init().catch(console.error);
    return () => {};
  }, [setNameSubscribe]);

  return e(
    subscribeContext.Provider,
    { value: { info: subscribeInfo, setSubscribe, name: nameSubscribe } },
    children
  );
};

interface Props {
  children: JSX.Element;
}
