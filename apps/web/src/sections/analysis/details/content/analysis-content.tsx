import { TabsContent } from "@/components/ui/tabs";
import AnalysisAlternatives from "@/sections/analysis/details/content/tabs/analysis-alternatives";
import AnalysisContextEvaluation from "@/sections/analysis/details/content/tabs/analysis-context";
import AnalysisImpact from "@/sections/analysis/details/content/tabs/analysis-impact";
import AnalysisOverview from "@/sections/analysis/details/content/tabs/analysis-overview";
import AnalysisTerms from "@/sections/analysis/details/content/tabs/analysis-terms";

export default function AnalysisContent() {
  return (
    <>
      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-6">
        <AnalysisOverview />
      </TabsContent>

      {/* Terms Tab */}
      <TabsContent value="terms" className="space-y-6">
        <AnalysisTerms />
      </TabsContent>

      {/* Context Tab */}
      <TabsContent value="context" className="space-y-6">
        <AnalysisContextEvaluation />
      </TabsContent>

      {/* Alternatives Tab */}
      <TabsContent value="alternatives" className="space-y-6">
        <AnalysisAlternatives />
      </TabsContent>

      {/* Impact Tab */}
      <TabsContent value="impact" className="space-y-6">
        <AnalysisImpact />
      </TabsContent>
    </>
  );
}
