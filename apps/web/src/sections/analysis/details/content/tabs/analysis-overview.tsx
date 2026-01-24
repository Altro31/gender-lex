"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AnalysisContentOriginalText from "@/sections/analysis/details/content/components/analysis-content-original-text";
import { useAnalysisStream } from "@/sections/analysis/hooks/use-analysis-stream";
import { t } from "@lingui/core/macro";
import { AdditionalContextEvaluationItemBase } from "@repo/db/models";
import { useParams } from "next/navigation";
import type { ParamsOf } from "../../../../../../.next/types/routes";
import AnalysisContext from "@/components/analysis-context";

export default function AnalysisOverview() {
  const { id } = useParams<ParamsOf<"/[locale]/analysis/[id]">>();
  const [analysis, { isFetching }] = useAnalysisStream(id);
  return (
    <>
      {/* Original Text */}

      <AnalysisContentOriginalText
        text={analysis?.originalText ?? ""}
        isFetching={isFetching}
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent>
            <div className="text-sm">{t`Biased terms`}</div>
            {isFetching && !analysis?.biasedTerms ? (
              <Skeleton className="mt-1 h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-red-600">
                {analysis?.biasedTerms?.length ?? 0}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-sm">{t`Biased Metaphors`}</div>
            {isFetching && !analysis?.biasedMetaphors ? (
              <Skeleton className="mt-1 h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-orange-600">
                {analysis?.biasedMetaphors?.length ?? 0}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-sm">{t`Alternatives`}</div>
            {isFetching && !analysis?.modifiedTextAlternatives ? (
              <Skeleton className="mt-1 h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-blue-600">
                {analysis?.modifiedTextAlternatives?.length ?? 0}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-sm">{t`Average Influence`}</div>
            {isFetching && !analysis?.additionalContextEvaluation ? (
              <Skeleton className="mt-1 h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-green-600">
                {analysis?.additionalContextEvaluation
                  ? Math.round(
                      // @ts-expect-error - additionalContextEvaluation has dynamic keys from the model
                      (Object.values(
                        analysis?.additionalContextEvaluation
                      ).reduce(
                        // @ts-expect-error - reduce callback type inference needs explicit typing
                        (
                          acc: number,
                          item: AdditionalContextEvaluationItemBase
                        ) => acc + (item.influencePercentage || 0),
                        0
                      ) /
                        5) *
                        100
                    )
                  : 0}
                %
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Conclusion */}
      {isFetching && !analysis?.conclusion ? (
        <Card>
          <CardHeader>
            <CardTitle>{t`Conclusion`}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      ) : analysis?.conclusion ? (
        <AnalysisContext id="conclusion" content={analysis?.conclusion}>
          <Card>
            <CardHeader>
              <CardTitle>{t`Conclusion`}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-muted-foreground">
                {analysis?.conclusion}
              </p>
            </CardContent>
          </Card>
        </AnalysisContext>
      ) : null}
    </>
  );
}
