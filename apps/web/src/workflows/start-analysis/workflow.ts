import { client } from "@/lib/api/client"
import { getHeaders } from "@/lib/cookies"
import { deserializeFile, SerializedFile } from "@/lib/files"
import { z } from "zod"

type StartAnalysisInputSchema = z.input<typeof StartAnalysisSchema>
type StartAnalysisSchema = z.infer<typeof StartAnalysisSchema>
const StartAnalysisSchema = z.object({
	files: SerializedFile.transform(deserializeFile).array(),
	selectedPreset: z.object({ id: z.string() }),
	text: z.string(),
})

export async function startAnalysisWorkflow(
	input: StartAnalysisInputSchema,
	cookies: string,
) {
	"use workflow"
	const createdAnalysis = await prepareAnalysis(input, cookies)
	const data = await completeAnalysis(createdAnalysis.id, cookies)
	return data
}

async function prepareAnalysis(
	input: StartAnalysisInputSchema,
	cookies: string,
) {
	"use step"
	const parsedInput = StartAnalysisSchema.parse(input)
	const headers = await getHeaders(cookies)
	const { data, error } = await client.analysis.prepare.post(
		{
			...parsedInput,
			files: parsedInput.files,
			selectedPreset: parsedInput.selectedPreset.id,
		},
		{ headers },
	)
	if (error) {
		throw new Error(error.value.summary)
	}
	return data
}

async function completeAnalysis(id: string, cookies: string) {
	"use step"
	const headers = await getHeaders(cookies)
	const { data, error } = await client.analysis
		.start({ id })
		.post(undefined, { headers })
	if (error) {
		console.error(error)
		throw new Error("An error occurred when trying access analysis with id")
	}

	return data
}
