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
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const callback = searchParams.get("callback") || "/";
  const error = searchParams.get("error");
  const [isSuccessTransition, setIsSuccessTransition] = useState(false);

  const resolveCallbackUrl = () => {
    const [path, queryString = ""] = callback.split("?");
    const params = new URLSearchParams(queryString);
    params.delete("_modal");
    const nextQuery = params.toString();
    return nextQuery ? `${path}?${nextQuery}` : path;
  };

  return (
    <motion.div
      className="w-full max-w-sm relative z-10 backdrop-blur-sm"
      animate={
        isSuccessTransition
          ? { opacity: 0, y: 18, scale: 0.96, filter: "blur(6px)" }
          : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
      }
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <Card>
        <AnimatePresence initial={false}>
          {!isSuccessTransition && (
            <motion.div
              key="login-header"
              initial={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14, filter: "blur(2px)" }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                  Enter your email below to login to your account
                </CardDescription>
              </CardHeader>
            </motion.div>
          )}
        </AnimatePresence>
        <CardContent className="space-y-6">
          <LoginForm
            email={email}
            err={error}
            onSuccess={() => {
              setIsSuccessTransition(true);
              window.setTimeout(() => {
                router.push(resolveCallbackUrl());
              }, 260);
            }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
