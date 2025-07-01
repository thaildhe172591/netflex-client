"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
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
import { cn } from "@/lib/utils";
import { Icons } from "@/components/common";
import { useAuth } from "@/hooks";
import { LoginPayload } from "@/models";
import { getDeviceId } from "@/lib/device";
import { useState } from "react";
import { authApi } from "@/lib/api-client";
import { AxiosError } from "axios";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

const LoginSchema = z.object({
  username: z.string().email({ message: "Username must be email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

interface IProps extends React.ComponentProps<"div"> {
  email?: string | null;
  err?: string | null;
  onSuccess?: (data?: unknown) => void;
}

export function LoginForm({
  className,
  email,
  err,
  onSuccess,
  ...props
}: IProps) {
  const { signin } = useAuth({ enabled: false });
  const [error, setError] = useState<string | null>(err || null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: email || "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    try {
      setError(null);
      setIsLoading(true);
      const payload: LoginPayload = {
        email: data.username,
        password: data.password,
        deviceId: getDeviceId(),
      };
      await signin(payload);
      onSuccess?.();
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.detail || "An unexpected error occurred.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const res = await authApi.loginSocial("google");
      const loginUrl = res.data?.loginUrl;
      if (loginUrl) window.location.href = loginUrl;
    } finally {
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
                <FormLabel>Username</FormLabel>
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
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 text-muted-foreground hover:underline hover:text-primary transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Icons.spinner className="animate-spin" />}
            Login
          </Button>
        </form>
      </Form>

      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-card text-muted-foreground relative z-10 px-2">
          Or continue with
        </span>
      </div>

      <Button
        variant="outline"
        className="w-full mb-0"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        <Icons.google className="mr-1 h-4 w-4" />
        Continue with Google
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="underline underline-offset-4 text-primary"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
