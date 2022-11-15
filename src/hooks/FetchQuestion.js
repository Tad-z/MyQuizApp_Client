import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import data, { answers } from "../database/data";

/** redux actions */
import * as Action from "../redux/questionReducer";

/** fetch question hook to fetch api data and set value to store */
export const useFetchQuestion = () => {
  const dispatch = useDispatch();
  const [getData, setGetData] = useState({
    isLoading: false,
    apiData: [],
    serverError: null,
  });

  useEffect(() => {
    setGetData((prev) => ({ ...prev, isLoading: true }));

    /** async function fetch backend data */
    (async () => {
      try {
        let question = data;

        if (question.length > 0) {
          setGetData((prev) => ({ ...prev, isLoading: false }));
          setGetData((prev) => ({ ...prev, apiData: {question, answers} }));

          /** dispatch an action */
          dispatch(Action.startExamAction({question, answers}));
        } else {
          throw new Error("No Question Avalibale");
        }
      } catch (error) {
        setGetData((prev) => ({ ...prev, isLoading: false }));
        setGetData((prev) => ({ ...prev, serverError: error }));
      }
    })();
  }, [dispatch]);

  return [getData, setGetData];
};

/** NextAction Dispatch Function, move to the next question */
/** Cannot access a hook inside a function so i cant use usedispatch inside this function */
/** To access a dispatch function from this function you can return another function from this function
 * and assign an argument to it
 */
export const MoveNextQuestion = () => async (dispatch) => {
  try {
    dispatch(Action.moveNextAction());
  } catch (err) {
    console.log(err);
  }
};

/** PrevAction Dispatch function */
export const MovePrevQuestion = () => async (dispatch) => {
  try {
    dispatch(Action.movePrevAction());
  } catch (err) {
    console.log(err);
  }
};

