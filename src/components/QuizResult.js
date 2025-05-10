import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/QuizResult.css"; // Import the CSS file

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { result, user } = location.state || {};

  if (!result || !user) {
    return (
      <div className="center-container">
        <p className="no-result-text">No result data found.</p>
        <button className="home-button" onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="result-container">
      <h2 className="result-title">Your Quiz Result</h2>

      <div className="user-info">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      {result.type === "tag-based" ? (
        <div className="result-box blue-border">
          <h3 className="result-subtitle">You're a {result.tag} learner</h3>
          <p>{result.template}</p>
        </div>
      ) : result.type === "objective" ? (
        <div className="result-box green-border">
          <h3 className="result-subtitle">Score</h3>
          <p>You scored <strong>{result.total}%</strong> on this quiz.</p>
        </div>
      ) : (
        <p>Unknown quiz type.</p>
      )}

      <button
        className="full-button"
        onClick={() => navigate("/")}
      >
        Take Another Quiz
      </button>
    </div>
  );
};

export default QuizResult;
