"use client";

import { Button } from "@/components/ui/button";
import ModelListItem from "@/sections/model/list/model-list-item";
import type { findModels } from "@/services/model";
import { t } from "@lingui/core/macro";
import { Plus, Settings } from "lucide-react";
import { useQueryState } from "nuqs";
import { CreateModelDialogTrigger } from "../components/dialogs/create-model-dialog";

interface Props {
  modelsResponse: findModels.Success;
}

export default function ModelList({ modelsResponse: models }: Props) {
  const [searchTerm] = useQueryState("q");
  return models.length === 0 ? (
    <div className="py-6 text-center">
      <div className="mb-4 text-muted">
        <Settings className="mx-auto size-16" />
      </div>
      <h3 className="mb-2 text-lg font-medium">
        {searchTerm ? t`No results found` : t`There are no models configured`}
      </h3>
      <p className="mb-4 text-muted-foreground">
        {searchTerm
          ? t`Try other search terms`
          : t`Start by creating your first model`}
      </p>
      {!searchTerm && (
        <CreateModelDialogTrigger render={<Button />}>
          <Plus />
          {t`Create First Model`}
        </CreateModelDialogTrigger>
      )}
    </div>
  ) : (
    <ul className="grid max-grid-cols-md gap-2">
      {models.map((model) => (
        <ModelListItem model={model} key={model.id} />
      ))}
    </ul>
  );
}
