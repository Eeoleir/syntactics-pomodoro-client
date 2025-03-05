import Image, { StaticImageData } from "next/image";

interface FeatureItemProps {
  readonly icon: StaticImageData;
  readonly title: string;
  readonly description: string;
  readonly isDarkMode: boolean;
}

export function FeatureItem({
  icon,
  title,
  description,
  isDarkMode,
}: FeatureItemProps) {
  const getDarkModeClass = (dark: string, light: string) =>
    isDarkMode ? dark : light;

  return (
    <li className="transition-transform hover:-translate-y-1 duration-300 w-full sm:w-[calc(50%-1rem)]">
      <div
        className={`p-4 rounded-lg w-14 h-14 flex items-center justify-center mb-4 shadow-lg ${getDarkModeClass(
          "bg-zinc-900",
          "bg-gray-200"
        )}`}
      >
        <Image src={icon} alt="" width={24} height={24} />
      </div>
      <h1 className="text-xl font-bold mb-2">{title}</h1>
      <p
        className={`text-sm ${getDarkModeClass(
          "text-gray-400",
          "text-gray-600"
        )}`}
      >
        {description}
      </p>
    </li>
  );
}
