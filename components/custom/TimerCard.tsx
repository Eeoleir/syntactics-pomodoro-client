"use client"

import { useContext } from "react"
import Image from "next/image";
import { Modes, ModeContext } from "@/app/context/ModeContext";
import CircularTimer from "../subcomponents/CircularTimer";
import { Button } from "../ui/button";


const darkMode = false;

const primaryTextStyles = `
  ${darkMode ? "text-[#a1a1aa]" : "text-[#52525b]"}
  font-bold
  font-sans
  `;

const secondaryTextStyles = `
  text-[#71717a]
  font-sans
  `;

export default function PomodoroTimerCard() {
  // temporary until dark mode context

  const containerLayout = "flex flex-col w-full p-[24px] rounded-xl border";
  const containerStyles = darkMode ? `border-[#27272a]` : `border-[#e4e4e7]`;

  return (
    <div id="container-main" className={`${containerStyles} ${containerLayout}`}>
      <CardTop/>
    </div>
  );
}

function CardTop() {
  const { mode, setMode } = useContext(ModeContext);

  const containerStyles = `
    flex flex-row
    items-center justify-between
    font-sans
    `;

  const hourglassIconStyles = `
    w-[40px] h-[40px]
    flex justify-center items-center
    text-[24px]
    ${darkMode ? "bg-[#27272a]" : "bg-[#f4f4f5]"}
    rounded
    `;

  return (
    <div className="flex flex-col w-full">
      { /* ---- title and icon ---- */ }
      <div id="header-container" className={containerStyles}>
        <div id="header-text" className="flex flex-col">
          <h3 className={`text-[24px] ${primaryTextStyles}`}>Session data</h3>
          <h6 className={`text-[16px] ${secondaryTextStyles}`}>Track the next cycles</h6>
        </div>
        <div id="header-icon" className={hourglassIconStyles}>
          <h3>⏳</h3>
        </div>
      </div>

      { /* ---- divider ---- */}
      <div id="divider" className={`h-[1px] w-full bg-[${darkMode ? "#27272a" : "#e4e4e7"}] mt-[24px] mb-[24px]`}></div>

      {/* ---- cycles ---- */}
      <div id="cycles-container" className="flex flex-col space-y-[24px]">
        <ModesIndicator title="Current Mode" subText="Current timer cycle" modeBadge={<ModeBadge mode={mode}/>}/>
        <ModesIndicator title="Next Mode" subText="Which cycle will be activated" modeBadge={<ModeBadge mode={Modes.LONG_BREAK}/>} />
      </div>

      { /* ---- clock ---- */ }
      <div id="clock-container" className="flex w-full justify-center items-center p-[24px] mt-[64px]">
        <CircularTimer/>
      </div>
    </div>
  );
}

const ModesIndicator = ({ title, subText, modeBadge} : { title:string, subText:string, modeBadge: React.ReactNode}) => {
  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-col">
        <h4 className={`${primaryTextStyles} text-[18px]`}>{title}:</h4>
        <h6 className={`${secondaryTextStyles} text-[14px]`}>{subText}</h6>
      </div>
      <div className="flex items-center">
        {modeBadge}
      </div>
    </div>
  );
}

const ModeBadge = ({ mode } : {mode: Modes}) => {
  const badgeStyles = `
    flex flex-row
    space-x-2
    font-sans
    font-semibold
    px-[10px]
    h-7
    border
    rounded-[5px]
    text-[14px]
    `;

  const badgeProperties = {
    [Modes.FOCUS] : {
      "title" : "Focus",
      "style" : `
        border-[#84cc16]
        text-[#84cc16]
        bg-[#84cc16]/10
        hover:bg-transparent
        `
    },
    [Modes.LONG_BREAK] : {
      "title" : "Long Break",
      "style" : `
        border-[#06b6d4]
        text-[#06b6d4]
        bg-[#06b6d4]/10
        hover:bg-transparent
      `
    },
    [Modes.SHORT_BREAK] : {
      "title" : "Short Break",
      "style" : `
        text-[#f59e0b]
        border-[#f59e0b]
        bg-[#f59e0b]/10
        hover:bg-transparent
      `
    }
  };

  return (
    <Button className={`${badgeStyles} ${badgeProperties[mode].style}`}>
      <Image src={`/mode_badge_icons/${mode}.svg`} alt={'?'} width={16} height={15} className="-mt-[2px]"/> {badgeProperties[mode].title}
    </Button>
  );
}