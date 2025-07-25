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
import { UpdateEpisodePayload } from "@/models/episode";
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
import { useActors } from "@/app/admin/actors/_hooks/use-actor";
import { Icons } from "@/components/common/icon";
import { useEpisodeDetail } from "@/hooks/episode/use-episode-detail";
import { useUpdateEpisode } from "../_hooks/use-episode-mutations";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  episodeNumber: z.number().min(1, { message: "Episode number is required." }),
  overview: z.string().optional(),
  video: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 100 * 1024 * 1024,
      `File size should be less than 100MB.`
    ),
  runtime: z.number().optional(),
  airDate: z.date().optional(),
  actors: z.array(z.number()).optional(),
});

interface UpdateEpisodeSheetProps {
  episodeId: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function UpdateEpisodeSheet({
  episodeId,
  isOpen,
  setIsOpen,
}: UpdateEpisodeSheetProps) {
  const queryClient = useQueryClient();
  const { data: episodeData, isLoading: isEpisodeLoading } = useEpisodeDetail(
    episodeId,
    { enabled: !!episodeId && isOpen }
  );
  const { data: actorsData } = useActors({ pageIndex: 1, pageSize: 100 });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      episodeNumber: 1,
      overview: "",
      runtime: 0,
      airDate: undefined,
      actors: [],
      video: undefined,
    },
  });

  useEffect(() => {
    if (episodeData) {
      form.reset({
        name: episodeData.name,
        episodeNumber: episodeData.episodeNumber || 1,
        overview: episodeData.overview || "",
        runtime: episodeData.runtime || 0,
        airDate: episodeData.airDate
          ? new Date(episodeData.airDate)
          : undefined,
        actors: episodeData.actors?.map((actor) => actor.id) || [],
        video: undefined,
      });
    }
  }, [episodeData, form]);

  const { mutate: updateEpisode, isPending, error } = useUpdateEpisode();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    updateEpisode(
      { episodeId, payload: values as UpdateEpisodePayload },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.SERIES, episodeData?.seriesId],
          });
          setIsOpen(false);
        },
        onError: (error) => {
          console.error("Failed to update episode:", error);
        },
      }
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full max-w-md overflow-y-auto sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Update Episode</SheetTitle>
          <SheetDescription>
            Update the details for the episode.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>
                {error instanceof Error ? error.message : "Update failed."}
              </AlertTitle>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {isEpisodeLoading ? (
                <div className="flex items-center justify-center">
                  Loading...
                </div>
              ) : (
                <>
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
                            placeholder="Episode name..."
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="episodeNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Episode Number</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            placeholder="Episode number..."
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
                            placeholder="A brief synopsis..."
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
                            disabled={isPending}
                            initPreview={episodeData?.videoUrl}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="airDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Air Date</FormLabel>
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
