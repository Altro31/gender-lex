"use client";

import { Form } from "@/components/ui/form";
import { MultiStepViewer } from "@/sections/model/form/model-form";
import { ModelSchema } from "@/sections/model/form/model-schema";
import { editModel, type findModels } from "@/services/model";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
  model: findModels["Item"];
  onSuccess?: () => void;
}

export default function EditModelFormContainer({ model, onSuccess }: Props) {
  const form = useForm<ModelSchema>({
    resolver: standardSchemaResolver(ModelSchema),
    defaultValues: {
      apiKey: model.apiKey ?? "",
      connection: {
        identifier: model.connection.identifier ?? "",
        url: model.connection.url ?? "",
      },
      name: model.name ?? "",
      settings: { temperature: model.settings.temperature ?? 0.8 },
    },
    mode: "onChange",
  });
  const doSthAction = useAction(editModel, {
    onSuccess: () => {
      toast.success("Ok");
      onSuccess?.();
    },
    onError: ({ error }) => {
      console.log("error", error);
      toast.error("Error");
    },
  });

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) =>
            doSthAction.executeAsync([model.id, data])
          )}
          className="mx-auto flex w-full max-w-3xl flex-col gap-2 p-2"
        >
          <MultiStepViewer />
        </form>
      </Form>
    </div>
  );
}
