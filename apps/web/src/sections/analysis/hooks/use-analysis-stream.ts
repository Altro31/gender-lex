import { getApiProxyClient } from "@/lib/api/proxy-client";
import { handleStream } from "@/lib/api/util";
import { AnalysisApp } from "@repo/types/api";
import {
  experimental_streamedQuery as streamedQuery,
  useQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const proxyClient = getApiProxyClient<AnalysisApp>();

export function useAnalysisStream(id: string) {
  const router = useRouter();
  const fetchAnalysis = async function* () {
    const stream = await handleStream(
      proxyClient.analysis[":id"].$get({
        param: { id },
      })
    );

    for await (const update of stream) {
      if (update.type === "error") {
        router.push("/");
        toast.error("Failed to access this analysis");
        throw new Error("Error");
      }
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
