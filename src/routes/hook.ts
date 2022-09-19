import { DependencyList, useEffect } from "react";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

export function useShowIntro(
  key: string,
  action: () => void,
  deps: DependencyList
) {
  const { getItem, setItem } = useAsyncStorage(key);

  useEffect(() => {
    const init = async () => {
      const isFirstShowStr = await getItem();
      if (isFirstShowStr === null || isFirstShowStr === "true") {
        action();
        await setItem("false");
      }
    };

    init().catch(console.error);
  }, deps);
}
