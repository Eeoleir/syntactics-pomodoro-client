import Image from "next/image";
import GooglePlay from "@/public/playstore.png";
import AppStore from "@/public/apple.png";

interface DownloadSectionProps {
  readonly isDarkMode: boolean;
}

export function DownloadSection({ isDarkMode }: DownloadSectionProps) {
  const getDarkModeClass = (dark: string, light: string) =>
    isDarkMode ? dark : light;

  return (
    <section
      className={`${getDarkModeClass("bg-black", "bg-white")} py-10 px-4`}
    >
      <div className="max-w-[82em] mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-10 py-8 rounded-2xl bg-gradient-to-r from-[#00BEC5] to-[#7FFF00]">
        <div className="max-w-lg text-black text-center md:text-left mb-6 md:mb-0">
          <h1 className="text-[3rem] font-extrabold mb-2">
            Your Time, Your Rules
          </h1>
          <p className="text-md font-light">
            PomoSync isn't just a timer—it's a productivity companion designed
            to help you stay focused, energized, and efficient. Say goodbye to
            distractions and hello to deep work sessions.
          </p>
        </div>
        <div className="flex flex-col mt-auto sm:flex-row gap-4">
          <button
            className={`px-5 py-3 flex items-center gap-2 rounded-lg ${getDarkModeClass(
              "bg-[#3D4142] text-white",
              "bg-gray-200 text-black"
            )}`}
          >
            <Image
              src={GooglePlay}
              alt="Google Play"
              width={24}
              height={24}
              className="h-6"
            />
            <div className="text-left">
              <p className="text-xs">GET IT ON</p>
              <h1 className="text-base font-semibold">Google Play</h1>
            </div>
          </button>
          <button
            className={`px-5 py-3 flex items-center gap-2 rounded-lg ${getDarkModeClass(
              "bg-[#3D4142] text-white",
              "bg-gray-200 text-black"
            )}`}
          >
            <Image
              src={AppStore}
              alt="App Store"
              width={24}
              height={24}
              className="h-7"
            />
            <div className="text-left">
              <p className="text-xs">Download on the</p>
              <h1 className="text-base font-semibold">App Store</h1>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
