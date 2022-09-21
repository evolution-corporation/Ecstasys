import { useState } from "react";
import { MeditationType } from "~modules/meditation";

export function useMeditationListForType(typeMeditation: TypeMeditation) {
  const [IsLoading, setIsLoading] = useState<boolean>(false);
  const [ListMeditation, setListMeditation] = useState<MeditationType[]>([
    {
      description: "Прекрасная техника для того, чтобы максимально погрузиться в диалог разума и тела",
      id: "1",
      image:
        "https://psv4.userapi.com/c237031/u288153995/docs/d37/64f59bd95e3e/Rasslablenie_ot_nog_k_golove.jpg?extra=xkcKcq2PrY8U2yZJk4vaXCXVUrJCIcyLFuFbTrewRYAxqkrEeUnLi4l7l5QnwpvRuImKtBWPsKK0zDVfpK8xQWV7hBNXB2jJrKG9-wgdlY3Im8JqouguFbEYHEmceza5_pATkLdpmypyj-sTPt_nJ2gycA",
      name: "Расслабление от ног к голове",
      lengthAudio: 60000,
      permission: true,
      type: "relaxation",
    },
    {
      description: "Вдохни и выдохни - напряжение уйдет и ты даже не заметишь",
      id: "2",
      image:
        "https://psv4.userapi.com/c237331/u288153995/docs/d57/3a1d8477fc22/Svoboda_ot_napryazhenia.jpg?extra=Z_CGho__AcgaknCCvXAJI_2hPh0_pRz4xygz8G8WfQCU_sCNNa91yo4uPpLyIQRODorj-BPoBcSoqLA0tWycsCNXYS3apYGhiMPuHAikfWfADXJh232HSS8TgHvZKvQVVuV8hwF0ncPJVP3llqXrEopRaw",
      name: "Свобода от напряжения",
      lengthAudio: 60000,
      permission: true,
      type: "relaxation",
    },
    {
      description: "Эта медитация расставит всё по местам и укажет путь к спокойствию",
      id: "3",
      image:
        "https://psv4.userapi.com/c235031/u288153995/docs/d50/8f9271eadaed/Puteshestvie_v_kosmose_na_zhivote_materi-Zemli.jpg?extra=jkfSufxqUT71NOyn4vaPaNuJMFvmLLnqp_K8LQkbWLVPv3QqR1CnPebhuiNKWQgzRLJDhCD-E2Y0y6pMINpxmDU0cPUvHjFwA3yOeyHZLWllK6_YVcqitT34M3jZ9nI2SqIm0futGXzs7khCLY7IsbUOZg",
      name: "Путешествие в Космосе на животе Матери-Земли",
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
