import { createFileRoute } from "@tanstack/react-router";
import AnalysesContainer from "@/sections/analysis/list/analyses-container";

export const Route = createFileRoute("/analysis/")({
  component: AnalysesPage,
});

function AnalysesPage() {
  const searchParams = Route.useSearch();
  return <AnalysesContainer searchParams={Promise.resolve(searchParams)} />;
}
