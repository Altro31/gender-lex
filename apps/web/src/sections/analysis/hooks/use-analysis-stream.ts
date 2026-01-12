import { getApiProxyClient } from "@/lib/api/proxy-client";
import { handleStream } from "@/lib/api/util";
import { Analysis } from "@repo/db/models";
import {AnalysisApp} from "@repo/types/api"
import {
  experimental_streamedQuery as streamedQuery,
  useQuery,
} from "@tanstack/react-query";

const proxyClient = getApiProxyClient<AnalysisApp>()

export function useAnalysisStream(id: string) {
  const fetchAnalysis = async function* () {
    const stream = await handleStream<Analysis>(
      proxyClient.analysis[":id"].$get({
        param: { id },
      }),
    );

    for await (const update of stream) {
      yield update;
    }
  };

  const { data, ...rest } = useQuery({
    queryKey: [`analysis-${id}`],
    queryFn: streamedQuery({ streamFn: fetchAnalysis, refetchMode: "replace" }),
  });

  const analysis = data?.at(-1);
  return [analysis, rest] as const;
}
