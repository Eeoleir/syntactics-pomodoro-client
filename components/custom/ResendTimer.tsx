"use client";

import { useState, useEffect } from "react";

export const ResendTimer = () => {
  const [timer, setTimer] = useState<number>(0);
  const [isCounting, setIsCounting] = useState<boolean>(false);

  const startTimer = () => {
    setTimer(120); 
    setIsCounting(true);
  };

  useEffect(() => {
    if (timer > 0 && isCounting) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setIsCounting(false);
    }
  }, [timer, isCounting]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div>
      {isCounting ? (
        <div className="text-sm text-red font-bold">
          Resend Code in {formatTime(timer)}
        </div>
      ) : (
        <button
          className="underline text-[#84CC16]"
          onClick={startTimer}
        >
          Resend code
        </button>
      )}
    </div>
  );
};