"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Icons } from "@/components/common/icon";
import { authApi } from "@/lib/api-client";
import { useState } from "react";
import { useRegister } from "../_hooks/use-register";
import { AxiosError } from "axios";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { LoadingButton } from "@/components/ui/loading-button";
import { appToast } from "@/lib/toast";
import { useTranslations } from "next-intl";

const createRegisterSchema = (t: any) => z
  .object({
    username: z.string().email({ message: t("validation.email") }),
    password: z
      .string()
      .min(8, { message: t("validation.password_min") }),
    rePassword: z.string(),
  })
  .refine((data) => data.password === data.rePassword, {
    message: t("validation.password_mismatch"),
    path: ["rePassword"],
  });

interface IProps extends React.ComponentProps<"div"> {
  onSuccess?: (data?: unknown) => void;
}

export function RegisterForm({ className, onSuccess, ...props }: IProps) {
  const t = useTranslations("Auth");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: register } = useRegister();

  const RegisterSchema = createRegisterSchema(t);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      password: "",
      rePassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    const loadingId = appToast.loading({
      title: t("creating_account"),
      description: t("creation_desc"),
    });
    try {
      setError(null);
      setIsLoading(true);
      const payload = {
        email: data.username,
        password: data.password,
      };
      await register(payload);
      appToast.success({
        title: t("account_created"),
      });
      onSuccess?.(data.username);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.detail || t("registration_failed"));
      } else {
        setError(t("registration_failed"));
      }
      appToast.error({
        title: t("registration_failed"),
      });
    } finally {
      appToast.dismiss(loadingId);
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    const loadingId = appToast.loading({
      title: t("continue_google"),
    });
    try {
      setIsLoading(true);
      const res = await authApi.loginSocial("google");
      const loginUrl = res.data?.loginUrl;
      if (loginUrl) window.location.href = loginUrl;
      else {
        appToast.error({
          title: t("google_unavailable"),
        });
      }
    } finally {
      appToast.dismiss(loadingId);
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {error && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("username")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="m@example.com"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("password")}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rePassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("re_password")}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <LoadingButton
            type="submit"
            className="w-full"
            isLoading={isLoading}
            loadingLabel={t("creating_account")}
          >
            {t("signup")}
          </LoadingButton>
        </form>
      </Form>

      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-card text-muted-foreground relative z-10 px-2">
          {t("continue_google")}
        </span>
      </div>

      <Button
        variant="outline"
        className="w-full mb-0"
        onClick={handleGoogleSignUp}
        disabled={isLoading}
      >
        <Icons.google className="mr-1 h-4 w-4" />
        {t("continue_google")}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        {t("have_account")}{" "}
        <Link
          href="/login?_modal=0"
          className="underline underline-offset-4 text-primary"
        >
          {t("signin")}
        </Link>
      </div>
    </div>
  );
}
