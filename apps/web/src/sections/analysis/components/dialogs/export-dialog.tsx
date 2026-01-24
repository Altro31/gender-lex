"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { exportAnalysis, type ExportFormat } from "@/lib/export/export-utils";
import type { Analysis } from "@repo/db/models";
import { FileText, FileCode, FileDown } from "lucide-react";
import { t } from "@lingui/core/macro";
import { toast } from "sonner";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysis: Analysis | undefined;
}

export function ExportDialog({ open, onOpenChange, analysis }: ExportDialogProps) {
  const handleExport = (format: ExportFormat) => {
    if (!analysis) {
      toast.error(t`No analysis data available`);
      return;
    }

    try {
      exportAnalysis(analysis, format);
      toast.success(t`Export started successfully`);
      onOpenChange(false);
    } catch (error) {
      console.error("Export error:", error);
      toast.error(t`Failed to export analysis`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={() => handleExport("pdf")}
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
            onClick={() => handleExport("markdown")}
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
            onClick={() => handleExport("txt")}
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
    </Dialog>
  );
}
