import type { ModelError, ModelStatus } from "@repo/db/models";

export type MessageMapper = {
  "model.status.change": { id: string } & (
    | { status: Exclude<ModelStatus, "error">; message?: null }
    | { status: Extract<ModelStatus, "error">; message: ModelError }
  );
  "model:test-started": { modelId: string };
};
