import { createFileRoute } from "@tanstack/react-router";
import RegisterContainer from "@/sections/auth/register/register-container";

export const Route = createFileRoute("/auth/register")({
  component: RegisterPage,
});

function RegisterPage() {
  return <RegisterContainer />;
}
