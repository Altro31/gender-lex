import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalysisSidebarTrigger from "@/sections/analysis/details/analysis-sidebar-trigger";
import { t } from "@lingui/core/macro";
import { Suspense } from "react";
import AnalysisHeader from "./analysis-header";
import AnalysisContent from "./content/analysis-content";
import TabsContainer from "./tabs-container";

export default function AnalysisDetailsContainer() {
  return (
    <div className="min-h-screen ">
      <AnalysisSidebarTrigger />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Suspense>
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

          <Suspense>
            <AnalysisContent />
          </Suspense>
        </TabsContainer>
      </div>
    </div>
  );
}
