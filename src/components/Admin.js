import QuizForm from "./QuizForm";
import "../styles/Admin.css"; // 👈 Make sure to import the CSS

export default function AdminPage() {
  return (
    <div className="admin-container">
      <h2 className="admin-title">Create a New Quiz</h2>
      <QuizForm />
    </div>
  );
}
