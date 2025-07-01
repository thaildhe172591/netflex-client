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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useResetPassword } from "./_hooks/use-confirm-email";
import { ResetPasswordPayload } from "@/models";
import { useSendOTP } from "@/hooks";
import { AxiosError } from "axios";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/common";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { authApi } from "@/lib/api-client";

const OTPSchema = z.object({
  otp: z.string().min(6, { message: "Please enter the complete OTP" }),
});

const PasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    rePassword: z.string(),
  })
  .refine((data) => data.newPassword === data.rePassword, {
    message: "Passwords don't match",
    path: ["rePassword"],
  });

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const { mutateAsync: resetPassword } = useResetPassword();
  const { mutateAsync: sendOTP } = useSendOTP();
  const email = searchParams.get("email") || "";
  const otp = searchParams.get("otp") || "";
  const step = useMemo(() => (email && otp ? "password" : "otp"), [email, otp]);

  const otpForm = useForm<z.infer<typeof OTPSchema>>({
    resolver: zodResolver(OTPSchema),
    defaultValues: {
      otp: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof PasswordSchema>>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      newPassword: "",
      rePassword: "",
    },
  });

  const onOTPSubmit = async (data: z.infer<typeof OTPSchema>) => {
    try {
      setError(null);
      setIsSubmitting(true);
      await authApi.verifyOTP({ email, otp: data.otp });
      router.push(`?email=${encodeURIComponent(email)}&otp=${data.otp}`);
      otpForm.reset();
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

  const onPasswordSubmit = async (data: z.infer<typeof PasswordSchema>) => {
    try {
      setError(null);
      setIsSubmitting(true);
      const payload: ResetPasswordPayload = {
        otp: otp || "",
        email: email || "",
        newpassword: data.newPassword,
      };
      await resetPassword(payload);
      router.push(`/login?email=${encodeURIComponent(email)}`);
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

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

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

  useEffect(() => {
    if (!email) {
      router.replace("/login");
    }
  }, [email, router]);

  if (!email) return;

  return (
    <Card className="w-full max-w-sm relative z-10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription className="text-gray-400">
          {step === "otp" ? (
            <>
              Please enter the one-time password sent to your email address.
              Didn&apos;t receive the otp?{" "}
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
            </>
          ) : (
            "Enter your new password below."
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}
        {step === "otp" ? (
          <Form {...otpForm} key={step}>
            <form onSubmit={otpForm.handleSubmit(onOTPSubmit)}>
              <FormField
                control={otpForm.control}
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
                            otpForm.handleSubmit(onOTPSubmit)();
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
        ) : (
          <Form {...passwordForm} key={step}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        disabled={isSubmitting || isResending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="rePassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        disabled={isSubmitting || isResending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || isResending}
              >
                {(isSubmitting || isResending) && (
                  <Icons.spinner className="animate-spin" />
                )}
                Reset Password
              </Button>
            </form>
          </Form>
        )}

        <div className="text-center text-sm text-muted-foreground">
          Back to{" "}
          <Link
            href="/login"
            className="underline underline-offset-4 text-primary"
          >
            Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
