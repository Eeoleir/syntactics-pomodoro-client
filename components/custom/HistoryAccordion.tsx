import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

interface HistoryItem {
  id: number;
  date: string;
  taskName: string;
  focusCycles: number;
  focusMinutes: number;
  breakMinutes: number;
}

interface HistoryAccordionProps {
  isDarkMode: boolean;
  isHistoryOpen: boolean;
  taskHistory: HistoryItem[];
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  currentPage: number;
  totalPages: number;
  paginatedData: HistoryItem[];
  goToPage: (page: number) => void;
}

const primaryTextStyles = (isDarkMode: boolean) => `
  ${isDarkMode ? "text-[#a1a1aa]" : "text-[#52525b] dark:text-[#a1a1aa]"}
  font-bold
  font-sans
`;

const secondaryTextStyles = (isDarkMode: boolean) => `
  ${isDarkMode ? "text-[#71717a]" : "text-[#71717a]"}
  font-sans
`;

export function HistoryAccordion({
  isDarkMode,
  isHistoryOpen,
  taskHistory,
  selectedCategory,
  setSelectedCategory,
  currentPage,
  totalPages,
  paginatedData,
  goToPage,
}: HistoryAccordionProps) {
  const translations = useTranslations("components.session-data");

  return (
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
          <AccordionTrigger className="hidden" />
          <AccordionContent>
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
                  <SelectItem value="Focus Cycles">
                    {translations(
                      "fields.focused-field-selections.focus-cycles"
                    )}
                  </SelectItem>
                  <SelectItem value="Break Minutes">
                    {translations(
                      "fields.focused-field-selections.break-minutes"
                    )}
                  </SelectItem>
                  <SelectItem value="Focus Minutes">
                    {translations(
                      "fields.focused-field-selections.focus-minutes"
                    )}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

          
            <div className="flex flex-col">
              
              <div className="grid grid-cols-3 gap-4 p-4 border-b dark:border-[#27272A] border-[#e4e4e7] font-semibold">
                <span className={primaryTextStyles(isDarkMode)}>
                  Date
                </span>
                <span className={primaryTextStyles(isDarkMode)}>
                  Title
                </span>
                <span className={`${primaryTextStyles(isDarkMode)} text-right`}>
                  {selectedCategory} 
                </span>
              </div>

              {paginatedData.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-3 gap-4 p-4 border-b dark:border-[#27272A] border-[#e4e4e7]"
                >
                  <span className={secondaryTextStyles(isDarkMode)}>
                    {item.date}
                  </span>
                  <span className={primaryTextStyles(isDarkMode)}>
                    {item.taskName}
                  </span>
                  <span
                    className={`${secondaryTextStyles(isDarkMode)} text-right`}
                  >
                    {selectedCategory === "Focus Cycles"
                      ? `${item.focusCycles}`
                      : selectedCategory === "Break Minutes"
                      ? `${item.breakMinutes} ${translations(
                          "general.minutes"
                        )}`
                      : `${item.focusMinutes} ${translations(
                          "general.minutes"
                        )}`}
                  </span>
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
                  {translations("buttons.previous.text")}
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
                  {translations("buttons.next.text")}
                </Button>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
