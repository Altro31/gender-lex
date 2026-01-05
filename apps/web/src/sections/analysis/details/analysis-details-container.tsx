import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import AnalysisSidebarTrigger from "@/sections/analysis/details/analysis-sidebar-trigger";
import { t } from "@lingui/core/macro";
import { Suspense } from "react";
import AnalysisHeader from "./analysis-header";
import AnalysisContent from "./content/analysis-content";
import TabsContainer from "./tabs-container";

function AnalysisHeaderFallback() {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center gap-4">
        <Skeleton className="h-9 w-48" />
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Skeleton className="mb-2 h-9 w-64" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}

function AnalysisContentFallback() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AnalysisDetailsContainer() {
  return (
    <div className="min-h-screen ">
      <AnalysisSidebarTrigger />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Suspense fallback={<AnalysisHeaderFallback />}>
          <AnalysisHeader />
        </Suspense>
        {/* Content */}
        <TabsContainer className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">{t`Summary`}</TabsTrigger>
            <TabsTrigger value="terms">
              {t`Identified Biased Terms`}
            </TabsTrigger>
            <TabsTrigger value="context">{t`Context`}</TabsTrigger>
            <TabsTrigger value="alternatives">{t`Alternatives`}</TabsTrigger>
            <TabsTrigger value="impact">{t`Impact`}</TabsTrigger>
          </TabsList>

          <Suspense fallback={<AnalysisContentFallback />}>
            <AnalysisContent />
          </Suspense>
        </TabsContainer>
      </div>
    </div>
  );
}
