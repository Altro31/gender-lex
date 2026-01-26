import { useIsAnalysis } from "@/hooks/use-is-analysis";
import { useSession } from "@/lib/auth/auth-client";

export function useIsChatbotAvailable() {
  const { data: session } = useSession();
  const analysisId = useIsAnalysis();

  return Boolean(analysisId) || Boolean(session);
}
