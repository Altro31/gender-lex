"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalysisStream } from "@/sections/analysis/hooks/use-analysis-stream";
import { t } from "@lingui/core/macro";
import { useParams } from "next/navigation";
import type { ParamsOf } from "../../../../../../.next/types/routes";

export default function AnalysisTerms() {
  const { id } = useParams<ParamsOf<"/[locale]/analysis/[id]">>();
  const [analysis, { isFetching }] = useAnalysisStream(id);
  return (
    <>
      {/* Biased Terms */}
      <Card>
        <CardHeader>
          <CardTitle>{t`Identified Biased Terms`}</CardTitle>
          <CardDescription>
            {t`Words or phrases that contain gender bias detected in the text`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isFetching && !analysis?.biasedTerms ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : analysis?.biasedTerms?.length ? (
            analysis.biasedTerms.map((term, index) => (
              <div key={index} className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-medium">
                      "{term?.content}"
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">{t`Influence`}</div>
                    <div className="text-lg font-bold text-red-600">
                      {Math.round((term?.influencePercentage ?? 0) * 100)}%
                    </div>
                  </div>
                </div>
                <Progress
                  value={(term?.influencePercentage ?? 0) * 100}
                  className="h-2"
                />
                <p className="text-sm text-muted-foreground">
                  {term?.explanation}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">
              {t`No biased terms detected`}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Biased Metaphors */}
      <Card>
        <CardHeader>
          <CardTitle>{t`Biased Metaphors`}</CardTitle>
          <CardDescription>
            {t`Metaphorical expressions that perpetuate gender biases`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isFetching && !analysis?.biasedMetaphors ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : analysis?.biasedMetaphors?.length ? (
            analysis.biasedMetaphors.map((metaphor, index) => (
              <div key={index} className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">
                    "{metaphor?.content}"
                  </span>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">{t`Influence`}</div>
                    <div className="text-lg font-bold text-orange-600">
                      {Math.round((metaphor?.influencePercentage ?? 0) * 100)}%
                    </div>
                  </div>
                </div>
                <Progress
                  value={(metaphor?.influencePercentage ?? 0) * 100}
                  className="h-2"
                />
                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      {t`Explanation`}:
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {metaphor?.explanation}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      {t`Historical Context`}:
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {metaphor?.historicalContext}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">
              {t`No biased metaphors detected`}
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
