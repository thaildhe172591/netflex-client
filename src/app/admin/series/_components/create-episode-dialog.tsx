"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { CreateEpisodePayload } from "@/models/episode";
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
import { useActors } from "@/app/admin/actors/_hooks/use-actor";
import { Icons } from "@/components/common/icon";
import { useCreateEpisode } from "../_hooks/use-episode-mutations";

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

export function CreateEpisodeDialog({ serieId }: { serieId: number }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
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

  const { mutate: createEpisode, isPending, error } = useCreateEpisode();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    createEpisode({ ...values, seriesId: serieId } as CreateEpisodePayload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.SERIES, serieId],
        });
        setOpen(false);
        form.reset();
      },
      onError: (error) => {
        console.error("Failed to create episode:", error);
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
        title="Create New Episode"
        description="Fill in the details for the new episode."
        className="sm:max-w-sm"
      >
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>
              {error instanceof Error ? error.message : "Create failed."}
            </AlertTitle>
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
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Icons.spinner className="animate-spin" />}
                Create
              </Button>
            </div>
          </form>
        </Form>
      </ResponsiveDialog>
    </>
  );
}
