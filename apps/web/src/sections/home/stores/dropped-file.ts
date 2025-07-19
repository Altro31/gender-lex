import { createStore, useStore } from "zustand"

interface DroppedFileStore {
	file: File | null
	setFile(file: File | null): void
}

const droppedFileStore = createStore<DroppedFileStore>((set) => ({
	file: null,
	setFile(file) {
		set({ file })
	},
}))

export function useDroppedFile() {
	const file = useStore(droppedFileStore, (state) => state.file)
	const setFile = useStore(droppedFileStore, (state) => state.setFile)
	return {
		file,
		setFile,
	}
}
