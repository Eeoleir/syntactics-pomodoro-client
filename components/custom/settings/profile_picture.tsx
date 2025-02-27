import { IoCameraSharp } from "react-icons/io5";
import React, { useRef } from "react";

export default function ProfilePicture({
  size = "md",
  editable = false,
}: {
  size: "sm" | "md" | "lg"; 
  editable?: boolean;
}) {
  const sizeStyles = {
    sm: "w-[100px] h-[100px]",
    md: "w-[120px] h-[120px]",
    lg: "w-[150px] h-[150px]",
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    if (editable && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file); 
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`
          ${sizeStyles[size]} 
          rounded-full 
          bg-green-500 
          border-[#84CC16] 
          border-[3px]
          flex items-center justify-center
          ${editable ? "cursor-pointer hover:opacity-80" : ""}
        `}
        onClick={handleClick}
      >
        <IoCameraSharp className="size-6" />
      </div>
      {editable && (
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />
      )}
    </div>
  );
}
