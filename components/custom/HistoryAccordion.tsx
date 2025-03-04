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
          <AccordionTrigger className="hidden" />{" "}
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
                        ? `Break Minutes: ${item.breakMinutes} minutes`
                        : `Focus Minutes: ${item.focusMinutes} minutes`}
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
  );
}
