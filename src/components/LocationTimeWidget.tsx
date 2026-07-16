import React, { useState, useEffect } from "react";

export default function LocationTimeWidget() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      setTime(new Date().toLocaleTimeString("en-US", options) + " GMT+7");
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-light/80 sm:hidden backdrop-blur-md px-3.5 py-2 shadow-lg">
      <span className="whitespace-nowrap mr-2">Jakarta, Indonesia</span>
      <span className="font-mono tracking-wider">{time || "12:00 AM GMT+7"}</span>
    </div>
  );
}
