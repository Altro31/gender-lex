"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auth/auth-client";
import {
  ChangeVisibilityAlertDialog,
  ChangeVisibilityAlertDialogTrigger,
} from "@/sections/analysis/components/dialogs/change-visibility-alert-dialog";
import ExportButton from "@/sections/analysis/details/components/export-button";
import { t } from "@lingui/core/macro";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  CopyCheck,
  Lock,
  LockOpen,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ParamsOf } from "../../../../.next/types/routes";
import { useAnalysisStream } from "../hooks/use-analysis-stream";

export default function AnalysisHeader() {
  const { data: session } = useSession();
  const { id } = useParams<ParamsOf<"/[locale]/analysis/[id]">>();
  const [analysis, { isFetching }] = useAnalysisStream(id);
  const [copied, setCopied] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const handleCopy = async () => {
    const url = location.href;
    setCopied(true);
    await window.navigator.clipboard.writeText(url);
    setTimeout(() => setCopied(false), 5000);
    toast.success(t`Copied`);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "analyzing":
        return {
          label: t`Analyzing`,
          color: "bg-blue-100 text-blue-800",
          icon: Clock,
        };
      case "done":
        return {
          label: t`Done`,
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
        };
      default:
        return {
          label: t`Pending`,
          color: "bg-yellow-100 text-yellow-800",
          icon: AlertTriangle,
        };
    }
  };

  const statusConfig = getStatusConfig(analysis?.status ?? "");
  const StatusIcon = statusConfig.icon;

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center gap-4">
        <Link href={session ? "/analysis" : "/"}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft />
            {t`Return to Analysis`}
          </Button>
        </Link>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold ">{t`Analysis Details`}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar />
              {isFetching && !analysis?.createdAt ? (
                <Skeleton className="h-4 w-48" />
              ) : (
                new Date(analysis?.createdAt ?? new Date()).toLocaleDateString(
                  "es-ES",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )
              )}
            </div>
            <div className="flex items-center gap-2">
              <User />
              {isFetching && !analysis?.id ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                <>ID: {analysis?.id}</>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isFetching && !analysis?.status ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <Badge className={statusConfig.color}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {statusConfig.label}
            </Badge>
          )}

          {analysis && <ExportButton analysis={analysis} />}
          {analysis?.visibility && (
            <ButtonGroup>
              <ChangeVisibilityAlertDialogTrigger
                render={<Button size="sm" variant="outline" />}
                payload={{ analysis }}
              >
                {analysis.visibility === "private" ? (
                  <>
                    <Lock />
                    {t`Private`}
                  </>
                ) : (
                  <>
                    <LockOpen />
                    {t`Public`}
                  </>
                )}
              </ChangeVisibilityAlertDialogTrigger>
              <Button
                size="sm"
                disabled={copied}
                onClick={handleCopy}
                variant="outline"
              >
                {copied ? <CopyCheck /> : <Copy />}
              </Button>
            </ButtonGroup>
          )}
          <ChangeVisibilityAlertDialog />
        </div>
      </div>
    </div>
  );
}
