import { cookies } from "next/headers";

import { api } from "./api";

import { User } from "@/types/user";
import { Note, NoteTag } from "@/types/note";

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

const getCookieHeader = async () => {
  const cookieStore = await cookies();

  return cookieStore.toString();
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>("/users/me", {
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return response.data;
};

export const checkSession = async () => {
  const response = await api.get("/auth/session", {
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return response;
};

export const fetchNotes = async (
  search = "",
  page = 1,
  tag?: NoteTag | string,
): Promise<NotesResponse> => {
  const response = await api.get<NotesResponse>("/notes", {
    params: {
      search,
      page,
      perPage: 12,
      tag,
    },
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return response.data;
};
