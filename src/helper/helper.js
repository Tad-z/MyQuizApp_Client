import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import axios from "axios";

export function attempts_Number(result) {
  return result.filter((r) => r != undefined).length;
}

export function mappedAnswers(questions) {
  let answer = []
  questions.map((question, i) => answer.push(question.answer))
  return answer;
}

export function earnedPoints_Number(result, answers, pointsPerQuestion) {
  return result
    .map((r, i) => answers[i] === r)
    .filter((i) => i)
    .map((i) => pointsPerQuestion)
    .reduce((prev, curr) => prev + curr, 0);
}

export function resultStatus(totalPoints, earnedPoints) {
  return (
    (totalPoints * 50) / 100 < earnedPoints
  ); /** if 50% of total points is less than earned points */
}

/** Auth */
export function UserAuth({ children }) {
  const auth = useSelector((state) => state.result.userId);
  return auth ? children : <Navigate to={"/"} replace={true}></Navigate>;
}

/** fetch data from backend */
export async function getServerData(url) {
  const data = await axios.get(url);
  return data;
}

/** post data to backend */
export async function postServerData(url, data) {
  await axios.post(url, data);
}
