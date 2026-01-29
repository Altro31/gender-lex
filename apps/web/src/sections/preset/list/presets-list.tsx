"use client";

import { Button } from "@/components/ui/button";
import PresetListItem from "@/sections/preset/list/preset-list-item";
import type { findPresets } from "@/services/preset";
import { t } from "@lingui/core/macro";
import { Plus, Zap } from "lucide-react";
import { useQueryState } from "nuqs";
import { ClonePresetAlertDialog } from "../components/dialogs/clone-preset-alert-dialog-content";
import {
  CreatePresetDialog,
  CreatePresetDialogTrigger,
} from "../components/dialogs/create-preset-dialog";
import { DeletePresetAlertDialog } from "../components/dialogs/delete-preset-alert-dialog-content";
import { DetailsPresetDialog } from "../components/dialogs/details-preset-dialog";
import { EditPresetDialog } from "../components/dialogs/edit-preset-dialog";

interface Props {
  presets: findPresets.Data;
}

export default function PresetsList({ presets }: Props) {
  const [q] = useQueryState("q");
  return presets.length === 0 ? (
    <div className="py-12 text-center">
      <div className="mb-4 text-muted-foreground">
        <Zap className="mx-auto size-16" />
      </div>
      <h3 className="mb-2 text-lg font-medium">
        {q ? t`No results found` : t`There are no presets configured`}
      </h3>
      <p className="mb-4 text-muted-foreground">
        {q ? t`Try other search terms` : t`Start by creating your first preset`}
      </p>
      {!q && (
        <CreatePresetDialogTrigger render={<Button />}>
          <Plus />
          {t`Create First Preset`}
        </CreatePresetDialogTrigger>
      )}
      <CreatePresetDialog />
    </div>
  ) : (
    <div className="grid gap-2 max-grid-cols-md">
      {presets.map((preset) => (
        <PresetListItem key={preset.id} preset={preset} />
      ))}
      <ClonePresetAlertDialog />
      <EditPresetDialog />
      <DetailsPresetDialog />
      <DeletePresetAlertDialog />
    </div>
  );
}
