import { createFileRoute } from "@tanstack/react-router";
import ModelsContainer from "@/sections/model/list/models-container";

export const Route = createFileRoute("/models")({
  component: ModelsPage,
});

function ModelsPage() {
  const searchParams = Route.useSearch();
  return <ModelsContainer searchParams={Promise.resolve(searchParams)} />;
}
