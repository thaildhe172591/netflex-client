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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSendOTP } from "@/hooks";
import { useState } from "react";
import { AxiosError } from "axios";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/common";

const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export default function ForgotPasswordPage() {
  const { mutateAsync: sendOTP } = useSendOTP();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ForgotPasswordSchema>) => {
    try {
      setError(null);
      setIsLoading(true);
      await sendOTP(data.email);
      router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.detail || "Failed to resend OTP.");
      } else {
        setError("Failed to resend OTP.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm relative z-10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a otp to reset your
          password.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Icons.spinner className="animate-spin" />}
              Send OTP
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link
            href="/login?_modal=0"
            className="underline underline-offset-4 text-primary"
          >
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
