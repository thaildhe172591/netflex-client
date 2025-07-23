"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useCreateSerie } from "../_hooks/use-serie-mutations";
import { CreateSeriePayload } from "@/models";
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
import { useCountries } from "@/hooks/use-countries";
import { useGenres } from "@/app/admin/genres/_hooks/use-genre";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
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

export default function CreateSeriePage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: countries } = useCountries();
  const { data: genresData } = useGenres({ pageIndex: 1, pageSize: 100 });

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

  const { mutate: createSerie, isPending, error } = useCreateSerie();

  const onSubmit = async (values: SerieFormValues) => {
    createSerie(values as CreateSeriePayload, {
      onSuccess: (value) => {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.SERIES] });
        form.reset();
        console.log(value);
        router.push(`/admin/series`);
      },
      onError: (error) => {
        console.error("Failed to create serie:", error);
      },
    });
  };

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h6>Create New Serie</h6>
        <p className="text-sm text-muted-foreground">
          Fill in the details for the new serie.
        </p>
      </div>
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    id="name"
                    {...field}
                    placeholder="E.g. Breaking Bad, Friends, Game of Thrones..."
                    disabled={isPending}
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
                    placeholder="A brief synopsis of the serie plot..."
                    disabled={isPending}
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                name="lastAirDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Air Date</FormLabel>
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
            <Button type="submit" disabled={isPending}>
              {isPending && <Icons.spinner className="animate-spin" />}
              Create
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
