"use client";

import * as React from "react";
import { UploadCloud, XCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { HlsVideoPlayer } from "./hls-video-player";

interface FileUploaderProps {
  value?: File;
  onChange: (file: File | undefined) => void;
  type?: "image" | "video" | "file" | "hls";
  allowedExtensions?: string[];
  className?: string;
}

export function FileUploader({
  value,
  onChange,
  type = "file",
  allowedExtensions,
  className,
}: FileUploaderProps) {
  const [preview, setPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (value) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreview(null);
  }, [value]);

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onChange(acceptedFiles[0]);
      } else {
        onChange(undefined);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: allowedExtensions
      ? allowedExtensions.reduce((acc, ext) => {
          acc[`${type || "application"}/${ext.substring(1)}`] = [ext];
          return acc;
        }, {} as Record<string, string[]>)
      : type === "image"
      ? { "image/*": [".jpeg", ".png", ".jpg"] }
      : { "video/*": [".mp4", ".mkv"] },
  });

  const handleRemove = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(undefined);
    },
    [onChange]
  );

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex h-32 w-full cursor-pointer items-center justify-center rounded-md",
        "border-2 border-dashed p-4 text-center transition-colors hover:border-foreground",
        isDragActive && "border-blue-500",
        className
      )}
    >
      <input {...getInputProps()} />
      {preview ? (
        <>
          {type === "image" ? (
            <Image
              src={preview}
              alt="Preview"
              className="h-full w-full object-contain"
              width={200}
              height={300}
            />
          ) : type === "video" ? (
            <video
              src={preview}
              controls
              className="h-full w-full object-contain"
            />
          ) : type === "hls" ? (
            <HlsVideoPlayer
              src={preview}
              className="h-full w-full object-contain"
            />
          ) : (
            <p className="text-sm text-center">{value?.name || "File"}</p>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 h-6 w-6 rounded-full"
            onClick={handleRemove}
          >
            <XCircle className="h-5 w-5 text-red-500" />
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <UploadCloud className="mb-2 h-8 w-8" />
          <p className="text-sm">Drag & drop {type} here, or click to select</p>
          <p className="text-xs">
            {type === "image"
              ? "(PNG, JPG)"
              : type === "video"
              ? "(MP4, MKV)"
              : allowedExtensions
              ? `(${allowedExtensions
                  .map((ext) => ext.substring(1))
                  .join(", ")})`
              : ""}
          </p>
        </div>
      )}
    </div>
  );
}
