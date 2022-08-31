import { useState, useEffect } from "react";
import { API } from "~modules/meditation";

export function useCountMeditation(nameMeditationType: string) {
  const [count, setCount] = useState(0);
  let isActivate = false;
  useEffect(() => {
    const init = async () => {
      const result = await API.getCountMeditationInCategory(nameMeditationType);
      if (isActivate) {
        setCount(result);
      }
    };
    isActivate = true;
    init().catch(console.error);
    return () => {
      isActivate = false;
    };
  }, [setCount]);

  return count;
}
