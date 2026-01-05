"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { redoAnalysis } from "@/services/analysis";
import { UseRenderRenderProp } from "@base-ui/react";
import { useRouter } from "next/navigation";
import { t } from "@lingui/core/macro";
import { Analysis } from "@repo/db/models";
import { Eye, RotateCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { DeleteAnalysisAlertDialogTrigger } from "./dialogs/delete-analysis-alert-dialog";

interface Props {
  analysis: Analysis;
  renderTrigger: UseRenderRenderProp;
}

export function AnalysisActions({ analysis, renderTrigger }: Props) {
  const router = useRouter();
  const handleRedoAnalysis = (analysis: Analysis) => async () => {
    const { error, data } = await redoAnalysis(analysis.id);
    if (error) {
      toast.error((error.value as any).message);
      return;
    }
    router.push(`/analysis/${data.id}`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={renderTrigger} />
        <DropdownMenuContent align="start">
          <DropdownMenuItem render={<Link href={`/analysis/${analysis.id}`} />}>
            <Eye className="mr-2 " />
            {t`Details`}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleRedoAnalysis(analysis)}>
            <RotateCcw className="mr-2 " />
            {t`Redo Analysis`}
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DeleteAnalysisAlertDialogTrigger
            payload={{ analysis }}
            nativeButton={false}
            render={<DropdownMenuItem variant="destructive" />}
          >
            <Trash2 className="" />
            {t`Delete`}
          </DeleteAnalysisAlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
