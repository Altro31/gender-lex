import { setServerLocale } from "@/locales/request";
import AnalysisDetailsContainer from "@/sections/analysis/details/analysis-details-container";
import { t } from "@lingui/core/macro";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  await setServerLocale();

  return {
    title: t`Analysis detail | GenderLex`,
    description: t`View details of the current analysis`,
  };
}

export default async function AnalysisDetailsPage() {
  await setServerLocale();
  return <AnalysisDetailsContainer />;
}
