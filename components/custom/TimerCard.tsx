"use client";

import { useTranslations } from "next-intl";
import CircularTimer from "../subcomponents/CircularTimer";
import { Button } from "../ui/button";
import { Mode, useCycleStore } from "@/app/stores/cycleStore";
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"; // Assuming Shadcn UI Accordion
import { usePomodoroStore } from "@/app/stores/pomodoroStore"; // Import the store
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"; // Import Shadcn UI Select components

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
  const { settings, setSettings } = usePomodoroStore(); // Access the store
  const [isDarkMode, setIsDarkMode] = useState(settings.is_dark_mode); // Sync with store

  useEffect(() => {
    setIsDarkMode(settings.is_dark_mode); // Update local state when store changes
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
    useState<string>("Focus Cycles"); // Default to "Focus Cycles"

  const containerStyles = `
    flex flex-row
    items-center justify-between
    font-sans
    `;

  // Example task history data (replace with real data from your store or API)
  const taskHistory = [
    {
      id: 1,
      date: "02/28/25",
      taskName: "Task Name",
      focusCycles: 0,
      focusMinutes: 25,
      breakMinutes: 5,
    },
    {
      id: 2,
      date: "02/28/25",
      taskName: "Task Name",
      focusCycles: 0,
      focusMinutes: 50,
      breakMinutes: 10,
    },
    {
      id: 3,
      date: "02/28/25",
      taskName: "Task Name",
      focusCycles: 0,
      focusMinutes: 25,
      breakMinutes: 5,
    },
    {
      id: 4,
      date: "02/28/25",
      taskName: "Task Name",
      focusCycles: 0,
      focusMinutes: 75,
      breakMinutes: 15,
    },
  ];

  const itemsPerPage = 3;
  const { currentPage, totalPages, paginatedData, goToPage } = usePagination(
    taskHistory,
    itemsPerPage
  );

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

      {/* ---- history accordion (slides up/down) ---- */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isHistoryOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <Accordion
          type="single"
          collapsible
          className="w-full mt-[24px]"
          value={isHistoryOpen ? "history" : undefined}
        >
          <AccordionItem value="history">
            <AccordionTrigger className="hidden" />{" "}
            {/* Hidden trigger for animation */}
            <AccordionContent>
              {/* Category Select Dropdown (placed at the top) */}
              <div className="mb-4 flex justify-end">
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value)}
                >
                  <SelectTrigger
                    className={`w-[200px] border dark:border-[#27272A] border-[#e4e4e7] dark:bg-[#27272a] bg-[#f4f4f5] text-[#71717a] dark:text-[#a1a1aa] rounded-md`}
                  >
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-[#27272a] dark:border-[#27272A] dark:text-[#a1a1aa]">
                    <SelectItem value="Focus Cycles">Focus Cycles</SelectItem>
                    <SelectItem value="Break Minutes">Break Minutes</SelectItem>
                    <SelectItem value="Focus Minutes">Focus Minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-4">
                {paginatedData.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-row justify-between items-center p-4 border-b dark:border-[#27272A] border-[#e4e4e7]"
                  >
                    <div className="flex flex-col">
                      <span className={primaryTextStyles(isDarkMode)}>
                        {item.taskName}
                      </span>
                      <span className={secondaryTextStyles(isDarkMode)}>
                        {item.date}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={secondaryTextStyles(isDarkMode)}>
                        {selectedCategory === "Focus Cycles"
                          ? `Focus Cycles: ${item.focusCycles}`
                          : selectedCategory === "Break Minutes"
                          ? `Break Minutes: ${item.breakMinutes}`
                          : `Focus Minutes: ${item.focusMinutes}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <Button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    className={`${
                      isDarkMode
                        ? "dark:bg-[#27272a] dark:text-[#A1A1AA] dark:border-[#27272A]"
                        : "bg-[#F4F4F5] text-[#52525B] border-[#E4E4E7]"
                    }`}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i + 1}
                      onClick={() => goToPage(i + 1)}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      className={`${
                        isDarkMode
                          ? `dark:bg-[#27272a] dark:text-[#A1A1AA] dark:border-[#27272A] ${
                              currentPage === i + 1
                                ? "dark:bg-[#3f3f46]"
                                : "dark:hover:bg-[#3f3f46]"
                            }`
                          : `bg-[#F4F4F5] text-[#52525B] border-[#E4E4E7] ${
                              currentPage === i + 1
                                ? "bg-[#E4E4E7]"
                                : "hover:bg-gray-200"
                            }`
                      }
                      }`}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className={`${
                      isDarkMode
                        ? "dark:bg-[#27272a] dark:text-[#A1A1AA] dark:border-[#27272A]"
                        : "bg-[#F4F4F5] text-[#52525B] border-[#E4E4E7]"
                    }`}
                  >
                    Next
                  </Button>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* ---- cycles (always visible, but adjusted layout when history is open) ---- */}
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

      {/* ---- clock (visible only when history is closed) ---- */}
      {!isHistoryOpen && (
        <div
          id="clock-container"
          className="flex w-full justify-center items-center mt-[64px]"
        >
          <CircularTimer/>{" "}
        </div>
      )}
    </div>
  );
}

// HistoryButton Component
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

// Pagination Hook (Example, you might need to adjust or use a library like react-paginate)
function usePagination(data: any[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return { currentPage, totalPages, paginatedData, goToPage };
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
        <h4 className={`${primaryTextStyles(true)} text-[18px]`}>{title}</h4>{" "}
        {/* Use dark mode styles for consistency */}
        <h6 className={`${secondaryTextStyles(true)} text-[14px]`}>
          {subText}
        </h6>{" "}
        {/* Use dark mode styles for consistency */}
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
