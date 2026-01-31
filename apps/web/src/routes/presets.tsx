import { createFileRoute } from "@tanstack/react-router";
import PresetsContainer from "@/sections/preset/list/presets-container";

export const Route = createFileRoute("/presets")({
  component: PresetsPage,
});

function PresetsPage() {
  const searchParams = Route.useSearch();
  return <PresetsContainer searchParams={Promise.resolve(searchParams)} />;
}
