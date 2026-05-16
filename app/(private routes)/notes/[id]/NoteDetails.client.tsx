"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchNoteById } from "@/lib/api/clientApi";

type NoteDetailsClientProps = {
  id: string;
};

export default function NoteDetailsClient({ id }: NoteDetailsClientProps) {
  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Something went wrong.</p>;
  }

  if (!note) {
    return <p>Note not found.</p>;
  }

  return (
    <main>
      <h1>{note.title}</h1>
      <p>{note.content}</p>
      <p>{note.tag}</p>
    </main>
  );
}
