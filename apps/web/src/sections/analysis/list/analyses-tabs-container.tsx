import { getStatusCount } from "@/services/analysis";
import AnalysesTabs from "./analyses-tabs";

export default async function AnalysesTabsContainer() {
  const statusCount = await getStatusCount();
  return <AnalysesTabs statusCount={statusCount} />;
}
