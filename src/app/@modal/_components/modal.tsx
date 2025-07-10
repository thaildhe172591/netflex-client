"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ResponsiveDialog } from "@/components/responsive-dialog";

interface ModalProps {
  children: React.ReactNode;
  className?: string;
  origin: string;
  title?: string;
  description?: string;
}

export function Modal({ children, title, description, origin }: ModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchName = useSearchParams();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (pathname !== origin || searchName.get("_modal") == "0") return;
    setIsOpen(true);
    return () => setIsOpen(false);
  }, [origin, pathname, searchName]);

  const handleOpenChange = () => {
    setIsOpen(false);
    router.back();
  };
  return (
    <ResponsiveDialog
      isOpen={isOpen}
      setIsOpen={handleOpenChange}
      title={title || ""}
      description={description || ""}
      className="sm:max-w-sm"
    >
      {children}
    </ResponsiveDialog>
  );
}
