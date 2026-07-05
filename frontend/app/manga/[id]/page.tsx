"use client";

import React from "react";
import { useParams } from "next/navigation";
import { MangaDetailsView } from "@/components/manga-details/MangaDetailsView";

export default function MangaDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  return <MangaDetailsView mangaId={id} />;
}
