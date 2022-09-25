import { useEffect, useState } from "react";
import { MeditationType } from "~modules/meditation";
import { getMeditationByCategory } from "~modules/meditation/api";

export function useMeditationListForType(typeMeditation: TypeMeditation) {
  const [IsLoading, setIsLoading] = useState<boolean>(true);
  const [ListMeditation, setListMeditation] = useState<MeditationType[]>([]);
  let isActivate = false;
  useEffect(() => {
    isActivate = true;
    const init = async () => {
      const listMeditation = await getMeditationByCategory(typeMeditation);
      if (isActivate) {
        setListMeditation([...listMeditation]);
        setIsLoading(false);
      }
    };
    init().catch(console.error);
    return () => {
      isActivate = false;
    };
  }, [setIsLoading]);

  return {
    IsLoading,
    ListMeditation,
  };
}
