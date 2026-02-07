"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalysisStream } from "@/sections/analysis/hooks/use-analysis-stream";
import { t } from "@lingui/core/macro";
import { useParams } from "next/navigation";
import type { ParamsOf } from "../../../../../../.next/types/routes";
import { Badge } from "@/components/ui/badge";
import AnalysisContext from "@/components/analysis-context";

export default function AnalysisContextEvaluation() {
  const { id } = useParams<ParamsOf<"/[locale]/analysis/[id]">>();
  const [analysis, { isFetching }] = useAnalysisStream(id);
  return (
    <>
      {isFetching && !analysis?.additionalContextEvaluation ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-6 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      ) : analysis?.additionalContextEvaluation ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Stereotype */}
          <AnalysisContext
            id="analysis.additionalContextEvaluation.stereotype"
            content={analysis?.additionalContextEvaluation.stereotype}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      analysis?.additionalContextEvaluation.stereotype?.presence
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  />
                  {t`Stereotypes`}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t`Influence`}</span>
                  <span className="font-bold">
                    {Math.round(
                      (analysis?.additionalContextEvaluation.stereotype
                        ?.influencePercentage ?? 0) * 100
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    (analysis?.additionalContextEvaluation.stereotype
                      ?.influencePercentage ?? 0) * 100
                  }
                />
                <p className="text-sm text-muted-foreground">
                  {
                    analysis?.additionalContextEvaluation.stereotype
                      ?.explanation
                  }
                </p>
                {(analysis?.additionalContextEvaluation.stereotype?.examples
                  ?.length ?? 0) > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                      {t`Examples`}:
                    </h4>
                    <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      {analysis?.additionalContextEvaluation.stereotype?.examples?.map(
                        (example, i) => (
                          <li key={i}>{example}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </AnalysisContext>

          {/* Power Asymmetry */}
          <AnalysisContext
            id="analysis.additionalContextEvaluation.powerAsymmetry"
            content={analysis?.additionalContextEvaluation.powerAsymmetry}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      analysis?.additionalContextEvaluation.powerAsymmetry
                        ?.presence
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  />
                  {t`Power Asymmetry`}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t`Influence`}</span>
                  <span className="font-bold">
                    {Math.round(
                      (analysis?.additionalContextEvaluation.powerAsymmetry
                        ?.influencePercentage ?? 0) * 100
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    (analysis?.additionalContextEvaluation.powerAsymmetry
                      ?.influencePercentage ?? 0) * 100
                  }
                />
                <p className="text-sm text-muted-foreground">
                  {
                    analysis?.additionalContextEvaluation.powerAsymmetry
                      ?.explanation
                  }
                </p>
                {(analysis?.additionalContextEvaluation.powerAsymmetry?.examples
                  ?.length ?? 0) > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                      {t`Examples`}:
                    </h4>
                    <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      {analysis?.additionalContextEvaluation.powerAsymmetry?.examples?.map(
                        (example, i) => (
                          <li key={i}>{example}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </AnalysisContext>

          {/* Gender Representation Absence */}
          <AnalysisContext
            id="analysis.additionalContextEvaluation
                        .genderRepresentationAbsence"
            content={
              analysis?.additionalContextEvaluation.genderRepresentationAbsence
            }
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      analysis?.additionalContextEvaluation
                        .genderRepresentationAbsence?.presence
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  />
                  {t`Absence of Representation`}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t`Influence`}</span>
                  <span className="font-bold">
                    {Math.round(
                      (analysis?.additionalContextEvaluation
                        .genderRepresentationAbsence?.influencePercentage ??
                        0) * 100
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    (analysis?.additionalContextEvaluation
                      .genderRepresentationAbsence?.influencePercentage ?? 0) *
                    100
                  }
                />
                <p className="text-sm text-muted-foreground">
                  {
                    analysis?.additionalContextEvaluation
                      .genderRepresentationAbsence?.explanation
                  }
                </p>
                {(analysis?.additionalContextEvaluation
                  .genderRepresentationAbsence?.affectedGroups?.length ?? 0) >
                  0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                      {t`Affected Groups`}:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis?.additionalContextEvaluation.genderRepresentationAbsence?.affectedGroups?.map(
                        (group, i) => (
                          <Badge key={i} variant="outline">
                            {group}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </AnalysisContext>

          {/* Intersectionality */}
          <AnalysisContext
            id="analysis.additionalContextEvaluation.intersectionality"
            content={analysis?.additionalContextEvaluation.intersectionality}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      analysis?.additionalContextEvaluation.intersectionality
                        ?.presence
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  />
                  {t`Intersectionality`}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t`Influence`}</span>
                  <span className="font-bold">
                    {Math.round(
                      (analysis?.additionalContextEvaluation.intersectionality
                        ?.influencePercentage ?? 0) * 100
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    (analysis?.additionalContextEvaluation.intersectionality
                      ?.influencePercentage ?? 0) * 100
                  }
                />
                <p className="text-sm text-muted-foreground">
                  {
                    analysis?.additionalContextEvaluation.intersectionality
                      ?.explanation
                  }
                </p>
                {(analysis?.additionalContextEvaluation.intersectionality
                  ?.excludedGroups?.length ?? 0) > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                      {t`Excluded Groups`}:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis?.additionalContextEvaluation.intersectionality?.excludedGroups?.map(
                        (group, i) => (
                          <Badge key={i} variant="outline">
                            {group}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </AnalysisContext>

          {/* Systemic Biases */}
          <AnalysisContext
            id="analysis.additionalContextEvaluation.systemicBiases"
            content={analysis?.additionalContextEvaluation.systemicBiases}
          >
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      analysis?.additionalContextEvaluation.systemicBiases
                        ?.presence
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  />
                  {t`Systemic Biases`}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t`Influence`}</span>
                  <span className="font-bold">
                    {Math.round(
                      (analysis?.additionalContextEvaluation.systemicBiases
                        ?.influencePercentage ?? 0) * 100
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    (analysis?.additionalContextEvaluation.systemicBiases
                      ?.influencePercentage ?? 0) * 100
                  }
                />
                <p className="text-sm text-muted-foreground">
                  {
                    analysis?.additionalContextEvaluation.systemicBiases
                      ?.explanation
                  }
                </p>
                {(analysis?.additionalContextEvaluation.systemicBiases?.examples
                  ?.length ?? 0) > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                      {t`Examples`}:
                    </h4>
                    <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      {analysis?.additionalContextEvaluation.systemicBiases?.examples?.map(
                        (example, i) => (
                          <li key={i}>{example}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </AnalysisContext>
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground py-8">
          {t`No context evaluation data available`}
        </p>
      )}
    </>
  );
}
