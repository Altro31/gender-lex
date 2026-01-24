import AnalysesList from "@/sections/analysis/list/analyses-list";
import { findAnalyses } from "@/services/analysis";

interface Props {
  searchParams: Promise<{ page?: string; status?: string; q?: string }>;
}

export default async function AnalysesListContainer({ searchParams }: Props) {
  const query = await searchParams;
  const { data, error } = await findAnalyses(query as any);
  if (error) {
    throw error;
  }
  return <AnalysesList analyses={data} />;
}
