import { create } from "zustand";

interface AnalysisStore {
  id: string | undefined;
  setId: (id: string | undefined) => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  id: undefined,
  setId: (id) => set({ id }),
}));
