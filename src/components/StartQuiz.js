import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/StartQuiz.css"

const StartQuiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [user, setUser] = useState({ name: "", email: "" });

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await axios.get(`https://https-quiz-app-server-onrender-com.onrender.com/quiz/get/${id}`);
                const data = res.data
                const quiz = data.quiz
                setQuiz(quiz);
            } catch (err) {
                console.error("Quiz not found", err);
            }
        };
        fetchQuiz();
    }, [id]);

    const handleStart = async () => {
        if (!user.name || !user.email) return alert("Please fill all fields");

        try {
            const res = await axios.post("https://https-quiz-app-server-onrender-com.onrender.com/user/start", user);
            const { userId } = res.data;

            navigate(`/quiz/${id}`, {
                state: {
                    user: { ...user, id: userId },
                },
            });
        } catch (err) {
            console.error("Failed to start quiz", err);
            alert("Something went wrong. Try again.");
        }
    };

    if (!quiz) return <p className="loading-text">Loading quiz...</p>;

    return (
      <div className="start-container">
        <h2 className="start-title">{quiz.title}</h2>
        <p className="quiz-typee">Quiz Type: {quiz.type}</p>
    
        <div className="form-section">
          <input
            type="text"
            placeholder="Your Name"
            className="input-field"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Your Email"
            className="input-field"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
    
          <button
            onClick={handleStart}
            className="start-button"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
    
};

export default StartQuiz;
