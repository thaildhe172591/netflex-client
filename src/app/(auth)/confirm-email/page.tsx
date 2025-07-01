"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { AxiosError } from "axios";
import Link from "next/link";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useConfirmEmail } from "./_hooks/use-confirm-email";
import { useSendOTP } from "@/hooks/use-otp";
import { AlertCircleIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const ConfirmEmailSchema = z.object({
  otp: z
    .string()
    .min(6, { message: "Your one-time password must be 6 characters." }),
});

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const callback = searchParams.get("callback") || "/";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const { mutateAsync: confirmEmail } = useConfirmEmail();
  const { mutateAsync: sendOTP } = useSendOTP();

  const form = useForm<z.infer<typeof ConfirmEmailSchema>>({
    resolver: zodResolver(ConfirmEmailSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (!email) {
      router.replace("/login");
    }
  }, [email, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  if (!email) return null;

  const onSubmit = async (data: z.infer<typeof ConfirmEmailSchema>) => {
    try {
      setError(null);
      setIsSubmitting(true);
      await confirmEmail({ email: email, otp: data.otp });
      if (callback) router.push(callback);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.detail || "An unexpected error occurred.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setError(null);
      setIsResending(true);
      await sendOTP(email);
      setCountdown(30);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.detail || "Failed to resend OTP.");
      } else {
        setError("Failed to resend OTP.");
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-sm relative z-10 backdrop-blur-sm">
      <Card>
        <CardHeader>
          <CardTitle>Verify your email address</CardTitle>
          <CardDescription>
            Please enter the one-time password sent to your email. Didn&apos;t
            receive the otp?{" "}
            <button
              onClick={handleResendOTP}
              className={cn(
                "hover:underline transition-colors",
                countdown > 0 || isSubmitting || isResending
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-primary cursor-pointer"
              )}
              disabled={countdown > 0 || isSubmitting || isResending}
            >
              {countdown > 0 ? `(${countdown}s)` : "Resend"}
            </button>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={cn("flex flex-col gap-6")}>
            {error && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>{error}</AlertTitle>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center">
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          pattern="[0-9]"
                          {...field}
                          onChange={(value) => {
                            field.onChange(value);
                            if (value.length === 6) {
                              form.handleSubmit(onSubmit)();
                            }
                          }}
                          disabled={isSubmitting || isResending}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            <div className="text-center text-sm text-muted-foreground">
              Back to{" "}
              <Link
                href="/login"
                className="underline underline-offset-4 text-primary"
              >
                Sign In
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
