import { useState, useEffect } from "react";
import { API, MeditationType } from "~modules/meditation";

export function useMeditationToDay() {
  const [meditation, setMeditation] = useState<{
    id: string;
    name: string;
    description: string;
    lengthAudio: number;
    image: string;
    isCustomTime: boolean;
  } | null>(null);
  useEffect(() => {
    const init = async () => {
      const _meditation = await API.getPopularToDayMeditation();
      const isCustomTime = _meditation.type !== "directionalVisualizations";
      if (setMeditation !== undefined)
        setMeditation({ ..._meditation, isCustomTime });
    };
    init().catch(console.error);
  }, [setMeditation]);

  return meditation;
}

export function useMeditationRecomendation() {
  const [meditation, setMeditation] = useState<{
    id: string;
    name: string;
    description: string;
    lengthAudio: number;
    image: string;
    isCustomTime: boolean;
  } | null>(null);
  useEffect(() => {
    const init = async () => {
      const _meditation = await API.getRecomendationMeditation();
      const isCustomTime = _meditation.type !== "directionalVisualizations";
      if (setMeditation !== undefined)
        setMeditation({ ..._meditation, isCustomTime });
    };
    init().catch(console.error);
  }, [setMeditation]);

  return meditation;
}
