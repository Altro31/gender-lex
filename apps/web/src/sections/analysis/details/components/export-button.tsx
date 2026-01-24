"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { exportAnalysis } from "@/lib/export/export-utils";
import {
  ExportDialog,
  ExportDialogTrigger,
} from "@/sections/analysis/components/dialogs/export-dialog";
import { t } from "@lingui/core/macro";
import type { Analysis } from "@repo/db/models";
import { Download, EllipsisVertical } from "lucide-react";
import { toast } from "sonner";

interface Props {
  analysis: Analysis;
}

export default function ExportButton({ analysis }: Props) {
  const [format] = useLocalStorage("last-export", "pdf");

  const handleExport = () => {
    try {
      exportAnalysis(analysis, format as any);
      toast.success(t`Export started successfully`);
    } catch (error) {
      console.error("Export error:", error);
      const errorMessage =
        error instanceof Error ? error.message : t`Failed to export analysis`;
      toast.error(errorMessage);
    }
  };
  return (
    <>
      <ButtonGroup>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download />
          {format}
          {t`Export`}
        </Button>
        <ExportDialogTrigger
          className="gap-2 bg-transparent"
          payload={{ analysis }}
          render={<Button variant="outline" size="icon-sm" />}
        >
          <EllipsisVertical />
        </ExportDialogTrigger>
      </ButtonGroup>
      <ExportDialog />
    </>
  );
}
