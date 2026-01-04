import { Schema } from "effect";
import {
  ModelRole,
  type PresetModel as ZenPresetModel,
} from "../generated/models.ts";
import { PresetId } from "./preset.ts";
import { ModelId } from "./model.ts";

export type PresetModelId = typeof PresetModelId.Type;
export const PresetModelId = Schema.String.pipe(Schema.brand("PresetModelId"));

export class PresetModel
  extends Schema.TaggedClass<PresetModel>()("PresetModel", {
    id: PresetModelId,
    role: Schema.Enums(ModelRole),
    presetId: PresetId,
    isDefault: Schema.Boolean,
    modelId: ModelId,
  })
  implements ZenPresetModel {}
