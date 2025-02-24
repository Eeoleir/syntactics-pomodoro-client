import { createContext, ReactNode, useState } from "react";

export enum Mode {
  FOCUS = "focus",
  LONG_BREAK = "long_break",
  SHORT_BREAK = "short_break"
}

export const ModeContext = createContext <{
  mode: Mode;
  setMode: (mode: Mode) => void;
}>({
  mode: Mode.FOCUS,
  setMode: () => {}
})

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(Mode.FOCUS);

  return (
    <ModeContext.Provider value={{mode, setMode}}>
      { children }
    </ModeContext.Provider>
  )
}
