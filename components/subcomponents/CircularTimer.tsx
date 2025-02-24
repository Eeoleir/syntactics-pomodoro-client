import { buildStyles, CircularProgressbarWithChildren } from "react-circular-progressbar";
import { ModeContext, Mode } from "@/app/context/ModeContext";
import { useContext } from "react";
import { Rajdhani } from "next/font/google";

const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["700"] });

export default function CircularTimer() {
  const { mode, setMode } = useContext(ModeContext);

  const generateColor = (mode: string) => {
    let color = "#84cc16"
    if (mode === Mode.LONG_BREAK) {
      color = "#06b6d4";
    } else if (mode === Mode.SHORT_BREAK) {
      color = "#f59e0b";
    }
    return color;
  };

  const styles = buildStyles({
    textColor: "#fff",
    pathColor: generateColor(mode),
    trailColor: "#27272a",
    textSize: "24px",
    strokeLinecap: "round",
  });

  return (
    <div className="w-[250px]">
      <CircularProgressbarWithChildren strokeWidth={6} value={75} styles={styles}>
        <h3 className={`${rajdhani.className} text-xl text-white text-[68px]`}>
          19:15
        </h3>
      </CircularProgressbarWithChildren>
    </div>
  );
}
