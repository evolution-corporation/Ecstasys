import { HOST_URL, headers } from "~api";
import { Meditation, TypeMeditation } from "./types";
import { getApiOff } from "~core";

export async function getMeditation(paramas: {
  id?: string;
  category?: string;
  count?: number;
}) {
  try {
    let url = `${HOST_URL}meditation`;
    if (paramas.id !== undefined) {
      url += `${paramas.id}`;
    } else {
      url += "?";
      if (paramas.category) {
        url += `type=${paramas.category}&`;
      }
      if (paramas.count) {
        url += `count=${paramas.count}&`;
      }
    }
    if (url[url.length - 1] === "&" || url[url.length - 1] == "?") {
      url = url.slice(0, url.length - 1);
    }
    const request = await fetch(url, { headers: await headers() });
    if (request.ok) {
      const json = await request.json();
      if (paramas.id) {
        return {
          description: json.description,
          id: json.id,
          image: json.image,
          name: json.name,
          type: json.typeMeditation,
          lengthAudio: json.lengthMeditation,
          audio: json.audio,
        };
      } else {
        return {
          listMeditation: (json.list ?? []).map((item: any) => ({
            description: item.description,
            id: item.id,
            image: item.image,
            name: item.name,
            type: item.typeMeditation,
            lengthAudio: item.lengthMeditation,
            audio: item.audio,
          })),
          count: json.count ?? undefined,
        };
      }
    } else {
      throw new Error(`API ERROR. CODE: ${request.status}`);
    }
  } catch (error) {
    console.error(error);
    throw new Error(`Function Error`);
  }
}

export async function getMeditationById(id: string): Promise<{
  description: string;
  id: string;
  image: string;
  name: string;
  type: TypeMeditation;
  lengthAudio: number;
  audio: string;
}> {
  let meditation;
  if (await getApiOff()) {
    for (let _meditation of meditations) {
      if (_meditation.id === id) {
        meditation = _meditation;
        break;
      }
    }
  } else {
    meditation = await getMeditation({ id: id });
  }
  if (meditation?.id !== undefined) {
    return {
      description: meditation.description,
      id: meditation.id,
      image: meditation.image,
      name: meditation.name,
      type: meditation.type,
      lengthAudio: meditation.lengthAudio,
      audio: meditation.audio,
    };
  } else {
    throw new Error("Meditation with id not found");
  }
}

export async function getCountMeditationInCategory(
  categoryName: TypeMeditation
) {
  let _categoryName = "BasicMeditations";
  switch (categoryName) {
    case "relaxation":
      _categoryName = "relaxation";
      break;
    case "directionalVisualizations":
      _categoryName = "directionalVisualizations";
      break;
    case "breathingPractices":
      _categoryName = "breathingPractices";
      break;
    case "basic":
      _categoryName = "basicMeditations";
      break;
  }
  if (await getApiOff()) {
    let count = 0;
    for (let meditation of meditations) {
      if (meditation.type === categoryName) {
        count++;
      }
    }
    return count;
  } else {
    return await (
      await getMeditation({ category: _categoryName, count: 0 })
    ).count;
  }
}

export async function getPopularToDayMeditation(): Promise<{
  id: string;
  name: string;
  description: string;
  lengthAudio: number;
  image: string;
  type: TypeMeditation;
}> {
  let meditation;
  if (await getApiOff()) {
    meditation = meditations[Math.floor(Math.random() * meditations.length)];
  } else {
    meditation = await getMeditation({});
  }
  if (meditation.id) {
    return {
      id: meditation.id,
      description: meditation.description,
      name: meditation.name,
      lengthAudio: meditation.lengthAudio,
      image: meditation.image,
      type: meditation.type,
    };
  } else {
    throw new Error("Not found Meditation");
  }
}

export async function getRecomendationMeditation(): Promise<Meditation> {
  let meditation;
  if (await getApiOff()) {
    meditation = meditations[Math.floor(Math.random() * meditations.length)];
  } else {
    meditation = await getMeditation({});
  }
  if (meditation.id) {
    return {
      id: meditation.id,
      description: meditation.description,
      name: meditation.name,
      lengthAudio: meditation.lengthAudio,
      image: meditation.image,
      type: meditation.type,
      permission: false,
    };
  } else {
    throw new Error("Not found Meditation");
  }
}

export async function getMeditationByCategory(
  categoryName: TypeMeditation
): Promise<Meditation[]> {
  if (await getApiOff()) {
    return meditations
      .filter((item) => item.type === categoryName)
      .map((item) => ({ ...item, permission: true }));
  } else {
    return (await getMeditation({ category: categoryName, count: 50 }))
      .listMeditation;
  }
}

const relaxationList: Meditation[] = [
  {
    description:
      "Прекрасная техника для того, чтобы максимально погрузиться в диалог разума и тела",
    id: "1",
    image:
      "https://storage.yandexcloud.net/dmdmeditationimage/meditations/271ca80f-1ce6-42c6-a019-dcdc132a59c3.png",
    name: "Расслабление от ног к голове",
    lengthAudio: 223000,
    permission: true,
    type: "relaxation",
    audio:
      "https://storage.yandexcloud.net/dmdmeditatonaudio/d1c415d9-8511-45f6-8adb-7f1e541b9bba.mp3",
  },
  {
    description: "Вдохни и выдохни - напряжение уйдет и ты даже не заметишь",
    id: "2",
    image:
      "https://storage.yandexcloud.net/dmdmeditationimage/meditations/f5d9af34-08f2-446c-b9f5-f57f7acaae2d.png",
    name: "Свобода от напряжения",
    lengthAudio: 212000,
    permission: false,
    type: "relaxation",
    audio:
      "https://storage.yandexcloud.net/dmdmeditatonaudio/94413433-13bf-4569-846b-974f428bc673.mp3",
  },
  {
    description:
      "Эта медитация расставит всё по местам и укажет путь к спокойствию",
    id: "3",
    image:
      "https://storage.yandexcloud.net/dmdmeditationimage/meditations/d76cb078-7cdd-43d2-bfda-6eaa3be04fde.png",
    name: "Путешествие в Космосе на животе Матери-Земли",
    lengthAudio: 266000,
    permission: false,
    type: "relaxation",
    audio:
      "https://storage.yandexcloud.net/dmdmeditatonaudio/c05cfd9b-8461-4ae6-9ef6-7960ef917ea9.mp3",
  },
];

const directionalVisualizationsList: Meditation[] = [
  {
    description:
      "Почувствуй глубокое расслабление от пальцев ног до волос на голове",
    id: "4",
    image:
      "https://storage.yandexcloud.net/dmdmeditationimage/meditations/3446f64d-3162-40e7-8f06-18b7b21d11d0.png",
    name: "Будущее настоящее и следы жизни",
    lengthAudio: 899000,
    permission: true,
    type: "directionalVisualizations",
    audio:
      "https://storage.yandexcloud.net/dmdmeditatonaudio/a6688809-ac78-4701-bb77-85f784af7f93.mp3",
  },
  {
    description: "Собрось и отпусти все своё напряжение и негативные мысли",
    id: "5",
    image:
      "https://storage.yandexcloud.net/dmdmeditationimage/meditations/57fc9b4e-5e10-4f7b-939c-f65229280de6.png",
    name: "Визуализация воплощения",
    lengthAudio: 776000,
    permission: false,
    type: "directionalVisualizations",
    audio:
      "https://storage.yandexcloud.net/dmdmeditatonaudio/ade99b88-55e0-4a78-8679-140d432577f3.mp3",
  },
  {
    description: "Погржайся в расслабление всё глубже и глубже на каждый счёт",
    id: "6",
    image:
      "https://storage.yandexcloud.net/dmdmeditationimage/meditations/00bcbd42-038b-4ef7-95b5-9b8e3a592ef9.png",
    name: "Гора личностного роста",
    lengthAudio: 1059000,
    permission: false,
    type: "directionalVisualizations",
    audio:
      "https://storage.yandexcloud.net/dmdmeditatonaudio/6387521c-adb7-49b7-8a0f-5882eacc35af.mp3",
  },
];

const breathingPracticesList = [
  {
    description:
      "Прекрасная техника для того, чтобы максимально погрузиться в диалог разума и тела",
    id: "1",
    image:
      "https://storage.yandexcloud.net/dmdmeditationimage/meditations/271ca80f-1ce6-42c6-a019-dcdc132a59c3.png",
    name: "Расслабление от ног к голове",
    lengthAudio: 60000,
    permission: true,
    type: "relaxation",
    audio:
      "https://storage.yandexcloud.net/dmdmeditatonaudio/d1c415d9-8511-45f6-8adb-7f1e541b9bba.mp3",
  },
];

const meditations: Meditation[] = [
  ...relaxationList,
  ...directionalVisualizationsList,
];
