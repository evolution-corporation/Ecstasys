import { useEffect, useState } from "react";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

function getToDay() {
  const toDay = new Date();
  toDay.setHours(0, 0, 0, 0);
  return toDay;
}

function useCatchPhrases() {
  const [catchPhrases, setCatchPhrases] = useState<string | null>(null);
  const { setItem, getItem } = useAsyncStorage("@ToDayCatchPhrases");
  let isActivate = false;
  useEffect(() => {
    isActivate = true;
    const initCatchPhrases = async () => {
      let idToken: string | undefined;
      let catchPhrasesDataAS: string | null = await getItem();
      if (catchPhrasesDataAS) {
        const json = JSON.parse(catchPhrasesDataAS);
        const catchPhrasesData = {
          text: json.text,
          dateLastUpdate: new Date(json.dateLastUpdate),
        };
        if (catchPhrasesData.dateLastUpdate < getToDay()) {
          idToken = catchPhrasesData.text;
        }
      }
      if (idToken === undefined) {
        idToken =
          idCatchPhrases[Math.floor(Math.random() * idCatchPhrases.length)];
        setItem(
          JSON.stringify({
            text: idToken,
            dateLastUpdate: getToDay(),
          })
        );
      }
      if (isActivate) {
        setCatchPhrases(idToken);
      }
    };

    initCatchPhrases().catch(console.error);
    return () => {
      isActivate = false;
    };
  }, [setCatchPhrases]);

  return catchPhrases;
}

const idCatchPhrases = ["ccf629cf-67af-47c6-9510-cc145582b8d4"];

export default useCatchPhrases;
