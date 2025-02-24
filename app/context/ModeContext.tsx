import { createContext, ReactNode, useState } from "react";

export enum Modes {
  FOCUS = "focus",
  LONG_BREAK = "long_break",
  SHORT_BREAK = "short_break"
}

export const ModeContext = createContext <{
  mode: Modes;
  setMode: (mode: Modes) => void;
}>({
  mode: Modes.SHORT_BREAK,
  setMode: () => {console.log('fasfas')}
})

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Modes>(Modes.FOCUS);

  return (
    <ModeContext.Provider value={{mode, setMode}}>
      { children }
    </ModeContext.Provider>
  )
}
