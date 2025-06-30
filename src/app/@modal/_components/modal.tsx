"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ModalProps {
  children: React.ReactNode;
  className?: string;
  origin: string;
  title?: string;
  description?: string;
}

export function Modal({
  children,
  className,
  title,
  description,
  origin,
}: ModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchName = useSearchParams();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (pathname !== origin || searchName.get("_modal") != "1") return;
    setIsOpen(true);
    return () => setIsOpen(false);
  }, [origin, pathname, searchName]);

  const handleOpenChange = () => {
    setIsOpen(false);
    router.back();
  };

  return (
    <Dialog defaultOpen={true} open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className={cn("bg-card overflow-y-hidden", className)}>
        <div>
          <DialogTitle className="text-base">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </div>
        {children}
      </DialogContent>
    </Dialog>
  );
}
