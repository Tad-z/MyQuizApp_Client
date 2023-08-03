import React, { useEffect } from "react";
import "../styles/result.css";
import { Link } from "react-router-dom";
import ResultTable from "./ResultTable";
import {
  attempts_Number,
  earnedPoints_Number,
  resultStatus,
} from "../helper/helper";
import { useDispatch, useSelector } from "react-redux";

/** import actions */
import { resetAllAction } from "../redux/questionReducer";
import { resetResultAction } from "../redux/resultReducer";
import { usePostResult } from "../hooks/setResult";

export default function Result() {
  const dispatch = useDispatch();
  const {
    questions: { queue, answers },
    result: { result, userId },
  } = useSelector((state) => state);
  const pointsPerQuestion = 10;

  useEffect(() => {
    // console.log(earnedPoints);
  });

  const totalPoints = queue.length * 10;
  const totalQuestions = queue.length;
  const attempts = attempts_Number(result);
  const earnedPoints = earnedPoints_Number(result, answers, pointsPerQuestion);
  const status = resultStatus(totalPoints, earnedPoints);

  /** store user data */
  usePostResult({
    result,
    username: userId,
    attempts,
    points: earnedPoints,
    status: status ? "Passed" : "Failed",
  });

  function onRestart() {
    dispatch(resetAllAction());
    dispatch(resetResultAction());
  }
  return (
    <div className="container">
      <h1 className="title text-light">Quiz Application</h1>

      <div className="result flex-center">
        <div className="flex">
          <span>Username</span>
          <span className="bold">{userId || ""}</span>
        </div>
        <div className="flex">
          <span>Total Quiz Points: </span>
          <span className="bold">{totalPoints || 0}</span>
        </div>
        <div className="flex">
          <span>Total Questions</span>
          <span className="bold">{totalQuestions || 0}</span>
        </div>
        <div className="flex">
          <span>Questions Attempted</span>
          <span className="bold">{attempts || 0}</span>
        </div>
        <div className="flex">
          <span>Total Earned Points</span>
          <span className="bold">{earnedPoints || 0}</span>
        </div>
        <div className="flex">
          <span>Quiz Result</span>
          <span
            style={{ color: `${status ? "#033e20" : "#ff2a66"}` }}
            className="bold"
          >
            {status ? "Passed" : "Failed"}
          </span>
        </div>
      </div>
      <div className="start">
        <Link className="btn" to={"/"} onClick={onRestart}>
          Restart
        </Link>
      </div>

      {/* <div className="container"> */}
      
        <ResultTable></ResultTable>
      {/* </div> */}
    </div>
  );
}
