import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import RegisterForm from "@/sections/auth/register/form/register-form";
import RegisterFormContainer from "@/sections/auth/register/form/register-form-container";
import { t } from "@lingui/core/macro";

import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";

export default function RegisterContainer() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center  p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" render={<Link href="/" />}>
            <ArrowLeft />
            {t`Back to home`}
          </Button>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1 pb-2">
            <div className="mb-1 flex justify-center">
              <div className="bg-primary flex size-12 items-center justify-center rounded-xl">
                <Lock className="size-6 " />
              </div>
            </div>
            <CardTitle className="text-center text-2xl font-bold">
              {t`Create account`}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              {t`Join our platform in seconds`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Register Form */}
            <RegisterFormContainer>
              <RegisterForm />
            </RegisterFormContainer>
            <div className="text-center"></div>
          </CardContent>
          <CardFooter>
            <p className="flex-1 text-sm text-center text-muted-foreground">
              {t`Do you already have an account?`}{" "}
              <Link
                href="/auth/login"
                className={cn(buttonVariants({ variant: "link" }), "p-0")}
              >
                {t`Sing in here`}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
