"use client";

import DialogScrollArea from "@/components/dialog/dialog-scroll-area";
import RHFSubmitButton from "@/components/rhf/rhf-submit-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditPresetFormContainer from "@/sections/preset/form/edit-preset-form-container";
import { PresetForm } from "@/sections/preset/form/preset-form";
import type { findPresets } from "@/services/preset";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { t } from "@lingui/core/macro";

const editPresetDialog = DialogPrimitive.createHandle<EditPresetPayload>();

interface EditPresetPayload {
  preset: findPresets["Item"];
}

export function EditPresetDialog() {
  const handleSucceed = () => editPresetDialog.close();
  return (
    <Dialog handle={editPresetDialog}>
      {({ payload }) => {
        if (!payload) return null;
        const { preset } = payload;
        return (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t`Edit preset: ${preset.name}`}</DialogTitle>
              <DialogDescription>
                {t`Edit the information of preset: ${preset.name}`}
              </DialogDescription>
            </DialogHeader>
            <EditPresetFormContainer preset={preset} onSuccess={handleSucceed}>
              <DialogScrollArea>
                <PresetForm />
              </DialogScrollArea>
              <DialogFooter>
                <DialogClose render={<Button variant="secondary" />}>
                  {t`Cancel`}
                </DialogClose>
                <RHFSubmitButton>{t`Update`}</RHFSubmitButton>
              </DialogFooter>
            </EditPresetFormContainer>
          </DialogContent>
        );
      }}
    </Dialog>
  );
}

export function EditPresetDialogTrigger(
  props: Omit<
    React.ComponentProps<typeof DialogTrigger>,
    "handle" | "payload"
  > & { payload: EditPresetPayload }
) {
  return <DialogTrigger handle={editPresetDialog} {...props} />;
}
