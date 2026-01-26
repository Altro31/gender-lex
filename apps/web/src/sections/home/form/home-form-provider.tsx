"use client";

import { Form } from "@/components/ui/form";
import { HomeSchema } from "@/sections/home/form/home-schema";
import { prepareAnalysis } from "@/services/analysis";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useRouter } from "next/navigation";
import { useEffect, type PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function HomeFormProvider({
  children,
}: React.PropsWithChildren) {
  const router = useRouter();
  const form = useForm({
    resolver: standardSchemaResolver(HomeSchema),
    defaultValues: {
      filesObj: [],
      files: [],
      text: "",
      selectedPreset: "",
      preset: null as any,
    },
    mode: "all",
  });

  useEffect(
    () =>
      form.watch(async ({ preset }, { name }) => {
        if (name === "preset") {
          await cookieStore.set("preset.last-used", preset?.id ?? "");
        }
      }).unsubscribe,
    [form]
  );

  const onSubmit = async (input: HomeSchema) => {
    const { data, error } = await prepareAnalysis(input);
    if (error) {
      toast.error(error.message);
      return;
    }
    router.push(`/analysis/${data.id}`);
    form.reset({ preset: input.preset });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>{children}</form>
    </Form>
  );
}
