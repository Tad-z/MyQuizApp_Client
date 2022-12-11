import { useEffect, useState } from "react";

export default function QuizTimer({ onTimeRemaining }) {
  const [timeRemaining, setTimeRemaining] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  onTimeRemaining(timeRemaining);

  return  <p className={timeRemaining > 30 ? "text-light" : "text-danger"}>Time Remaning: {timeRemaining} seconds</p> 
    //   <p className="text-danger">Time Remaning: {timeRemaining} seconds</p>}
   
  
}
