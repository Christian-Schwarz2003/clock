"use client";
import styles from "./page.module.css";
import {useCallback, useEffect, useState} from "react";
import {getCurrentTimeOffset} from "./utils/time";

export default function Home() {
  const [timeOffset, setLatency] = useState({offset: 0, error: Infinity});
  const [time, setTime] = useState(new Date());
  const updateLatency = useCallback(async () => {
    const offset = await getCurrentTimeOffset();
    if (!offset) return;
    setLatency(offset);
  }, []);

  useEffect(() => {
    updateLatency();
  }, [updateLatency]);

  const getCurrentTimeAdjusted = useCallback(() => {
    const now = new Date();
    return new Date(now.getTime() - timeOffset.offset);
  }, [timeOffset]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentTimeAdjusted());
    }, 2);
    return () => clearInterval(interval);
  }, [getCurrentTimeAdjusted]);

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const hundredths = String(Math.floor(date.getMilliseconds() / 10)).padStart(
      2,
      "0"
    );

    return (
      <>
        {hours}:{minutes}:{seconds}
        <span className={styles.betweenNumbers}>.</span>
        {hundredths}
      </>
    );
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div suppressHydrationWarning className={styles.time}>
          {formatTime(time)}
        </div>
        <div suppressHydrationWarning >
          Your clock is {Math.abs(timeOffset.offset).toPrecision(3)} (±
          {timeOffset.error.toPrecision(3)}) ms{" "}
          {timeOffset.offset < 0 ? "ahead" : "behind"}
        </div>
        <button onClick={updateLatency} className={styles.refresh}>
          Refresh
        </button>
      </main>
    </div>
  );
}
