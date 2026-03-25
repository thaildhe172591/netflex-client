"use client";

import { LoginForm } from "@/app/[locale]/(auth)/login/_components/login-form";
import { Modal } from "../_components/modal";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoginModal() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const callback = searchParams.get("callback") || "/";
  const [isSuccessTransition, setIsSuccessTransition] = useState(false);

  const resolveCallbackUrl = () => {
    const [path, queryString = ""] = callback.split("?");
    const params = new URLSearchParams(queryString);
    params.delete("_modal");
    const nextQuery = params.toString();
    return nextQuery ? `${path}?${nextQuery}` : path;
  };

  useEffect(() => {
    if (pathname === "/login") {
      setIsSuccessTransition(false);
    }
  }, [pathname]);

  return (
    <Modal
      className="sm:max-w-sm"
      origin="/login"
      title={isSuccessTransition ? "" : "Login to your account"}
      description={
        isSuccessTransition ? "" : "Enter your email below to login to your account"
      }
    >
      <AnimatePresence initial={false}>
        {!isSuccessTransition && (
          <motion.div
            key={`login-modal-content-${pathname}`}
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12, filter: "blur(2px)" }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            <LoginForm
              onSuccess={() => {
                setIsSuccessTransition(true);
                window.setTimeout(() => {
                  router.push(resolveCallbackUrl());
                }, 260);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
