import { create } from "zustand";

interface AppState {
  inputValue: string;
  cursorPosition?: number;

  setCursorPosition: (position?: number) => void;
  setInputValue: (value: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  inputValue: "",
  cursorPosition: undefined,

  setCursorPosition: (position?: number) => set({ cursorPosition: position }),
  setInputValue: (value: string) => set({ inputValue: value }),
}));
