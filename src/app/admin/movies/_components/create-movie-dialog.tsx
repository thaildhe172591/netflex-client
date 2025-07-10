"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useCreateMovie } from "../_hooks/use-movie-mutations";
import { CreateMoviePayload } from "@/models";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/constants";
import { AlertCircleIcon, CirclePlus } from "lucide-react";
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
import { useCountries } from "@/hooks/use-countries";
import { useActors } from "@/app/admin/actors/_hooks/use-actor";
import { useGenres } from "@/app/admin/genres/_hooks/use-genre";
import { useKeywords } from "@/app/admin/keywords/_hooks/use-keyword";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  overview: z.string().optional(),
  poster: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      `Poster size should be less than 5MB.`
    ),
  backdrop: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      `Backdrop size should be less than 5MB.`
    ),
  video: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 100 * 1024 * 1024,
      `Video size should be less than 100MB.`
    ),
  countryIso: z.string().optional(),
  runtime: z.number().optional(),
  releaseDate: z.date().optional(),
  actors: z.array(z.number()).optional(),
  keywords: z.array(z.number()).optional(),
  genres: z.array(z.number()).optional(),
});

type MovieFormValues = z.infer<typeof formSchema>;

export function CreateMovieDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: countries } = useCountries();
  const { data: actorsData } = useActors({});
  const { data: genresData } = useGenres({});
  const { data: keywordsData } = useKeywords({});

  const form = useForm<MovieFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      overview: "",
      countryIso: "",
      runtime: 0,
      releaseDate: undefined,
      actors: [],
      keywords: [],
      genres: [],
      poster: undefined,
      backdrop: undefined,
      video: undefined,
    },
  });

  const { mutate: createMovie, isPending, error } = useCreateMovie();

  const onSubmit = async (values: MovieFormValues) => {
    createMovie(values as CreateMoviePayload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.MOVIES] });
        setOpen(false);
        form.reset();
      },
      onError: (error) => {
        console.error("Failed to create movie:", error);
      },
    });
  };

  return (
    <>
      <Button
        variant="outline"
        className="border-dashed"
        onClick={() => setOpen(true)}
      >
        <CirclePlus className="mr-0.5 h-4 w-4" />
        Create
      </Button>

      <ResponsiveDialog
        isOpen={open}
        setIsOpen={setOpen}
        title="Create New Movie"
        description="Fill in the details for the new movie."
        className="sm:max-w-sm"
      >
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>{error.message}</AlertTitle>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input id="title" {...field} />
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
                    <Textarea id="overview" {...field} />
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
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
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
                    <DatePicker date={field.value} setDate={field.onChange} />
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords</FormLabel>
                  <FormControl>
                    <MultiSelect
                      selected={field.value || []}
                      options={
                        keywordsData?.data?.map((keyword) => ({
                          label: keyword.name,
                          value: keyword.id,
                        })) || []
                      }
                      onSelectedChange={field.onChange}
                      placeholder="Select keywords"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </ResponsiveDialog>
    </>
  );
}
