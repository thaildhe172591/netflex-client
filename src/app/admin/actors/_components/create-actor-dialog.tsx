"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useCreateActor } from "../_hooks/use-actor-mutations";
import { CreateActorPayload } from "@/models";
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
import { FileUploader } from "@/components/file-uploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/common";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  gender: z.boolean().optional(),
  image: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      `File size should be less than 5MB.`
    ),
  birthDate: z.date().optional(),
  biography: z.string().optional(),
});

type ActorFormValues = z.infer<typeof formSchema>;

export function CreateActorDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<ActorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: undefined,
      image: undefined,
      birthDate: undefined,
      biography: "",
    },
  });

  const { mutate: createActor, isPending, error } = useCreateActor();

  const onSubmit = async (values: ActorFormValues) => {
    createActor(values as CreateActorPayload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.ACTORS] });
        setOpen(false);
        form.reset();
      },
      onError: (error) => {
        console.error("Failed to create actor:", error);
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
        title="Create New Actor"
        description="Fill in the details for the new actor."
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      {...field}
                      placeholder="E.g. Tom Hanks, Scarlett Johansson..."
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value === "true" ? true : false)
                    }
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger disabled={isPending}>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Male</SelectItem>
                      <SelectItem value="false">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, ...field } }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
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
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Date</FormLabel>
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
              name="biography"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="biography" className="text-right">
                    Biography
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="biography"
                      {...field}
                      placeholder="A brief biography of the actor..."
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
