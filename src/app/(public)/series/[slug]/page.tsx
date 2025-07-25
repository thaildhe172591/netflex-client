"use client";

import { notFound } from "next/navigation";
import { useSerieDetail } from "@/hooks/serie/use-serie-detail";
import { extractIdFromSlug } from "@/lib/slug";
import { use } from "react";

interface SerieDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function SerieDetailPage({ params }: SerieDetailPageProps) {
  const { slug } = use(params);
  const serieId = extractIdFromSlug(slug);

  if (!serieId) notFound();

  const { data: serie, isLoading, error } = useSerieDetail(serieId);
  if (isLoading) return;
  if (!serie || error) notFound();

  return null;
}
