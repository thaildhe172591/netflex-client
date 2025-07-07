"use client";

import { Icons } from "@/components/common";
import { useAuth } from "@/hooks";
import { getDeviceId } from "@/lib/device";
import { CallbackLoginSocialPayload } from "@/models";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect } from "react";

interface IProps {
  params: Promise<{ social: string }>;
}

export default function CallbackSocialPage({ params }: IProps) {
  const { callbackLoginSocial } = useAuth({ enabled: false });
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { social: provider } = use(params);

  useEffect(() => {
    async function handleCallback() {
      if (!code || !provider) {
        router.push(
          `/login?error=${encodeURIComponent("Invalid request")}&_modal=0`
        );
        return;
      }

      try {
        const url = new URL(window.location.href);
        const payload: CallbackLoginSocialPayload = {
          provider,
          code,
          redirectUrl: `${url.origin}${url.pathname}`,
          deviceId: getDeviceId(),
        };
        await callbackLoginSocial(payload);
        router.push("/");
      } catch {
        const error = encodeURIComponent(
          `${provider.toUpperCase()} login failed.`
        );
        router.push(`/login?error=${error}&_modal=0`);
      }
    }

    handleCallback();
  }, [callbackLoginSocial, code, provider, router]);

  return <Icons.spinner className="animate-spin" />;
}
