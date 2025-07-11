"use client";
import { Funnel, Search } from "lucide-react";
import { columns, MovieItem } from "./columns";
import { DataTable } from "./data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMovie } from "./_hooks/use-movie";
import { Movie } from "@/models";
import { CreateMovieDialog } from "./_components/create-movie-dialog";

export default function Page() {
  const { data: moviesData } = useMovie({});

  const data: MovieItem[] =
    moviesData?.data.map((movie: Movie) => ({
      id: movie.id,
      title: movie.title,
      year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 0,
      status: movie.videoUrl ? "Published" : "Coming soon",
      duration: movie.runtime ? `${movie.runtime} min` : "N/A",
    })) || [];

  return (
    <>
      <div>
        <h6>Movies</h6>
        <p className="text-sm text-muted-foreground">
          Manage your movie collection
        </p>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search movies..." className="pl-8" />
        </div>
        <Button variant="outline">
          <Funnel className="mr-0.5 h-4 w-4" />
          Filter
        </Button>
        <CreateMovieDialog />
      </div>
      <div className="container mx-auto">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
}
