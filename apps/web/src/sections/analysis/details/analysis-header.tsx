"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auth/auth-client";
import { t } from "@lingui/core/macro";
import { Select } from "@lingui/react/macro";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Share2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ParamsOf } from "../../../../.next/types/routes";
import UrlFixer from "../../../components/url-fixer";
import { useAnalysisStream } from "../hooks/use-analysis-stream";

export default function AnalysisHeader() {
  const { data: session } = useSession();
  const { locale, id } = useParams<ParamsOf<"/[locale]/analysis/[id]">>();
  const [analysis, { isFetching }] = useAnalysisStream(id);

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
        <UrlFixer url={`/${locale}/analysis/${analysis?.id}`} />
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
                  },
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
          {isFetching && !analysis?.visibility ? (
            <Skeleton className="h-6 w-20" />
          ) : (
            <Badge
              variant={
                analysis?.visibility === "public" ? "default" : "secondary"
              }
            >
              {" "}
              <Select
                value={analysis?.visibility ?? ""}
                _public="Public"
                _private="Private"
                other="Other"
              />
            </Badge>
          )}
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download />
            {t`Export`}
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Share2 />
            {t`Share`}
          </Button>
        </div>
      </div>
    </div>
  );
}
