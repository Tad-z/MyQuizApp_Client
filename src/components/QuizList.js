import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/QuizList.css"

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/quiz");
        const data = res.data
        const quiz = data.quizzes
        setQuizzes(quiz);
      } catch (err) {
        console.error("Error fetching quizzes", err);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <div className="quiz-container">
      <h2 className="quiz-heading">Available Quizzes</h2>

      {quizzes.length === 0 && <p className="no-quizzes">No quizzes available yet.</p>}

      <div className="quiz-list">
        {quizzes.map((quiz) => (
          <div
            key={quiz._id}
            className="quiz-card"
            onClick={() => navigate(`/start/${quiz._id}`)}
          >
            <h3 className="quiz-title">{quiz.title}</h3>
            <p className="quiz-type">Type: {quiz.type}</p>
          </div>
        ))}
      </div>
    </div>

  );
};

export default QuizList;
