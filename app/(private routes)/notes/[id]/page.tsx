import type { Metadata } from "next";
import { fetchNoteById } from "@/lib/api/notes";

const SITE_URL = "https://08-zustand-ten-sigma.vercel.app";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NotePage({ params }: Props) {
  const { id } = await params;
  const note = await fetchNoteById(id);

  return (
    <div>
      <h1>{note.title}</h1>
      <p>{note.content}</p>
      <p>{note.tag}</p>
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);

  return {
    title: note.title,
    description: note.content,
    openGraph: {
      title: note.title,
      description: note.content,
      url: `${SITE_URL}/notes/${id}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        },
      ],
    },
  };
}
