import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { type ComponentProps, type PropsWithChildren } from "react";

export default function DialogScrollArea({
  className,
  ...props
}: ComponentProps<typeof ScrollArea>) {
  return (
    <ScrollArea {...props} className={cn("max-h-[70vh] pr-2", className)} />
  );
}
