"use client";

import { Button } from "../ui/button";
import { Mode, useCycleStore } from "@/app/stores/cycleStore";
import { useState, useEffect } from "react";
import CircularTimer from "../subcomponents/CircularTimer";
import { usePomodoroStore } from "@/app/stores/pomodoroStore";
import { HistoryAccordion } from "./HistoryAccordion";
import { useQuery } from "@tanstack/react-query";
import { fetchPomodoroHistory, HistoryItem } from "@/lib/history-queries";

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

  // Fetch history data with TanStack Query
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

  // For now, we'll assume totalPages is based on fetched data length
  // If you need meta.total, you'll need to fetch it separately or adjust the API response handling
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
            Session data
          </h3>
          <h6
            className={`text-[16px] dark:text-[#71717A] ${secondaryTextStyles(
              isDarkMode
            )}`}
          >
            Track the next cycles
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
          title="Current mode:"
          subText="Current cycle of the stopwatch"
          modeBadge={<ModeBadge mode={currentMode} isDarkMode={isDarkMode} />}
        />
        <CycleIndicator
          title="Next mode:"
          subText="Which cycle will be activated"
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

// HistoryButton, CycleIndicator, ModeBadge remain unchanged
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

  const badgeProperties = {
    [Mode.FOCUS]: {
      title: "Focus",
      style: `
        border-[#84cc16]
        text-[#84cc16]
        bg-[#84cc16]/10
        hover:bg-transparent
      `,
    },
    [Mode.LONG_BREAK]: {
      title: "Long Break",
      style: `
        border-[#06b6d4]
        text-[#06b6d4]
        bg-[#06b6d4]/10
        hover:bg-transparent
      `,
    },
    [Mode.SHORT_BREAK]: {
      title: "Short Break",
      style: `
        text-[#f59e0b]
        border-[#f59e0b]
        bg-[#f59e0b]/10
        hover:bg-transparent
      `,
    },
  };

  return (
    <Button
      className={`${badgeStyles} ${badgeProperties[mode].style}`}
      onClick={() => {}}
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
  );
};
