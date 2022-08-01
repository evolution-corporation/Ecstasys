import { useState, useEffect, DependencyList } from "react";
import NetInfo from "@react-native-community/netinfo";
import { checkServerAccess } from "~api/config";

export default function useIsServerAccess(deps: DependencyList = []): boolean {
  const [networkAccess, setNetworkAccess] = useState<boolean>(false);
  const [serverAccess, setServerAccess] = useState<boolean>(false);
  let isActivate = false;

  useEffect(() => {
    isActivate = true;
    const unsubscribeNetworkInfo = NetInfo.addEventListener((state) => {
      if (isActivate) {
        setNetworkAccess(state.isConnected ?? false);
      }
    });
    return () => {
      isActivate = false;
      unsubscribeNetworkInfo();
    };
  });

  useEffect(() => {
    if (networkAccess) {
      checkServerAccess().then((access) => {
        setServerAccess(access);
      });
    } else {
      setServerAccess(false);
    }
  }, [networkAccess, ...deps]);

  return serverAccess;
}
