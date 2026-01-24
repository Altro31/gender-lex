"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { exportAnalysis, type ExportFormat } from "@/lib/export/export-utils";
import { Dialog as DialogPrimitive } from "@base-ui/react";
import { t } from "@lingui/core/macro";
import type { Analysis } from "@repo/db/models";
import { FileCode, FileDown, FileText } from "lucide-react";
import { toast } from "sonner";

interface ExportDialogPayload {
  analysis: Analysis;
}

const exportDialog = DialogPrimitive.createHandle<ExportDialogPayload>();

export function ExportDialog() {
  const [_, setValue] = useLocalStorage("last-export");

  const handleExport =
    ({ analysis }: ExportDialogPayload) =>
    (format: ExportFormat) =>
    () => {
      setValue(format);
      try {
        exportAnalysis(analysis, format);
        toast.success(t`Export started successfully`);

        exportDialog.close();
      } catch (error) {
        console.error("Export error:", error);
        const errorMessage =
          error instanceof Error ? error.message : t`Failed to export analysis`;
        toast.error(errorMessage);
      }
    };

  return (
    <Dialog handle={exportDialog}>
      {({ payload }) => {
        if (!payload) return null;
        return (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t`Export Analysis`}</DialogTitle>
              <DialogDescription>
                {t`Choose a format to export your analysis report`}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-4">
              <Button
                variant="outline"
                className="justify-start gap-3 h-auto py-4"
                onClick={handleExport(payload)("pdf")}
              >
                <FileDown className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">PDF</div>
                  <div className="text-sm text-muted-foreground">
                    {t`Professional formatted document for printing`}
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start gap-3 h-auto py-4"
                onClick={handleExport(payload)("markdown")}
              >
                <FileCode className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Markdown</div>
                  <div className="text-sm text-muted-foreground">
                    {t`Formatted text for documentation and notes`}
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start gap-3 h-auto py-4"
                onClick={handleExport(payload)("txt")}
              >
                <FileText className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">{t`Plain Text`}</div>
                  <div className="text-sm text-muted-foreground">
                    {t`Simple text format compatible with any editor`}
                  </div>
                </div>
              </Button>
            </div>
          </DialogContent>
        );
      }}
    </Dialog>
  );
}

export function ExportDialogTrigger(
  props: Omit<DialogPrimitive.Trigger.Props, "handle">
) {
  return <DialogTrigger {...props} handle={exportDialog} />;
}
