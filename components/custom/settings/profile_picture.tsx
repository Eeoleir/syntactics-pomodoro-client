import { IoCameraSharp } from "react-icons/io5";
import React, { useRef } from "react";

interface ProfilePictureProps {
  size: "sm" | "md" | "lg";
  editable?: boolean;
  src?: string; // Add src prop to accept the profile photo URL
}

export default function ProfilePicture({
  size = "md",
  editable = false,
  src,
}: ProfilePictureProps) {
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
          border-[#84CC16] 
          border-[3px]
          flex items-center justify-center
          relative
          overflow-hidden
          ${editable ? "cursor-pointer hover:opacity-80" : ""}
        `}
        onClick={handleClick}
      >

        {src ? (
          <img
            src={src}
            alt="Profile"
            className="w-full h-full object-cover"
          />
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