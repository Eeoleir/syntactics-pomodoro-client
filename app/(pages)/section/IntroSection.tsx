import Image from "next/image";
import iPad from "@/public/ipad.png";

interface IntroSectionProps {
  readonly isDarkMode: boolean;
}

export function IntroSection({ isDarkMode }: IntroSectionProps) {
  const getDarkModeClass = (dark: string, light: string) =>
    isDarkMode ? dark : light;

  return (
    <section className="relative w-full overflow-hidden">
      <div
        className={`absolute inset-0 rounded-tl-[6vw] rounded-tr-[6vw] ${getDarkModeClass(
          "bg-gradient-to-b from-[#3BBC00] via-black to-black",
          "bg-gradient-to-b from-[#3BBC00] via-gray-100 to-gray-100"
        )}`}
        style={{
          backgroundSize: "100% 100%",
          backgroundPosition: "0 0",
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        }}
      />
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
        <h2
          className={`text-xl md:text-2xl font-light tracking-widest mb-2 md:mb-4 ${getDarkModeClass(
            "text-black opacity-50",
            "text-gray-700 opacity-70"
          )}`}
        >
          INTRODUCING
        </h2>
        <h1
          className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-8 md:mb-12 ${getDarkModeClass(
            "text-black opacity-50",
            "text-gray-700 opacity-70"
          )}`}
        >
          PomoSync
        </h1>
        <div className="w-full max-w-5xl mx-auto mt-4">
          <Image
            src={iPad}
            alt="PomoSync on iPad"
            width={1200}
            height={800}
            priority
            className="w-full h-auto"
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    </section>
  );
}
