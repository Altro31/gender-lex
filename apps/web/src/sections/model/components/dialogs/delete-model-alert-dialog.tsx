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
import { Button } from "@/components/ui/button";
import { deleteModel, type findModels } from "@/services/model";
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react";
import { t } from "@lingui/core/macro";
import { useAction } from "next-safe-action/hooks";

interface DeleteModelPayload {
  model: findModels["Item"];
  onDelete?: () => void;
}

const deleteModelAlertDialog =
  AlertDialogPrimitive.createHandle<DeleteModelPayload>();

export function DeleteModelAlertDialog() {
  const { execute } = useAction(deleteModel);

  const handleDeleteModel = (payload: DeleteModelPayload) => async () => {
    execute(payload.model.id);
    deleteModelAlertDialog.close();
    payload.onDelete?.();
  };

  return (
    <AlertDialog handle={deleteModelAlertDialog}>
      {({ payload }) => {
        if (!payload) return null;
        const { model } = payload;
        return (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t`Are you sure?`}</AlertDialogTitle>
              <AlertDialogDescription>
                {t`This action cannot be undone. \nThe model will be permanently eliminated`}
                <strong className="font-medium"> {model.name}</strong> .
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t`Cancel`}</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={handleDeleteModel(payload)}
                render={<AlertDialogAction />}
              >
                {t`Delete`}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        );
      }}
    </AlertDialog>
  );
}

export function DeleteModelAlertDialogTrigger(
  props: Omit<
    React.ComponentProps<typeof AlertDialogTrigger>,
    "handle" | "payload"
  > & { payload: DeleteModelPayload }
) {
  return <AlertDialogTrigger handle={deleteModelAlertDialog} {...props} />;
}
