import { findModels } from '@/services/model'
import ModelList from './model-list'

interface Props {
	searchParams: Promise<{ q?: string; page?: string }>
}

export default async function ModelListsContainer({ searchParams }: Props) {
	const data = await findModels(await searchParams)

	if (!data) {
		throw new Error('No se pudieron obtener los modelos')
	}
	return <ModelList modelsResponse={data} />
}
