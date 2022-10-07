import { ServerControllers, ServerEntities } from "~types";

export const getUserById: ServerControllers.user.GET = async ({ user_id }) => {
  return API.request<{ user_id: string }, ServerEntities.User>("users", "GET", {
    user_id,
  });
};

export const patchUser: ServerControllers.user.PATCH = async (body) => {
  return API.request<typeof body, ServerEntities.User>("users", "PATCH", body);
};

export const postUser: ServerControllers.user.POST = async (body) => {
  return API.request<typeof body, ServerEntities.User>("users", "POST", body);
};

export const getNickname: ServerControllers.nickname.GET = async ({
  nickname,
}) => {
  return API.request<{ nickname: string }, ServerEntities.User>(
    "nickname",
    "GET",
    { nickname }
  );
};
