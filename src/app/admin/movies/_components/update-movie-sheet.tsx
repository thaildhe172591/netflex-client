"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useUpdateMovie } from "../_hooks/use-movie-mutations";
import { useMovieDetail } from "@/hooks/movie/use-movie-detail";
import { UpdateMoviePayload } from "@/models";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/constants";
import { AlertCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { MultiSelect } from "@/components/ui/multi-select";
import { FileUploader } from "@/components/file-uploader";
import { useCountries } from "@/hooks/country/use-countries";
import { useActors } from "@/app/admin/actors/_hooks/use-actor";
import { useGenres } from "@/hooks/genre/use-genres";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/common";

const formSchema = z.object({
  id: z.number(),
  title: z.string().min(1, { message: "Title is required." }),
  overview: z.string().optional(),
  poster: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      `File size should be less than 5MB.`
    ),
  backdrop: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      `File size should be less than 5MB.`
    ),
  video: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 100 * 1024 * 1024,
      `File size should be less than 5MB.`
    ),
  countryIso: z.string().optional(),
  runtime: z.number().optional(),
  releaseDate: z.date().optional(),
  actors: z.array(z.number()).optional(),
  genres: z.array(z.number()).optional(),
});

type MovieFormValues = z.infer<typeof formSchema>;

interface UpdateMovieSheetProps {
  movieId: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function UpdateMovieSheet({
  movieId,
  isOpen,
  setIsOpen,
}: UpdateMovieSheetProps) {
  const queryClient = useQueryClient();

  const { data: movieData, isLoading: isMovieLoading } = useMovieDetail(
    movieId,
    { enabled: !!movieId && isOpen }
  );

  const { data: countries } = useCountries();
  const { data: actorsData } = useActors({ pageIndex: 1, pageSize: 100 });
  const { data: genresData } = useGenres({ pageIndex: 1, pageSize: 100 });

  const form = useForm<MovieFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      title: "",
      overview: "",
      countryIso: "",
      runtime: 0,
      releaseDate: undefined,
      actors: [],
      genres: [],
      poster: undefined,
      backdrop: undefined,
      video: undefined,
    },
  });

  useEffect(() => {
    if (movieData) {
      form.reset({
        id: movieData.id,
        title: movieData.title,
        overview: movieData.overview || "",
        countryIso: movieData.countryIso || "",
        runtime: movieData.runtime || 0,
        releaseDate: movieData.releaseDate
          ? new Date(movieData.releaseDate)
          : undefined,
        actors: movieData.actors?.map((actor) => actor.id) || [],
        genres: movieData.genres?.map((genre) => genre.id) || [],
        poster: undefined,
        backdrop: undefined,
        video: undefined,
      });
    }
  }, [movieData, form]);

  const { mutate: updateMovie, isPending, error } = useUpdateMovie();

  const onSubmit = async (values: MovieFormValues) => {
    updateMovie(
      { movieId: movieId, payload: values as UpdateMoviePayload },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [QueryKeys.MOVIES] });
          setIsOpen(false);
        },
        onError: (error) => {
          console.error("Failed to update movie:", error);
        },
      }
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full max-w-md overflow-y-auto sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Update Movie</SheetTitle>
          <SheetDescription>Update the details for the movie.</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>{error.message}</AlertTitle>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {isMovieLoading ? (
                <div className="flex items-center justify-center">
                  <Icons.spinner className="animate-spin" />
                </div>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            id="title"
                            {...field}
                            placeholder="E.g. Interstellar, Parasite, The Godfather..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="overview"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="overview" className="text-right">
                          Overview
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            id="overview"
                            {...field}
                            placeholder="A brief synopsis of the movie plot..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="poster"
                    render={({ field: { value, ...field } }) => (
                      <FormItem>
                        <FormLabel>Poster</FormLabel>
                        <FormControl>
                          <FileUploader
                            value={value}
                            onChange={field.onChange}
                            type="image"
                            initPreview={movieData?.posterPath}
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="backdrop"
                    render={({ field: { value, ...field } }) => (
                      <FormItem>
                        <FormLabel>Backdrop</FormLabel>
                        <FormControl>
                          <FileUploader
                            value={value}
                            onChange={field.onChange}
                            type="image"
                            initPreview={movieData?.backdropPath}
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="video"
                    render={({ field: { value, ...field } }) => (
                      <FormItem>
                        <FormLabel>Video</FormLabel>
                        <FormControl>
                          <FileUploader
                            value={value}
                            onChange={field.onChange}
                            type="hls"
                            allowedExtensions={[".M3U8"]}
                            className="h-64 w-full max-w-full aspect-video bg-black flex items-center justify-center overflow-hidden rounded-md"
                            initPreview={movieData?.videoUrl}
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                      <FormField
                        control={form.control}
                        name="countryIso"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || movieData?.countryIso || ""}
                            >
                              <FormControl>
                                <SelectTrigger disabled={isPending}>
                                  <SelectValue placeholder="Select a country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {countries?.map((country) => (
                                  <SelectItem
                                    key={country.iso_3166_1}
                                    value={country.iso_3166_1}
                                  >
                                    {country.english_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-6">
                      <FormField
                        control={form.control}
                        name="runtime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Runtime (minutes)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(event) => {
                                  field.onChange(
                                    event.target.value === ""
                                      ? undefined
                                      : Number(event.target.value)
                                  );
                                }}
                                pattern="[0-9]*"
                                inputMode="numeric"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="releaseDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Release Date</FormLabel>
                        <FormControl>
                          <DatePicker
                            date={field.value}
                            setDate={field.onChange}
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="actors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Actors</FormLabel>
                        <FormControl>
                          <MultiSelect
                            selected={field.value || []}
                            options={
                              actorsData?.data?.map((actor) => ({
                                label: actor.name,
                                value: actor.id,
                              })) || []
                            }
                            onSelectedChange={field.onChange}
                            placeholder="Select actors"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="genres"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Genres</FormLabel>
                        <FormControl>
                          <MultiSelect
                            selected={field.value || []}
                            options={
                              genresData?.data?.map((genre) => ({
                                label: genre.name,
                                value: genre.id,
                              })) || []
                            }
                            onSelectedChange={field.onChange}
                            placeholder="Select genres"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                      {isPending && <Icons.spinner className="animate-spin" />}
                      Update
                    </Button>
                  </div>
                </>
              )}
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
