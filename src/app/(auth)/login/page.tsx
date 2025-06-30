"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { LoginForm } from "./_components/login-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const callback = searchParams.get("callback") || "/";
  const error = searchParams.get("error");

  return (
    <div className="w-full max-w-sm relative z-10 backdrop-blur-sm">
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <LoginForm
            email={email}
            err={error}
            onSuccess={() => callback && router.push(callback)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
