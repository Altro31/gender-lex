"use client";

import { cn } from "@/lib/utils";
import type { HomeSchema } from "@/sections/home/form/home-schema";
import { t } from "@lingui/core/macro";

import React, {
  createContext,
  use,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type RefObject,
} from "react";
import { useFormContext } from "react-hook-form";

interface Props extends ComponentProps<"div"> {}

interface UploadAreaContextType {
  isDragging: boolean;
  setIsDragging: (value: boolean) => void;
  dropAreaRef: RefObject<HTMLDivElement | null> | undefined;
}

const UploadAreaContext = createContext<UploadAreaContextType>({
  isDragging: false,
  setIsDragging: () => {},
  dropAreaRef: undefined,
});

export function UploadArea({ children, className, ...props }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
    const element = e.currentTarget as HTMLElement;
    const target = e.target as HTMLElement;
    if (element !== target) return;
    setIsDragging(true);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    const item = e.dataTransfer?.items[0];
    if (item?.kind !== "file") return;
    e.preventDefault();
  }

  function handleDragExit(e: React.DragEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    if (target !== dropAreaRef.current) return;
    setIsDragging(false);
  }

  return (
    <UploadAreaContext value={{ isDragging, setIsDragging, dropAreaRef }}>
      <div
        onDragEnter={handleDragEnter}
        className={cn(className, "upload-area relative")}
        {...props}
      >
        <div
          onDragLeave={handleDragExit}
          onDragOver={handleDragOver}
          ref={dropAreaRef}
          data-drag={isDragging || undefined}
          className="absolute top-0 left-0 z-10 hidden size-full p-2 data-drag:block"
        >
          <div className="grid size-full place-content-center rounded-xl border-2 border-dashed backdrop-blur-xs">
            <div className="aspect-video w-[50vw]">{t`Drop file here`}</div>
          </div>
        </div>
        {children}
      </div>
    </UploadAreaContext>
  );
}

export function RHFUploadRegister() {
  const { setIsDragging, dropAreaRef } = use(UploadAreaContext);
  const { setValue, getValues } = useFormContext<HomeSchema>();

  useEffect(() => {
    const element = dropAreaRef?.current;
    function handleDrop(e: DragEvent) {
      e.preventDefault();
      const file = e.dataTransfer?.files.item(0)!;
      setIsDragging(false);
      const files = getValues("filesObj");
      setValue("filesObj", [...files!, { file } as any]);
    }
    element?.addEventListener("drop", handleDrop);
    return () => element?.removeEventListener("drop", handleDrop);
  }, [setValue, getValues, setIsDragging, dropAreaRef]);

  return null;
}
