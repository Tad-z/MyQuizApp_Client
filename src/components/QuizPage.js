import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/QuizPage.css"; // Make sure to import the CSS file

const QuizPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = location.state || {};
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`https://https-quiz-app-server-onrender-com.onrender.com/quiz/get/${id}`);
        setQuiz(res.data.quiz);
        setAnswers(new Array(res.data.quiz.questions.length).fill(-1));
      } catch (err) {
        console.error("Failed to fetch quiz", err);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleOptionSelect = (questionIndex, optionIndex) => {
    const updated = [...answers];
    updated[questionIndex] = optionIndex;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`https://https-quiz-app-server-onrender-com.onrender.com/quiz/${id}/submit/`, {
        userId: user.id,
        answers,
      });
      alert("Quiz submitted successfully!");
      navigate(`/quiz/${id}/result`, { state: res.data });
    } catch (err) {
      console.error("Submit error", err);
      alert("Something went wrong while submitting.");
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  if (!quiz) return <p className="loading-text">Loading quiz...</p>;

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="question-container">
      <h2 className="question-title">{quiz.title}</h2>

      <div className="question-block">
        <p className="question-text">
          {currentQuestionIndex + 1}. {currentQuestion.question}
        </p>
        <div className="options-list">
          {currentQuestion.options.map((opt, oIndex) => (
            <label key={opt._id} className="option-label">
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={oIndex}
                checked={answers[currentQuestionIndex] === oIndex}
                onChange={() => handleOptionSelect(currentQuestionIndex, oIndex)}
                className="option-input"
              />
              {opt.text}
            </label>
          ))}
        </div>
      </div>

      <div className="nav-buttons">
        <button
          onClick={goToPrev}
          disabled={currentQuestionIndex === 0}
          className="btn btn-prev"
        >
          Previous
        </button>

        {currentQuestionIndex < quiz.questions.length - 1 ? (
          <button onClick={goToNext} className="btn btn-next">
            Next
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn btn-submit">
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
