"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { clonePreset, type findPresets } from "@/services/preset";
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { useAction } from "next-safe-action/hooks";
import { type MouseEvent } from "react";
import { toast } from "sonner";

interface ClonePresetPayload {
  preset: findPresets["Item"];
  onClone?: () => void;
}

const clonePresetAlertDialog =
  AlertDialogPrimitive.createHandle<ClonePresetPayload>();

export function ClonePresetAlertDialog() {
  const { executeAsync } = useAction(clonePreset, {
    onError(args) {
      console.log(args);
    },
  });

  const handleClonePreset =
    (payload: ClonePresetPayload) =>
    async (e: MouseEvent<HTMLButtonElement>) => {
      payload.onClone?.();
      const promise = executeAsync(payload.preset.id);
      toast.promise(promise, {
        success: (res) => "Éxito",
        error: (error: Error) => "Error",
      });
      clonePresetAlertDialog.close();
    };

  return (
    <AlertDialog handle={clonePresetAlertDialog}>
      {({ payload }) => {
        if (!payload) return null;
        const { preset } = payload;
        return (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t`Are you sure?`}</AlertDialogTitle>
              <AlertDialogDescription>
                <Trans>
                  A new preset will be created with the same name, description
                  and model settings as:{" "}
                  <strong className="font-medium">{preset.name}</strong>
                </Trans>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t`Cancel`}</AlertDialogCancel>
              <AlertDialogAction onClick={handleClonePreset(payload)}>
                {t`Clone`}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        );
      }}
    </AlertDialog>
  );
}

export function ClonePresetAlertDialogTrigger(
  props: Omit<
    React.ComponentProps<typeof AlertDialogTrigger>,
    "handle" | "payload"
  > & { payload: ClonePresetPayload }
) {
  return <AlertDialogTrigger handle={clonePresetAlertDialog} {...props} />;
}
