"use client";

import RHFTextarea from "@/components/rhf/rhf-textarea";
import { useSession } from "@/lib/auth/auth-client";
import PresetSelect from "@/sections/home/components/preset-select";
import UploadButton from "@/sections/home/components/upload/upload-button";
import HomeFiles from "@/sections/home/form/home-files";
import FormSendButton from "@/sections/home/form/home-form-send-button";
import { CreatePresetDialog } from "@/sections/preset/components/dialogs/create-preset-dialog";
import { t } from "@lingui/core/macro";

export default function HomeFormContainer() {
  const { data: session } = useSession();
  return (
    <>
      <HomeFiles />
      <div className="bg-input/30 space-y-2 rounded-lg border">
        <RHFTextarea
          name="text"
          placeholder={t`Analyze a text...`}
          className="resize-none max-h-48 min-h-0 rounded-none border-none shadow-none focus-visible:ring-0 dark:bg-transparent"
          rows={1}
          errors={false}
        />
        <div className="bg-background flex justify-between rounded-lg p-2">
          <div className="flex gap-1">
            <UploadButton />
            {session && <PresetSelect />}
            <CreatePresetDialog />
          </div>
          <FormSendButton />
        </div>
      </div>
    </>
  );
}
