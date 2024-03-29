import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setUserId } from "../redux/resultReducer";
import "../styles/Main.css";

export default function Main() {
  const inputRef = useRef(null);
  const dispatch = useDispatch()

  function startQuiz() {
    if(inputRef.current?.value){
      dispatch(setUserId(inputRef.current?.value))
    }
  }

  return (
    <div className="container">
      <h1 className="title primary-color">Quiz Application</h1>

      <ol>
        <li>You will be asked some questions one after another</li>
        <li>Points will be awarded for the correct answer</li>
        <li>Each question has three options. You can choose only one option</li>
        <li>You can review and change answers before the end of the quiz</li>
        <li>Be conscious of time, there is a timer at the top left</li>
        <li>The result will be declared at the end of the quiz</li>
      </ol>

      <form id="form">
        <input ref={inputRef} className="userid" type="text" placeholder="Username" />
      </form>

      <div className="start">
        <Link className="btn" onClick={startQuiz} to={"quiz"}>
          Start Quiz
        </Link>
      </div>
    </div>
  );
}
