import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { getMeditationById } from "~modules/meditation/api";

export function useFavoriteMeditation() {
  const [listFavoriteMeditation, setListFavoriteMeditation] = useState<
    { id: string; image: string; name: string; category: string }[]
  >([]);
  const [typesMeditation, setTypesMeditation] = useState<string[]>([]);
  const { getItem } = useAsyncStorage("@FavoriteMeditationList");

  useEffect(() => {
    const init = async () => {
      const result = await getItem();
      if (result) {
        const listIdFavoriteMeditation = JSON.parse(result);
        const _listFavoriteMeditation = [];
        const _typesMeditation: string[] = [];
        for (let idMeditation of listIdFavoriteMeditation) {
          const meditationData = await getMeditationById(idMeditation);
          _listFavoriteMeditation.push({
            name: meditationData.name,
            category: meditationData.type,
            image: meditationData.image,
            id: meditationData.id,
          });
          if (!_typesMeditation.includes(meditationData.type)) {
            _typesMeditation.push(meditationData.type);
          }
        }
        setListFavoriteMeditation([..._listFavoriteMeditation]);
        setTypesMeditation([..._typesMeditation]);
      }
    };
    init().catch(console.error);
  }, [setListFavoriteMeditation]);

  return { listFavoriteMeditation, typesMeditation };
}
