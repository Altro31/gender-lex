import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnalysisActions } from "@/sections/analysis/components/analysis-actions";
import type { findAnalyses } from "@/services/analysis";
import { t } from "@lingui/core/macro";
import { CheckCircle, Clock, Play, Settings, XCircle } from "lucide-react";

interface Props {
  analysis: findAnalyses["Item"];
}

export default function AnalysesListItem({ analysis }: Props) {
  const statusConfig = {
    pending: {
      label: t`Pending`,
      color: "bg-gray-100 text-gray-800",
      icon: Clock,
    },
    analyzing: {
      label: t`Analizing`,
      color: "bg-blue-100 text-blue-800",
      icon: Play,
    },
    done: {
      label: t`Done`,
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
    },
    error: {
      label: t`Error`,
      color: "bg-red-100 text-red-800",
      icon: XCircle,
    },
  };
  const StatusIcon = statusConfig[analysis.status].icon;
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <CardTitle className="text-lg">
                {analysis.name ?? "Sin nombre"}
              </CardTitle>
              <Badge className={statusConfig[analysis.status].color}>
                <StatusIcon className="mr-1 h-3 w-3" />
                {statusConfig[analysis.status].label}
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-4 text-sm">
              <span>
                {t`Preset`}: {analysis.Preset.name}
              </span>
              <span>•</span>
              <span>{new Date(analysis.createdAt).toLocaleDateString()}</span>
            </CardDescription>
          </div>

          <AnalysisActions
            analysis={analysis as any}
            renderTrigger={
              <Button variant="ghost" size="icon">
                <Settings />
              </Button>
            }
          />
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-4">
          {/* Input Preview */}
          <div className="space-y-2">
            <div className="text-muted-foreground text-sm font-medium">
              {t`Analyzed Text`}:
            </div>
            <div className="bg-muted rounded p-2">
              <p className="text-muted-foreground line-clamp-3 text-sm">
                {analysis.originalText}
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-3">
        <div className="flex w-full items-center justify-between text-xs">
          <span>ID: {analysis.id}</span>

          {analysis.updatedAt && (
            <span className="text-muted-foreground">
              {t`Completed at`}: {new Date(analysis.updatedAt).toLocaleString()}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
