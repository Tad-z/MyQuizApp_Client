import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ColorRing } from "react-loader-spinner";

/** Custom Hook */
import { useFetchQuestion } from "../hooks/FetchQuestion";
import { UpdateAnswer } from "../hooks/setResult";

export default function Questions({ onChecked }) {
  const [checked, setChecked] = useState(undefined);
  const trace = useSelector((state) => state.questions.trace);
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

  function onSelect(i) {
    onChecked(i);
    setChecked(i);
    dispatch(UpdateAnswer({ trace, checked }));
  }

  if (isLoading)
    return (
      <div className="loader">
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
        />
      </div>
    );

  if (serverError)
    return <h3 className="text-light">{serverError || "Unknown Error"}</h3>;

  return (
    <div className="questions">
      <h2 className="text-light">{questions?.question}</h2>

      <ul key={questions?._id}>
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
  );
}
