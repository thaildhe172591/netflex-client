"use client";
import { useState } from "react";
import { columns, ActorItem } from "./columns";
import { DataTable } from "./data-table";
import { Input } from "@/components/ui/input";
import { useActors } from "./_hooks/use-actor";
import { Actor } from "@/models";
import { CreateActorDialog } from "./_components/create-actor-dialog";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDebounce } from "use-debounce";

export default function Page() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [pageIndex, setPageIndex] = useState(1);

  const { data: actorsData } = useActors({
    search: debouncedSearch,
    sortBy: "name",
    pageIndex: pageIndex,
    pageSize: 10,
  });

  const totalPage = actorsData?.total
    ? Math.ceil(actorsData.total / actorsData.pageSize)
    : 0;

  const canPreviousPage = (pageIndex ?? 1) > 1;
  const canNextPage = (pageIndex ?? 1) < totalPage;

  const data: ActorItem[] =
    actorsData?.data.map((actor: Actor) => ({
      id: actor.id,
      name: actor.name,
      gender: actor.gender,
      birthDate: actor.birthDate,
      biography: actor.biography,
      image: actor.image,
    })) || [];

  return (
    <>
      <div>
        <h6>Actors</h6>
        <p className="text-sm text-muted-foreground">
          Manage your actor collection
        </p>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search actors..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <CreateActorDialog />
      </div>
      <div className="container mx-auto">
        <DataTable columns={columns} data={data} />
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {actorsData?.pageIndex} of {totalPage}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex(pageIndex - 1)}
            disabled={!canPreviousPage}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex(pageIndex + 1)}
            disabled={!canNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
