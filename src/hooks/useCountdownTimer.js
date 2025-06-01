import { useCallback, useEffect, useState } from "react";

// Constants
const TIMER_DURATION = 60;

// Hook tùy chỉnh cho timer
const useCountdownTimer = (initialValue = 0) => {
  const [timer, setTimer] = useState(initialValue);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const startTimer = useCallback((duration = TIMER_DURATION) => {
    setTimer(duration);
  }, []);

  return [timer, startTimer];
};

export default useCountdownTimer;
