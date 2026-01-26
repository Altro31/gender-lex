"use client";

import RHFComboboxAutofetcher from "@/components/rhf/rhf-select-autofetcher";
import { Button } from "@/components/ui/button";
import type { HomeSchema } from "@/sections/home/form/home-schema";
import { CreatePresetDialogTrigger } from "@/sections/preset/components/dialogs/create-preset-dialog";
import { getPresetsSelect } from "@/services/preset";
import { t } from "@lingui/core/macro";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

export default function PresetSelect() {
  const { setValue } = useFormContext<HomeSchema>();
  useEffect(() => {
    (async () => {
      const cookie = await cookieStore.get("preset.last-used");
      const value = cookie?.value;
      if (!value) return;
      setValue(
        "preset",
        { id: value },
        { shouldTouch: true, shouldDirty: true, shouldValidate: true }
      );
    })();
  }, [setValue]);
  return (
    <RHFComboboxAutofetcher
      name="preset"
      fetcherFunc={getPresetsSelect}
      placeholder="Using Default Preset"
      getKey={(i) => i.id}
      getLabel={(i) => i.name}
      renderValue={(i) => i.name}
      renderItem={(i) => i.name}
      renderLastItem={
        <CreatePresetDialogTrigger
          render={
            <Button size="sm" variant="outline" className="w-full">
              <Plus />
              {t`New Preset`}
            </Button>
          }
        />
      }
    />
  );
}
