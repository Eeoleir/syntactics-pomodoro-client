"use client";

import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Mode, useCycleStore } from "@/app/stores/cycleStore";
import { useState, useEffect, useRef } from "react";

import { usePomodoroStore } from "@/app/stores/pomodoroStore";

import CircularTimer from "../subcomponents/CircularTimer";
import { HistoryAccordion } from "./HistoryAccordion";
import { useQuery } from "@tanstack/react-query";
import { fetchPomodoroHistory, HistoryItem } from "@/lib/history-queries";
import {motion, AnimatePresence} from 'motion/react'

const primaryTextStyles = (isDarkMode: boolean) => `
  ${isDarkMode ? "text-[#a1a1aa]" : "text-[#52525b] dark:text-[#a1a1aa]"}
  font-bold
  font-sans
`;

const secondaryTextStyles = (isDarkMode: boolean) => `
  ${isDarkMode ? "text-[#71717a]" : "text-[#71717a]"}
  font-sans
`;

export default function PomodoroTimerCard() {
  const { settings, setSettings } = usePomodoroStore();
  const [isDarkMode, setIsDarkMode] = useState(settings.is_dark_mode);

  useEffect(() => {
    setIsDarkMode(settings.is_dark_mode);
  }, [settings.is_dark_mode]);

  const containerLayout =
    "flex flex-col w-full p-[24px] rounded-xl border pb-12";
  const containerStyles = isDarkMode
    ? `border-[#27272a] bg-[#18181B]`
    : `border-[#e4e4e7] dark:border-[#27272A] bg-gray-100`;

  return (
    <div
      id="container-main"
      className={`${containerStyles} ${containerLayout}`}
    >
      <CardTop isDarkMode={isDarkMode} />
    </div>
  );
}

function CardTop({ isDarkMode }: { isDarkMode: boolean }) {
  const { currentMode, nextMode } = useCycleStore();

  const timerTranslations = useTranslations('components.timer');
  const sessionTranslations = useTranslations('components.session-data');

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("Focus Cycles");
  const [currentPage, setCurrentPage] = useState(1);

  const containerStyles = `
    flex flex-row
    items-center justify-between
    font-sans
  `;

  const itemsPerPage = 3;


  const {
    data: taskHistory = [],
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["pomodoroHistory", currentPage],
    queryFn: () => fetchPomodoroHistory(currentPage),
    placeholderData: (previousData) => previousData ?? [],
  });

 
  const totalPages = Math.ceil(taskHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = taskHistory.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading && !isFetching) {
    return <div>Loading history...</div>;
  }

  if (error) {
    return <div>Error loading history: {(error as Error).message}</div>;
  }

  return (
    <div className="flex flex-col w-full">
      <div id="header-container" className={containerStyles}>
        <div id="header-text" className="flex flex-col">
          <h3
            className={`text-[24px] dark:text-[#A1A1AA] ${primaryTextStyles(
              isDarkMode
            )}`}
          >
            {sessionTranslations('header')}
          </h3>
          <h6
            className={`text-[16px] dark:text-[#71717A] ${secondaryTextStyles(
              isDarkMode
            )}`}
          >
           {sessionTranslations('sub-header')}
          </h6>
        </div>
        <HistoryButton
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          isDarkMode={isDarkMode}
        />
      </div>

      <HistoryAccordion
        isDarkMode={isDarkMode}
        isHistoryOpen={isHistoryOpen}
        taskHistory={taskHistory}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        currentPage={currentPage}
        totalPages={totalPages}
        paginatedData={paginatedData}
        goToPage={goToPage}
      />


      <div
        className={`flex flex-col space-y-[24px] text-[#71717A] dark:text-[#A1A1AA] mt-[24px] ${
          isHistoryOpen ? "mt-[24px]" : "mt-[24px]"
        }`}
      >
        <CycleIndicator
          title={timerTranslations('modes.current-mode.header')}
          subText={timerTranslations('modes.current-mode.sub-header')}
          modeBadge={<ModeBadge mode={currentMode} isDarkMode={isDarkMode} />}
        />
        <CycleIndicator
        title={timerTranslations('modes.next-mode.header')}
        subText={timerTranslations('modes.next-mode.sub-header')}
          modeBadge={<ModeBadge mode={nextMode} isDarkMode={isDarkMode} />}
        />
      </div>

      {!isHistoryOpen && (
        <div
          id="clock-container"
          className="flex w-full justify-center items-center mt-[64px]"
        >
          <CircularTimer isDarkMode={isDarkMode} />
        </div>
      )}
    </div>
  );
}

function HistoryButton({
  onClick,
  isDarkMode,
}: {
  onClick: () => void;
  isDarkMode: boolean;
}) {
  const hourglassIconStyles = `
    w-[40px] h-[40px]
    flex justify-center items-center
    text-[24px]
    ${isDarkMode ? "bg-[#27272a]" : "bg-[#f4f4f5]"}
    rounded
    cursor-pointer
    hover:bg-opacity-80
  `;

  return (
    <div id="header-icon" className={hourglassIconStyles} onClick={onClick}>
      <h3>⏳</h3>
    </div>
  );
}

const CycleIndicator = ({
  title,
  subText,
  modeBadge,
}: {
  title: string;
  subText: string;
  modeBadge: React.ReactNode;
}) => {
  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-col">
        <h4 className={`${primaryTextStyles(true)} text-[18px]`}>{title}</h4>
        <h6 className={`${secondaryTextStyles(true)} text-[14px]`}>
          {subText}
        </h6>
      </div>
      <div className="flex items-center">{modeBadge}</div>
    </div>
  );
};

const ModeBadge = ({
  mode,
  isDarkMode,
}: {
  mode: Mode;
  isDarkMode: boolean;
}) => {
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
    shadow-none
  `;

  const badgeTranslations = useTranslations('components.mode-badges')
  const badgeProperties = {
    [Mode.FOCUS]: {
      title: badgeTranslations('focus.title'),
      style: `
        border-[#84cc16]
        text-[#84cc16]
        bg-[#84cc16]/10
        hover:bg-transparent
      `,
    },
    [Mode.LONG_BREAK]: {
      title: badgeTranslations('long-break.title'),
      style: `
        border-[#06b6d4]
        text-[#06b6d4]
        bg-[#06b6d4]/10
        hover:bg-transparent
      `,
    },
    [Mode.SHORT_BREAK]: {
      title: badgeTranslations('short-break.title'),
      style: `
        text-[#f59e0b]
        border-[#f59e0b]
        bg-[#f59e0b]/10
        hover:bg-transparent
      `,
    },
  };

  const [showTooltip, setShowTooltip] = useState(false);
  const onBadgeClick = () => {
    setShowTooltip(!showTooltip);
  }

  const componentRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
      setShowTooltip(false);
    }
  }
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    }
  }, [handleClickOutside]);

  const colors = (mode: string) => {
    let f = "#ffffff";
    switch (mode) {
      case Mode.FOCUS:
        f = "#84cc16";
        break;
      case Mode.SHORT_BREAK:
        f = "#fcba03";
        break;
      case Mode.LONG_BREAK:
        f = "#59c0c6";
    }
    return f;
  }

  return (
    <div>
      <Button
        className={`${badgeStyles} ${badgeProperties[mode].style}`}
        onClick={() => {onBadgeClick()}}
      >
        <img
          src={`/mode_badge_icons/${mode}.svg`}
          alt={"?"}
          width={16}
          height={15}
          className="-mt-[2px]"
        />{" "}
        {badgeProperties[mode].title}
      </Button>
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{marginTop: "0px", opacity: 0}}
            animate={{marginTop: "25px", opacity: 1}}
            exit={{marginTop: "0px", opacity: 0}}
            style={{ backgroundColor: colors(mode)}}
            ref={componentRef}
            className="absolute right-16 lg:right-auto text-white md:w-[360px] sm:w-[300px] w-[250px] h-fit z-50 rounded-lg">
              <div className="w-full flex lg:justify-start justify-end">
                <div style={{backgroundColor: colors(mode)}} className="w-5 h-5 rotate-45 absolute ml-5 mr-5 -mt-1 col-span-0">
                </div>
              </div>
              <div className="grid grid-cols-10 py-6 px-6 space-x-2">
                <div className="col-span-1 mt-[1px]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="12" fill="white"/>
                  <mask id="mask0_2564_1870"maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                  <rect width="24" height="24" fill={colors(mode)}/>
                  </mask>
                  <g mask="url(#mask0_2564_1870)">
                    <path d="M12 20.9422C11.5987 20.9422 11.2439 20.8364 10.9356 20.6249C10.6272 20.4134 10.4115 20.1358 10.2884 19.7922H9.99997C9.59101 19.7922 9.23877 19.6445 8.94327 19.349C8.64776 19.0535 8.5 18.7012 8.5 18.2923V15.0115C7.49103 14.4 6.69712 13.5801 6.11827 12.5519C5.53942 11.5237 5.25 10.423 5.25 9.24998C5.25 7.36794 5.90448 5.77243 7.21345 4.46345C8.52243 3.15448 10.1179 2.5 12 2.5C13.882 2.5 15.4775 3.15448 16.7865 4.46345C18.0955 5.77243 18.75 7.36794 18.75 9.24998C18.75 10.4436 18.4605 11.5493 17.8817 12.5673C17.3028 13.5852 16.5089 14.4 15.5 15.0115V18.2923C15.5 18.7012 15.3522 19.0535 15.0567 19.349C14.7612 19.6445 14.4089 19.7922 14 19.7922H13.7115C13.5884 20.1358 13.3727 20.4134 13.0644 20.6249C12.7561 20.8364 12.4013 20.9422 12 20.9422ZM9.99997 18.2923H14V17.3538H9.99997V18.2923ZM9.99997 16.4692H14V15.5H9.99997V16.4692ZM9.79997 14H11.4038V11.0884L9.26153 8.94613L10.1 8.10768L12 10.0077L13.9 8.10768L14.7384 8.94613L12.5961 11.0884V14H14.2C15.1 13.5666 15.8333 12.9291 16.4 12.0875C16.9666 11.2458 17.25 10.3 17.25 9.24998C17.25 7.78331 16.7416 6.54164 15.725 5.52498C14.7083 4.50831 13.4666 3.99998 12 3.99998C10.5333 3.99998 9.29164 4.50831 8.27497 5.52498C7.25831 6.54164 6.74997 7.78331 6.74997 9.24998C6.74997 10.3 7.03331 11.2458 7.59997 12.0875C8.16664 12.9291 8.89997 13.5666 9.79997 14Z" fill={colors(mode)}/>
                  </g>
                  </svg>
                </div>
                <div className="flex flex-col col-span-8 justify-center space-y-1">
                  <p className="font-bold">{badgeProperties[mode].title}</p>
                  <p className="text-sm">{badgeTranslations(`${mode}.description`)}</p>
                </div>
                <div className="col-span-1 flex justify-center -mt-[7.5px]">
                  <Button onClick={onBadgeClick} className="bg-transparent hover:bg-transparent shadow-none">
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.227 9.83653L0.163574 8.7731L3.93667 5L0.163574 1.2519L1.227 0.188477L5.0001 3.96158L8.7482 0.188477L9.81162 1.2519L6.03852 5L9.81162 8.7731L8.7482 9.83653L5.0001 6.06343L1.227 9.83653Z" fill="white"/>
                    </svg>
                  </Button>
                </div>
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
