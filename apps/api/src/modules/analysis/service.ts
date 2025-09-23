import { isFile } from "@/lib/file"
import prisma from "@/lib/prisma"
import { biasDetectionService } from "@/modules/bias-detection/service"
import { extractorService } from "@/modules/extractor/service"
import type { Analysis, AnalysisStatus } from "@repo/db/models"
import Elysia from "elysia"

export const analysisService = new Elysia({ name: "analysis.service" })
    .use(prisma)
    .use(biasDetectionService)
    .use(extractorService)
    .derive(
        { as: "global" },
        ({ status, prisma, biasDetectionService, extractorService }) => {
            const repository = prisma!.analysis
            return {
                analysisService: {
                    async statusCount() {
                        const [all, pending, analyzing, done, error] =
                            await Promise.all([
                                repository.count(),
                                this.countByStatus("pending"),
                                this.countByStatus("analyzing"),
                                this.countByStatus("done"),
                                this.countByStatus("error"),
                            ])
                        return { all, pending, analyzing, done, error }
                    },

                    countByStatus(status: AnalysisStatus) {
                        return repository.count({ where: { status } })
                    },

                    async start(id: string) {
                        const analysis = await repository.findUnique({
                            where: { id },
                            include: {
                                Preset: {
                                    include: {
                                        Models: { include: { Model: true } },
                                    },
                                },
                            },
                        })
                        if (!analysis) {
                            return status(404, "Analysis not found")
                        }
                        let result = {} as Analysis
                        try {
                            result = (
                                analysis.status === "pending"
                                    ? await biasDetectionService!.analice(
                                          analysis,
                                      )
                                    : {}
                            ) as Analysis
                            result.status = "done"
                            void repository.update({
                                where: { id },
                                data: result,
                            })
                        } catch (error) {
                            console.error(error)
                            void repository.update({
                                where: { id },
                                data: { ...result, status: "error" },
                            })
                        }
                        return { ...analysis, ...result }
                    },

                    async prepare(input: string | File, preset: string) {
                        const text = isFile(input)
                            ? await extractorService!.extractPDFText(input)
                            : input
                        const analysis = await repository.create({
                            data: {
                                originalText: text,
                                modifiedTextAlternatives: [],
                                biasedTerms: [],
                                biasedMetaphors: [],
                                Preset: { connect: { id: preset } },
                            },
                        })
                        return { id: analysis.id }
                    },

                    async delete(id: string) {
                        return repository.delete({ where: { id } })
                    },

                    async findOne(id: string) {
                        return repository.findUniqueOrThrow({
                            where: { id },
                            include: { Preset: true },
                        })
                    },

                    async redo(id: string) {
                        return repository.update({
                            where: { id },
                            data: { status: "pending" },
                        })
                    },
                },
            }
        },
    )
