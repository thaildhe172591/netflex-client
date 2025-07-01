import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Edit, Trash2, Eye, Search } from "lucide-react";

const movies = [
  {
    id: 1,
    title: "Avatar: The Way of Water",
    genre: "Sci-Fi, Adventure",
    year: 2022,
    rating: 8.2,
    status: "Published",
    views: "12.5K",
    duration: "192 min",
  },
  {
    id: 2,
    title: "Top Gun: Maverick",
    genre: "Action, Drama",
    year: 2022,
    rating: 8.7,
    status: "Published",
    views: "18.2K",
    duration: "130 min",
  },
  {
    id: 3,
    title: "Black Panther: Wakanda Forever",
    genre: "Action, Adventure",
    year: 2022,
    rating: 7.9,
    status: "Draft",
    views: "9.8K",
    duration: "161 min",
  },
  {
    id: 4,
    title: "The Batman",
    genre: "Action, Crime",
    year: 2022,
    rating: 8.1,
    status: "Published",
    views: "15.7K",
    duration: "176 min",
  },
];

export default function MoviesPage() {
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
        <Button variant="outline">Filter</Button>
        <Button variant="outline">
          <Plus className="mr-1 h-4 w-4" />
          Add Movie
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movies.map((movie) => (
              <TableRow key={movie.id}>
                <TableCell className="font-medium">{movie.title}</TableCell>
                <TableCell>{movie.year}</TableCell>
                <TableCell>{movie.duration}</TableCell>
                <TableCell>
                  <div className="flex items-center">⭐ {movie.rating}</div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      movie.status === "Published" ? "default" : "secondary"
                    }
                  >
                    {movie.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
