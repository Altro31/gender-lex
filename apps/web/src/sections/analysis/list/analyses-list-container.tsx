import AnalysesList from "@/sections/analysis/list/analyses-list";
import { findAnalyses } from "@/services/analysis";

interface Props {
  searchParams: Promise<{ page?: string; status?: string; q?: string }>;
}

export default async function AnalysesListContainer({ searchParams }: Props) {
  const analyses = await findAnalyses((await searchParams) as any);

  return <AnalysesList analyses={analyses} />;
}
