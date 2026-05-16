"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteNote } from "@/lib/api/clientApi";
import type { Note } from "@/types/note";

import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
    },
  });

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li className={css.listItem} key={note.id}>
          <Link href={`/notes/${note.id}`} className={css.link}>
            <h2 className={css.title}>{note.title}</h2>
          </Link>

          <p className={css.content}>{note.content}</p>

          <p className={css.tag}>{note.tag}</p>

          <button
            className={css.deleteButton}
            type="button"
            onClick={() => mutation.mutate(note.id)}
            disabled={mutation.isPending}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
