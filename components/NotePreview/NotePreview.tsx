import { fetchNoteById } from "@/lib/api/clientApi";

export default async function NotePreview({ id }: { id: string }) {
  const note = await fetchNoteById(id);

  return (
    <div>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      <p>{note.tag}</p>
    </div>
  );
}
