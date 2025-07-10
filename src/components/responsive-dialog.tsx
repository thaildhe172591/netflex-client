import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

export function ResponsiveDialog({
  children,
  isOpen,
  setIsOpen,
  title,
  description,
  className,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description?: string;
  className?: string;
}) {
  const isMobile = useIsMobile();
  if (!isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className={cn("bg-card overflow-y-hidden gap-6 px-0", className)}
        >
          <DialogHeader className="gap-0 px-6">
            <DialogTitle className="text-base">{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          <ScrollArea className="max-h-[80vh] px-5">
            <div className="mx-1">{children}</div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="bg-card overflow-y-hidden">
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DrawerHeader>
        <ScrollArea className="px-5 pb-6 overflow-auto">
          <div className="mx-1">{children}</div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
