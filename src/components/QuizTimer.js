import { useEffect, useState } from "react";

export default function QuizTimer({ onTimeRemaining }) {
  const [timeRemaining, setTimeRemaining] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const updateTime = (timeRemaining) => {
    const minutes = Math.floor(timeRemaining / 60);
    const secondss = timeRemaining % 60;
    const seconds = secondss < 10 ? `0${secondss}` : secondss;
    return `${minutes}:${seconds}`;
  };

  const time = updateTime(timeRemaining);
  onTimeRemaining(time);

  return (
    <p className={timeRemaining > 30 ? "text-light" : "text-danger"}>
      Time Remaning: {time}
    </p>
  );
  //   <p className="text-danger">Time Remaning: {timeRemaining} seconds</p>}
}
