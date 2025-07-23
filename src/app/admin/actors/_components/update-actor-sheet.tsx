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
import { useUpdateActor } from "../_hooks/use-actor-mutations";
import { useActorDetail } from "../_hooks/use-actor";
import { UpdateActorPayload } from "@/models";
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
  id: z.number(),
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

interface UpdateActorSheetProps {
  actorId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function UpdateActorSheet({
  actorId,
  isOpen,
  setIsOpen,
}: UpdateActorSheetProps) {
  const queryClient = useQueryClient();

  const { data: actorData, isLoading: isActorLoading } = useActorDetail(
    actorId,
    { enabled: !!actorId && isOpen }
  );

  const form = useForm<ActorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      name: "",
      gender: undefined,
      image: undefined,
      birthDate: undefined,
      biography: "",
    },
  });

  useEffect(() => {
    if (actorData) {
      form.reset({
        id: actorData.id,
        name: actorData.name,
        gender: actorData.gender,
        birthDate: actorData.birthDate
          ? new Date(actorData.birthDate)
          : undefined,
        biography: actorData.biography || "",
        image: undefined,
      });
    }
  }, [actorData, form]);

  const { mutate: updateActor, isPending, error } = useUpdateActor();

  const onSubmit = async (values: ActorFormValues) => {
    updateActor(
      { actorId: actorId, payload: values as UpdateActorPayload },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [QueryKeys.ACTORS] });
          setIsOpen(false);
        },
        onError: (error) => {
          console.error("Failed to update actor:", error);
        },
      }
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full max-w-md overflow-y-auto sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Update Actor</SheetTitle>
          <SheetDescription>Update the details for the actor.</SheetDescription>
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
              {isActorLoading ? (
                <div className="flex items-center justify-center">
                  {/* <Icons.spinner className="animate-spin" /> */}
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
                            placeholder="E.g. Tom Hanks, Scarlett Johansson..."
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
                            initPreview={actorData?.image}
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
