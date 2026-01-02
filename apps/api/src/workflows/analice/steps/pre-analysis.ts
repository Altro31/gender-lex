import { db } from '@repo/db/client'

export async function preAnalisis(content: string) {
	'use step'

	const analysis = await db.analysis.create({
		data: {
			originalText: content,
			modifiedTextAlternatives: [],
			biasedTerms: [],
			biasedMetaphors: [],
			Preset: { connect: { id: preset } },
		},
	})
}
