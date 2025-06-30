"use client";

import { useRouter } from "next/navigation";
import { RegisterForm } from "./_components/register-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-sm relative z-10 backdrop-blur-sm">
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Join us today! Enter your details below to create your new account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RegisterForm
            onSuccess={(data) => {
              if (typeof data === "string") {
                router.push(`/login?email=${encodeURIComponent(data)}`);
              }
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
