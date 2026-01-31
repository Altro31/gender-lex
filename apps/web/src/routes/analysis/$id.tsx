import { createFileRoute } from "@tanstack/react-router";
import AnalysisDetailsContainer from "@/sections/analysis/details/analysis-details-container";

export const Route = createFileRoute("/analysis/$id")({
  component: AnalysisDetailsPage,
});

function AnalysisDetailsPage() {
  return <AnalysisDetailsContainer />;
}
