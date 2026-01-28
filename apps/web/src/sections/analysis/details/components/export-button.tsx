"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { exportAnalysis, type ExportFormat } from "@/lib/export/export-utils";
import {
  ExportDialog,
  ExportDialogTrigger,
} from "@/sections/analysis/components/dialogs/export-dialog";
import { t } from "@lingui/core/macro";
import type { Analysis } from "@repo/db/models";
import {
  Download,
  EllipsisVertical,
  File,
  FileCode,
  FileImage,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  analysis: Analysis;
}

const icons = {
  txt: FileText,
  markdown: FileCode,
  pdf: FileImage,
} satisfies Record<ExportFormat, LucideIcon>;

export default function ExportButton({ analysis }: Props) {
  const [format] = useLocalStorage<ExportFormat>("last-export");
  const Icon = icons[format ?? "pdf"];
  const handleExport = () => {
    try {
      exportAnalysis(analysis, format ?? "pdf");
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
        <Button
          disabled={analysis.status !== "done"}
          variant="outline"
          size="sm"
          onClick={handleExport}
        >
          <Icon />
          {t`Export`}
        </Button>
        <ExportDialogTrigger
          disabled={analysis.status !== "done"}
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
