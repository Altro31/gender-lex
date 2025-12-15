import { client } from '@repo/db/client'

export async function preAnalisis(content: string) {
	'use step'

	const analysis = await client.analysis.create({
		data: {
			originalText: content,
			modifiedTextAlternatives: [],
			biasedTerms: [],
			biasedMetaphors: [],
			Preset: { connect: { id: preset } },
		},
	})
}
