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
import { useConfirmEmail } from "../_hooks/use-confirm-email";
import { useSendOTP } from "@/hooks/use-otp";
import { AlertCircleIcon } from "lucide-react";

const ConfirmEmailSchema = z.object({
  otp: z
    .string()
    .min(6, { message: "Your one-time password must be 6 characters." }),
});

interface IProps extends React.ComponentProps<"div"> {
  email: string;
  err?: string | null;
  onSuccess?: (data?: unknown) => void;
}

export function ConfirmEmailForm({
  className,
  email,
  err,
  onSuccess,
  ...props
}: IProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(err || null);
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
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const onSubmit = async (data: z.infer<typeof ConfirmEmailSchema>) => {
    try {
      setError(null);
      setIsSubmitting(true);
      await confirmEmail({ email, otp: data.otp });
      onSuccess?.();
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
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

      <div className="text-sm text-muted-foreground text-center">
        Didn&apos;t receive the otp?{" "}
        <button
          onClick={handleResendOTP}
          className={cn(
            "hover:underline transition-colors",
            countdown > 0 || isSubmitting || isResending
              ? "text-gray-400 cursor-not-allowed"
              : "text-white cursor-pointer"
          )}
          disabled={countdown > 0 || isSubmitting || isResending}
        >
          {countdown > 0 ? `(${countdown}s)` : "Resend"}
        </button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Back to{" "}
        <Link href="/login" className="underline underline-offset-4 text-white">
          Sign In
        </Link>
      </div>
    </div>
  );
}
