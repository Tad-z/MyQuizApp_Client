import React, { useContext, useEffect, useState } from "react";
import Questions from "./Questions";
import QuizTimer from "./QuizTimer";

import { MoveNextQuestion, MovePrevQuestion } from "../hooks/FetchQuestion";
import { PushAnswer } from "../hooks/setResult";
import { Navigate } from "react-router-dom";

/** redux store import */
import { useSelector, useDispatch } from "react-redux";



export default function Quiz() {

  const [check, setChecked] = useState(undefined);
  const [timeRemaining, setTimeRemaining] = useState(100);

  const result = useSelector(state => state.result.result) 
  const trace = useSelector((state) => state.questions.trace);
  const count = useSelector((state) => state.questions.queue.length);
  const dispatch = useDispatch();

  function onTimeRemaining(time) {
    setTimeRemaining(time)
    console.log("t",timeRemaining);
  }
  /** next button event handler */
  function onNext() {
    
    if (trace < count) {
      /**increment trace value by one */
      dispatch(MoveNextQuestion());

      /** changing previous option */
      if(result.length <= trace){
        dispatch(PushAnswer(check));
      }
      
    }
    /** when someone doesnt answer a question, his answer should be undefined */
    setChecked(undefined)
  }

  /** previous button event handler */
  function onPrev() {
    if (trace > 0) {
      /**decrement trace value by 1 */
      dispatch(MovePrevQuestion());
    }
  }
  function onChecked(check) {
    console.log(check);
    setChecked(check);
  }
  /** finished exam */
  if (result.length && result.length >= count || timeRemaining == 0) {
    return <Navigate to={"/result"} replace="true"></Navigate>
  }
  return (
    <div className="container">
      <QuizTimer onTimeRemaining={onTimeRemaining} />
      <h1 className="title text-light">Quiz Application</h1>

      {/** display questions */}
      <Questions onChecked={onChecked} />
      <div className="grid">
        { trace > 0 ?  <button className="btn prev" onClick={onPrev}> Prev</button> : <></> }
       
        { trace == count - 1 ? <button className="btn next" onClick={onNext}>
          Finish
        </button> : <button className="btn next" onClick={onNext}>
          Next
        </button>}
      </div>
    </div>
  );
}
