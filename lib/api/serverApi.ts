import { cookies } from "next/headers";

import { User } from "@/types/user";

import { api } from "./api";

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();

  const response = await api.get<User>("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};
