"use client";

import RHFSelect from "@/components/rhf/rhf-select";
import RHFSelectAutofetcher from "@/components/rhf/rhf-select-autofetcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PresetSchema } from "@/sections/preset/form/preset-schema";
import { getModelsSelect } from "@/services/model";
import { t } from "@lingui/core/macro";
import type { ModelRole } from "@repo/db/models";
import { Trash2 } from "lucide-react";
import { useWatch } from "react-hook-form";

interface Props {
  index: number;
  onRemove: () => void;
}

const roleOptions = ["primary", "secondary"] as ModelRole[];

export default function ModelConfigCard({ index, onRemove }: Props) {
  const model = useWatch<PresetSchema>({
    name: `Models.${index}`,
  }) as PresetSchema["Models"][number];

  const getRoleColor = (role: ModelRole) => {
    switch (role) {
      case "primary":
        return "border-blue-200 bg-blue-50 dark:bg-blue-950";
      case "secondary":
        return "border-green-200 bg-green-50 dark:bg-green-950";
      default:
        return "border-muted-foreground bg-muted";
    }
  };

  return (
    <Card
      className={`${getRoleColor(model.role)} transition-colors duration-200`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-1">
          <div className="flex-1">
            <CardTitle>
              {model.Model?.name || t`Unconfigured model`} -{" "}
              {model.role || t`Unspecified role`}
            </CardTitle>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic Configuration */}
        <div className="flex flex-wrap items-start gap-2">
          <RHFSelectAutofetcher
            name={`Models.${index}.Model`}
            label={t`Model`}
            placeholder={t`Choose a model`}
            required
            fetcherFunc={getModelsSelect}
            getLabel={(i) => i.name}
            getKey={(item) => item.id}
            renderItem={(item) => item.name}
            renderValue={(item) => item.name}
          />
          <RHFSelect
            name={`Models.${index}.role`}
            options={roleOptions}
            label={t`Role`}
            placeholder={t`Choose the role`}
            getKey={(item) => item}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
}
