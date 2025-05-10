import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import "../styles/QuizForm.css";
import axios from "axios";

const QuizCreator = () => {
  const [quizType, setQuizType] = useState("tag-based");
  const [quizMode, setQuizMode] = useState("form"); // form | upload
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      type: "tag-based",
      questions: [
        {
          question: "",
          options: [{ text: "", tag: "" }],
        },
      ],
      results: [{ tag: "", description: "" }],
    },
  });

  const {
    fields: questionFields,
    append: addQuestion,
    remove: removeQuestion,
    replace: replaceQuestions,
  } = useFieldArray({
    control,
    name: "questions",
  });

  const {
    fields: resultFields,
    append: addResult,
    remove: removeResult,
  } = useFieldArray({
    control,
    name: "results",
  });

  const handleFileUpload = async (e) => {
    e.preventDefault();
    setUploadError(null);
    
    if (!file) {
      setUploadError("Please select a file.");
      return;
    }

    setIsLoading(true);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", quizType);
    
    try {
      // Call your new endpoint
      const res = await axios.post("http://localhost:8000/upload/quiz", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      // Process the returned questions and update the form
      if (res.data.questions && res.data.questions.length > 0) {
        // Format questions for the form
        const formattedQuestions = res.data.questions.map(q => ({
          question: q.question,
          options: q.options.map(opt => {
            if (quizType === "objective") {
              return { text: opt.text, isCorrect: opt.isCorrect };
            } else {
              return { text: opt.text, tag: opt.tag };
            }
          })
        }));
        
        // Replace the current questions with the new ones
        replaceQuestions(formattedQuestions);
        
        // Switch to form mode to show the imported data
        setQuizMode("form");
        
        // Success message
        alert(`Successfully imported ${formattedQuestions.length} questions from the file.`);
      } else {
        setUploadError("No valid questions found in the file.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError(err.response?.data?.error || "Error uploading file. Please check the file format.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    const payload = { ...data, type: quizType };

    // If objective, remove tag from options and use isCorrect
    if (quizType === "objective") {
      payload.questions = payload.questions.map((q) => ({
        question: q.question,
        options: q.options.map(({ text, isCorrect }) => ({ text, isCorrect })),
      }));
      delete payload.results; // Not needed for objective quizzes
    } else {
      // If tag-based, remove isCorrect and format options with tags
      payload.questions = payload.questions.map((q) => ({
        question: q.question,
        options: q.options.map(({ text, tag }) => ({ text, tag })),
      }));

      payload.results = payload.results.reduce((acc, cur) => {
        acc[cur.tag] = cur.description;
        return acc;
      }, {});
    }

    try {
      console.log("Payload:", payload);
      const res = await axios.post("http://localhost:5000/quiz/create", payload);
      alert("Quiz created!");
      console.log(res.data);
    } catch (err) {
      alert("Error creating quiz");
      console.error(err);
    }
  };

  return (
    <div className="quiz-form-wrapper">
      <div className="form-group">
        <label className="label">Quiz Title</label>
        <input className="input" {...register("title", { required: "Title is required" })} />
        {errors.title && <p className="error">{errors.title.message}</p>}
      </div>

      <div className="form-group">
        <label className="label">Quiz Type</label>
        <select 
          value={quizType} 
          onChange={(e) => setQuizType(e.target.value)} 
          className="select"
        >
          <option value="tag-based">Tag Based</option>
          <option value="objective">Objective</option>
        </select>
      </div>

      <div className="toggle-mode">
        <button 
          type="button"
          onClick={() => setQuizMode("form")} 
          className={quizMode === "form" ? "mode-btn active" : "mode-btn"}
        >
          Fill Form Manually
        </button>
        <button 
          type="button"
          onClick={() => setQuizMode("upload")} 
          className={quizMode === "upload" ? "mode-btn active" : "mode-btn"}
        >
          Bulk Upload
        </button>
      </div>

      {quizMode === "upload" ? (
        <form onSubmit={handleFileUpload} className="quiz-form">
          <div className="form-group">
            <label>Upload Excel File</label>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={(e) => setFile(e.target.files[0])}
              className="input"
            />
            <p className="helper-text">
              Your Excel file should have columns for the question and options.
              For {quizType === "objective" ? "objective" : "tag-based"} quizzes, 
              format options like: 
              {quizType === "objective" ? '"4-true" or "Paris-false"' : '"Video-visual" or "Notes-verbal"'}
            </p>
            {uploadError && <p className="error">{uploadError}</p>}
          </div>
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Upload and Parse"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="quiz-form">
          <div className="questions-container">
            {questionFields.map((qField, qIndex) => (
              <div key={qField.id} className="question-card">
                <label className="label">
                  Question {qIndex + 1}
                </label>
                <input
                  className="input"
                  {...register(`questions.${qIndex}.question`, {
                    required: "Question is required",
                  })}
                  placeholder="Enter your question"
                />
                {errors.questions?.[qIndex]?.question && (
                  <p className="error small">
                    {errors.questions[qIndex].question.message}
                  </p>
                )}

                <div className="options-section">
                  <label className="label">Options</label>
                  <OptionsFieldArray
                    nestIndex={qIndex}
                    {...{ control, register, quizType, errors }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="remove-btn"
                >
                  🗑 Remove Question
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                addQuestion({
                  question: "",
                  options: quizType === "objective"
                    ? [{ text: "", isCorrect: false }]
                    : [{ text: "", tag: "" }],
                })
              }
              className="add-btn"
            >
              + Add Question
            </button>
          </div>

          {quizType === "tag-based" && (
            <div className="results-section">
              <h4 className="results-title">Results</h4>

              {resultFields.map((field, index) => (
                <div key={field.id} className="result-card">
                  <input
                    className="input"
                    placeholder="Tag name (e.g. visual)"
                    {...register(`results.${index}.tag`, {
                      required: "Tag name is required",
                    })}
                  />
                  {errors.results?.[index]?.tag && (
                    <p className="error small">{errors.results[index].tag.message}</p>
                  )}

                  <textarea
                    className="input"
                    placeholder="Result description"
                    {...register(`results.${index}.description`, {
                      required: "Description is required",
                    })}
                  />
                  {errors.results?.[index]?.description && (
                    <p className="error small">{errors.results[index].description.message}</p>
                  )}

                  <button type="button" onClick={() => removeResult(index)} className="remove-btn">
                    🗑 Remove Result
                  </button>
                </div>
              ))}

              <button type="button" onClick={() => addResult({ tag: "", description: "" })} className="add-btn">
                + Add Result Tag
              </button>
            </div>
          )}

          <button type="submit" className="submit-btn">
            Create Quiz
          </button>
        </form>
      )}
    </div>
  );
};

// Component for options inside each question
const OptionsFieldArray = ({ nestIndex, control, register, quizType, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${nestIndex}.options`,
  });

  return (
    <div className="options-container">
      {fields.map((field, index) => (
        <div key={field.id} className="option-row">
          <input
            className="input flex-grow"
            placeholder="Option text"
            {...register(`questions.${nestIndex}.options.${index}.text`, {
              required: "Option text is required",
            })}
          />

          {quizType === "objective" ? (
            <label className="checkbox-label">
              <input type="checkbox" {...register(`questions.${nestIndex}.options.${index}.isCorrect`)} />
              Correct
            </label>
          ) : (
            <input
              className="input input-tag"
              placeholder="Tag"
              {...register(`questions.${nestIndex}.options.${index}.tag`, {
                required: "Tag is required",
              })}
            />
          )}

          <button type="button" onClick={() => remove(index)} className="remove-btn">
            🗑
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append(quizType === "objective" ? { text: "", isCorrect: false } : { text: "", tag: "" })}
        className="add-btn small"
      >
        + Add Option
      </button>
    </div>
  );
};

export default QuizCreator;