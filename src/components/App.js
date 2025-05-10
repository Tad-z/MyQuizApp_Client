import { createBrowserRouter, RouterProvider } from "react-router-dom";

/**import components */
import { UserAuth } from "../helper/helper";
import AdminPage from "./Admin";
import QuizList from "./QuizList";
import StartQuiz from "./StartQuiz";
import QuizPage from "./QuizPage";
import QuizResult from "./QuizResult";

/** react routes */
const router = createBrowserRouter([
  {
    path: "/",
    element: <QuizList></QuizList>,
  },
  {
    path: "/start/:id",
    element: <StartQuiz></StartQuiz>
  },
  {
    path: "/quiz/:id",
    element: <QuizPage></QuizPage>
  },
  {
    path: "/quiz/:id/result",
    element: <QuizResult></QuizResult>,
  },
  {
    path: "/admin",
    element: (
        <AdminPage />
    ),
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
