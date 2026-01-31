import { createFileRoute } from "@tanstack/react-router";
import HomeContainer from "@/sections/home/home-container";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <HomeContainer />;
}
