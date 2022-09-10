import { useState } from "react";
import { MeditationType } from "~modules/meditation";

export function useMeditationListForType(typeMeditation: TypeMeditation) {
  const [IsLoading, setIsLoading] = useState<boolean>(false);
  const [ListMeditation, setListMeditation] = useState<MeditationType[]>([
    {
      description: "testDiscription",
      id: "1",
      image:
        "https://oir.mobi/uploads/posts/2021-06/1623116905_30-oir_mobi-p-nochnaya-doroga-v-lesu-priroda-krasivo-fot-35.jpg",
      name: "Test Name",
      lengthAudio: 60000,
      permission: true,
      type: "relaxation",
    },
    {
      description: "testDiscription",
      id: "2",
      image:
        "https://oir.mobi/uploads/posts/2021-06/1623116905_30-oir_mobi-p-nochnaya-doroga-v-lesu-priroda-krasivo-fot-35.jpg",
      name: "Test Name",
      lengthAudio: 60000,
      permission: true,
      type: "relaxation",
    },
    {
      description: "testDiscription",
      id: "3",
      image:
        "https://oir.mobi/uploads/posts/2021-06/1623116905_30-oir_mobi-p-nochnaya-doroga-v-lesu-priroda-krasivo-fot-35.jpg",
      name: "Test Name",
      lengthAudio: 60000,
      permission: true,
      type: "relaxation",
    },
  ]);

  return {
    IsLoading,
    ListMeditation,
  };
}
