import { presetService } from "@/modules/preset/service"
import Elysia from "elysia"

export default new Elysia({
    name: "preset.controller",
    tags: ["Preset"],
    prefix: "preset",
}).use(presetService)
