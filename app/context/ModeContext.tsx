import { createContext, ReactNode, useContext, useState } from "react";

export enum Modes {
  FOCUS = "focus",
  LONG_BREAK = "long_break",
  SHORT_BREAK = "short_break"
}

interface ModeContextType {
  mode: Modes;
  //durations: { [key in Modes]: number };
  //setDurations: (newDurations: { [key in Modes]: number }) => void;
  setMode: (mode: Modes) => void;
}

const ModeContext = createContext<ModeContextType>({
  mode: Modes.FOCUS,
  // durations: {
  //   [Modes.FOCUS]: 25,
  //   [Modes.LONG_BREAK]: 15,
  //   [Modes.SHORT_BREAK]: 5
  // },
  // setDurations: () => {},
  setMode: () => {}
})

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Modes>(Modes.FOCUS);
  // const [durations, setDurations] = useState<{ [key in Modes]: number }>({
  //     [Modes.FOCUS]: 25,
  //     [Modes.SHORT_BREAK]: 15,
  //     [Modes.LONG_BREAK]: 5,
  //   });

  return (
    <ModeContext.Provider value={{mode, setMode}}>
      { children }
    </ModeContext.Provider>
  )
}

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error("useMode must be used within a ModeProvider!");
  }
  return context;
}
