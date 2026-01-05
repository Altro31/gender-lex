import { proxyClient } from "@/lib/api/proxy-client";
import {
  experimental_streamedQuery as streamedQuery,
  useQuery,
} from "@tanstack/react-query";

export function useAnalysisStream(id: string) {
  const fetchAnalysis = async function* () {
    const { data, error } = await proxyClient.analysis({ id }).get();
    if (error) return;
    console.time("Status");
    for await (const update of data) {
      console.timeLog("Status", update.data.status);
      yield update.data;
    }
  };

  const { data, ...rest } = useQuery({
    queryKey: [`analysis-${id}`],
    queryFn: streamedQuery({ streamFn: fetchAnalysis, refetchMode: "replace" }),
  });

  const analysis = data?.at(-1);
  return [analysis, rest] as const;
}
