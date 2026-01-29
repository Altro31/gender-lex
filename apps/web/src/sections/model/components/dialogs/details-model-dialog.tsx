"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import ModelDetails from "@/sections/model/details/model-details";
import type { findModels } from "@/services/model";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { t } from "@lingui/core/macro";

interface DetailsModelPayload {
  model: findModels.Success.Item;
}

const detailsModelDialog = DialogPrimitive.createHandle<DetailsModelPayload>();

export function DetailsModelDialog() {
  return (
    <Dialog handle={detailsModelDialog}>
      {({ payload }) => {
        if (!payload) return null;
        const { model } = payload;
        return (
          <DialogContent className="max-w-none">
            <DialogHeader>
              <DialogTitle>{t`Details of model: ${model.name}`}</DialogTitle>
              <DialogDescription>
                {t`Complete information of the model: ${model.name}`}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[80vh] py-4 pr-4">
              <ModelDetails model={model} />
            </ScrollArea>
          </DialogContent>
        );
      }}
    </Dialog>
  );
}

export function DetailsModelDialogTrigger(
  props: Omit<
    React.ComponentProps<typeof DialogTrigger>,
    "handle" | "payload"
  > & { payload: DetailsModelPayload }
) {
  return <DialogTrigger handle={detailsModelDialog} {...props} />;
}
