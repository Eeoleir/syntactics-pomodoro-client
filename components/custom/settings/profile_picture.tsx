import { IoCameraSharp } from "react-icons/io5";
import React from "react";
import { useRouter } from "next/navigation";

interface ProfilePictureProps {
  size: "sm" | "md" | "lg";
  editable?: boolean;
  src?: string;
  onFileChange?: () => void; // Callback to trigger file input in parent
}

export default function ProfilePicture({
  size = "md",
  editable = false,
  src,
  onFileChange,
}: ProfilePictureProps) {
  const sizeStyles = {
    sm: "w-[100px] h-[100px]",
    md: "w-[120px] h-[120px]",
    lg: "w-[150px] h-[150px]",
  };
  const router = useRouter();

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`
          ${sizeStyles[size]} 
          rounded-full 
          border-[#84CC16] 
          border-[3px]
          flex items-center justify-center
          relative
          overflow-hidden
          ${editable ? "cursor-pointer hover:opacity-80" : ""}
        `}
        onClick={editable ? onFileChange : undefined} // Trigger file input via parent
      >
        {src ? (
          <img src={src} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-green-500 flex items-center justify-center">
            <IoCameraSharp className="size-6 text-white" />
          </div>
        )}
        {editable && src && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <IoCameraSharp className="size-6 text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
