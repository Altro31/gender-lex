"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalysisStream } from "@/sections/analysis/hooks/use-analysis-stream";
import { t } from "@lingui/core/macro";
import { useParams } from "next/navigation";
import type { ParamsOf } from "../../../../../../.next/types/routes";
import { Badge } from "@/components/ui/badge";
import AnalysisContext from "@/components/analysis-context";

export default function AnalysisImpact() {
  const { id } = useParams<ParamsOf<"/[locale]/analysis/[id]">>();
  const [analysis, { isFetching }] = useAnalysisStream(id);
  return (
    <>
      {isFetching && !analysis?.impactAnalysis ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-6 w-24" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : analysis?.impactAnalysis ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AnalysisContext
            id="analysis.impactAnalysis.accessToCare"
            content={analysis?.impactAnalysis.accessToCare}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      analysis?.impactAnalysis.accessToCare?.affected
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  />
                  {t`Access to Care`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        analysis?.impactAnalysis.accessToCare?.affected
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {analysis?.impactAnalysis.accessToCare?.affected
                        ? t`Affected`
                        : t`No Affected`}
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {analysis?.impactAnalysis.accessToCare?.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </AnalysisContext>
          <AnalysisContext
            id="analysis.impactAnalysis.stigmatization"
            content={analysis?.impactAnalysis.stigmatization}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      analysis?.impactAnalysis.stigmatization?.affected
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  />
                  {t`Stigmatization`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        analysis?.impactAnalysis.stigmatization?.affected
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {analysis?.impactAnalysis.stigmatization?.affected
                        ? t`Affected`
                        : t`No Affected`}
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {analysis?.impactAnalysis.stigmatization?.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </AnalysisContext>
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground py-8">
          {t`No impact analysis data available`}
        </p>
      )}
    </>
  );
}
