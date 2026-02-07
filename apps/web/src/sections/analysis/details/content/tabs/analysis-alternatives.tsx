"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalysisStream } from "@/sections/analysis/hooks/use-analysis-stream";
import { t } from "@lingui/core/macro";
import { useParams } from "next/navigation";
import type { ParamsOf } from "../../../../../../.next/types/routes";

export default function AnalysisAlternatives() {
  const { id } = useParams<ParamsOf<"/[locale]/analysis/[id]">>();
  const [analysis, { isFetching }] = useAnalysisStream(id);
  return (
    <>
      {isFetching && !analysis?.modifiedTextAlternatives ? (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-6 w-32" />
                </CardTitle>
                <CardDescription>
                  <Skeleton className="h-4 w-64" />
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : analysis?.modifiedTextAlternatives?.length ? (
        analysis.modifiedTextAlternatives.map((alternative, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>
                {t`Alternative`} {alternative?.alternativeNumber}
              </CardTitle>
              <CardDescription>
                {t`Modified version of the original text without gender bias`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-background p-4">
                <p className="leading-relaxed">
                  {alternative?.alternativeText}
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="mb-3 font-medium text-muted-foreground">
                  {t`Modifications Made`}:
                </h4>
                <div className="space-y-3">
                  {alternative?.modificationsExplanation?.map(
                    (mod, modIndex) => (
                      <div
                        key={modIndex}
                        className="space-y-2 rounded-lg border p-3"
                      >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <h5 className="mb-1 text-sm font-medium text-red-700">
                              {t`Original`}:
                            </h5>
                            <p className="rounded bg-background p-2 text-sm">
                              "{mod?.originalFragment}"
                            </p>
                          </div>
                          <div>
                            <h5 className="mb-1 text-sm font-medium text-green-700">
                              {t`Modified`}:
                            </h5>
                            <p className="rounded bg-background p-2 text-sm">
                              "{mod?.modifiedFragment}"
                            </p>
                          </div>
                        </div>
                        <div>
                          <h5 className="mb-1 text-sm font-medium text-muted-foreground">
                            {t`Reason`}:
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            {mod?.reason}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-center text-sm text-muted-foreground py-8">
          {t`No text alternatives generated`}
        </p>
      )}
    </>
  );
}
