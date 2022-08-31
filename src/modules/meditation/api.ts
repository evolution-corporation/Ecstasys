import { HOST_URL } from "~api";

export async function getMeditation(id: string) {
  try {
    const url = `${HOST_URL}${id}`;
    const request = await fetch(url);
    if (request.ok) {
      const json = await request.json();
      return {
        description: json.description,
        id: json.id,
        image: json.image,
        name: json.name,
        type: json.typeMeditation,
      };
    } else {
      throw new Error(`API ERROR. CODE: ${request.status}`);
    }
  } catch (error) {
    console.error(error);
    throw new Error(`Function Error`);
  }
}

export async function getCountMeditationInCategory(categoryName: string) {
  return 20;
}
