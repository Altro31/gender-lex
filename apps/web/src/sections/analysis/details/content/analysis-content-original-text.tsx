"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { t } from "@lingui/core/macro";
import { Eye, EyeOff, Settings } from "lucide-react";
import { useState } from "react";

interface Props {
  text: string;
  isFetching?: boolean;
}

export default function AnalysisContentOriginalText({ text, isFetching = false }: Props) {
  const [showMore, setShowMore] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t`Original text`}
          </CardTitle>
          {!isFetching && text && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMore(!showMore)}
              className="gap-2"
            >
              {showMore ? <EyeOff /> : <Eye />}
              {showMore ? t`Show less` : t`Show more`}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isFetching && !text ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <p className={cn("leading-relaxed ", !showMore && "line-clamp-4")}>
            {text}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
