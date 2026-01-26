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
import { changeVisibility } from "@/services/analysis";
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Analysis } from "@repo/db/models";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";

interface ChangeVisibilityPayload {
  analysis: Analysis;
}

const changeVisibilityAlertDialog =
  AlertDialogPrimitive.createHandle<ChangeVisibilityPayload>();

export function ChangeVisibilityAlertDialog() {
  const queryClient = useQueryClient();
  const { executeAsync, status: deleteStatus } = useAction(changeVisibility);
  const isPending = deleteStatus === "executing";

  const handlechangeVisibility = (analysis: Analysis) => async () => {
    if (!isPending) {
      await executeAsync({
        id: analysis.id,
        visibility: analysis.visibility === "private" ? "public" : "private",
      });
      await queryClient.invalidateQueries({
        queryKey: [`analysis-${analysis.id}`],
      });
      changeVisibilityAlertDialog.close();
    }
  };

  return (
    <AlertDialog handle={changeVisibilityAlertDialog}>
      {({ payload }) => {
        if (!payload) return null;
        const { analysis } = payload;
        return (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t`Are you sure?`}</AlertDialogTitle>
              <AlertDialogDescription>
                {analysis.visibility === "private" ? (
                  <Trans>
                    By changing the visibility of the current analysis as{" "}
                    <strong>{t`Public`}</strong>, anyone can access this URL an
                    see this results.
                  </Trans>
                ) : (
                  <Trans>
                    By changing the visibility of the current analysis as{" "}
                    <strong>{t`Private`}</strong>, nobody can access this URL,
                    but you.
                  </Trans>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t`Cancel`}</AlertDialogCancel>
              <AlertDialogAction
                disabled={isPending}
                variant="destructive"
                onClick={handlechangeVisibility(analysis)}
              >
                {isPending && <Loader2 className="animate-spin" />}
                {isPending ? t`Changing...` : t`Change`}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        );
      }}
    </AlertDialog>
  );
}

export function ChangeVisibilityAlertDialogTrigger(
  props: Omit<
    React.ComponentProps<typeof AlertDialogTrigger>,
    "handle" | "payload"
  > & { payload: ChangeVisibilityPayload }
) {
  return <AlertDialogTrigger handle={changeVisibilityAlertDialog} {...props} />;
}
