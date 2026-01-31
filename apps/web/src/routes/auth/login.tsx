import { createFileRoute } from "@tanstack/react-router";
import LoginContainer from "@/sections/auth/login/login-container";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

function LoginPage() {
  return <LoginContainer />;
}
