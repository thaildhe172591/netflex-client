"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EpisodeManager } from "@/app/admin/series/_components/episode-manager";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/constants";
import { AlertCircleIcon, CircleX, Pencil } from "lucide-react";
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
import { useGenres } from "@/hooks/genre/use-genres";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSerieDetail } from "@/hooks/serie/use-serie-detail";
import { useUpdateSerie } from "../_hooks/use-serie-mutations";
import { UpdateSeriePayload } from "@/models";
import { Icons } from "@/components/common/icon";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
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
  countryIso: z.string().optional(),
  firstAirDate: z.date().optional(),
  lastAirDate: z.date().optional(),
  keywords: z.array(z.number()).optional(),
  genres: z.array(z.number()).optional(),
});

type SerieFormValues = z.infer<typeof formSchema>;

export default function SerieDetailPage() {
  const params = useParams();
  const serieId = Number(params?.id);
  const queryClient = useQueryClient();
  const { data: countries } = useCountries();
  const { data: genresData } = useGenres({ pageIndex: 1, pageSize: 100 });
  const {
    data: serie,
    isLoading,
    error: fetchError,
  } = useSerieDetail(serieId);
  const {
    mutate: updateSerie,
    isPending,
    error: updateError,
  } = useUpdateSerie();

  const [editMode, setEditMode] = useState(false);

  const form = useForm<SerieFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      overview: "",
      countryIso: "",
      firstAirDate: undefined,
      lastAirDate: undefined,
      keywords: [],
      genres: [],
      poster: undefined,
      backdrop: undefined,
    },
  });

  useEffect(() => {
    if (serie) {
      form.reset({
        name: serie.name || "",
        overview: serie.overview || "",
        countryIso: serie.countryIso || "",
        firstAirDate: serie.firstAirDate
          ? new Date(serie.firstAirDate)
          : undefined,
        lastAirDate: serie.lastAirDate
          ? new Date(serie.lastAirDate)
          : undefined,
        keywords: serie.keywords?.map((k) => k.id) || [],
        genres: serie.genres?.map((g) => g.id) || [],
        poster: undefined,
        backdrop: undefined,
      });
    }
  }, [form, serie]);

  const onSubmit = async (values: SerieFormValues) => {
    updateSerie(
      { serieId: serieId, payload: values as UpdateSeriePayload },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [QueryKeys.SERIES] });
          setEditMode(false);
        },
      }
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (fetchError)
    return (
      <Alert variant="destructive">
        <AlertTitle>{fetchError.message}</AlertTitle>
      </Alert>
    );

  return (
    <Tabs defaultValue="serie">
      <TabsList className="mb-1">
        <TabsTrigger value="serie">Information</TabsTrigger>
        <TabsTrigger value="episode">Episodes</TabsTrigger>
      </TabsList>
      <TabsContent value="serie">
        <div className="max-w-xl">
          {updateError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>{updateError.message}</AlertTitle>
            </Alert>
          )}

          <div className="flex justify-between mb-4 items-center">
            <div>
              <h6>Serie Detail</h6>
              <p className="text-sm text-muted-foreground">
                View and edit serie information.
              </p>
            </div>
            {!editMode ? (
              <Button onClick={() => setEditMode(true)} disabled={isPending}>
                <Pencil className="mr-1 h-4 w-4" />
                Edit
              </Button>
            ) : (
              <Button
                onClick={() => setEditMode(false)}
                variant="secondary"
                className="text-red-500"
              >
                <CircleX className="mr-1 h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        id="name"
                        {...field}
                        disabled={isPending || !editMode}
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
                        disabled={isPending || !editMode}
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
                        disabled={isPending || !editMode}
                        initPreview={serie?.posterPath}
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
                        disabled={isPending || !editMode}
                        initPreview={serie?.backdropPath}
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
                          value={
                            field.value || (serie && serie.countryIso) || ""
                          }
                        >
                          <FormControl>
                            <SelectTrigger disabled={isPending || !editMode}>
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
                    name="lastAirDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Air Date</FormLabel>
                        <FormControl>
                          <DatePicker
                            date={field.value}
                            setDate={field.onChange}
                            disabled={isPending || !editMode}
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
                name="firstAirDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Air Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        setDate={field.onChange}
                        disabled={isPending || !editMode}
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
                        disabled={isPending || !editMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {editMode && (
                <div className="flex justify-end gap-2">
                  <Button type="submit" disabled={isPending}>
                    {isPending && <Icons.spinner className="animate-spin" />}
                    Save
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </div>
      </TabsContent>
      <TabsContent value="episode">
        <EpisodeManager seriesId={serieId} />
      </TabsContent>
    </Tabs>
  );
}
