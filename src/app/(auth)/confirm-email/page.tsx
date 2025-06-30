"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ConfirmEmailForm } from "./_components/confirm-email-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const callback = searchParams.get("callback") || "/";

  useEffect(() => {
    if (!email) {
      router.replace("/login");
    }
  }, [email, router]);

  if (!email) return null;

  return (
    <div className="w-full max-w-sm relative z-10 backdrop-blur-sm">
      <Card>
        <CardHeader>
          <CardTitle>Verify your email address</CardTitle>
          <CardDescription>
            Please enter the one-time password sent to your email.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ConfirmEmailForm
            email={email}
            onSuccess={() => callback && router.push(callback)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
