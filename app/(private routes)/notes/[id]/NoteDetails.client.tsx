"use client";

export default function NoteDetailsClient({ note }: any) {
  return (
    <div>
      <h1>{note.title}</h1>
      <p>{note.content}</p>
    </div>
  );
}
