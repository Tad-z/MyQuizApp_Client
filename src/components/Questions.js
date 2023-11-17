import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import QuizTimer from "./QuizTimer";

/** Custom Hook */
import { useFetchQuestion } from "../hooks/FetchQuestion";
import { UpdateAnswer } from "../hooks/setResult";

export default function Questions({ onChecked }) {
  const [checked, setChecked] = useState(undefined);
  const [time, setTime] = useState(`1:40`);
  const trace = useSelector((state) => state.questions.trace);
  const count = useSelector((state) => state.questions.queue.length);
  // useSelector(state => console.log(state));
  const result = useSelector((state) => state.result.result);
  const [{ isLoading, serverError }] = useFetchQuestion();

  const questions = useSelector(
    (state) => state.questions.queue[state.questions.trace]
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(UpdateAnswer({ trace, checked }));
    console.log(questions);
  }, [checked]);

  function onTimeRemaining(time) {
    setTime(time);
    console.log("t", time);
  }

  function onSelect(i) {
    onChecked(i);
    setChecked(i);
    dispatch(UpdateAnswer({ trace, checked }));
  }
  /** finished exam */
  if ((result.length && result.length >= count) || (time == `0:00`)) {
    return <Navigate to={"/result"} replace="true"></Navigate>
  }

  if (isLoading)
    return (
      <div className="loader">
        <PulseLoader
          loading={isLoading}
          color="#403d3a"
        />
      </div>
    );

  if (serverError)
    return <h3 className="text-light">{serverError || "Unknown Error"}</h3>;

  return (
    <>
      <QuizTimer onTimeRemaining={onTimeRemaining} />
      <div className="questions">
        <h2 className="text-light">{questions?.question}</h2>

        <ul key={questions?._id} className="list">
          {questions?.option.map((q, i) => (
            <li key={i}>
              <input
                type="radio"
                value={false}
                name="options"
                id={`q${i}-option`}
                onChange={() => {
                  onSelect(i);
                }}
              />

              <label className="text-primary" htmlFor={`q${i}-option`}>
                {q}
              </label>
              <div
                className={`check ${result[trace] == i ? "checked" : ""}`}
              ></div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
