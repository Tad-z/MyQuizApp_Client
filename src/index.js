import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./components/App";

/** Redux Store */
import store from "./redux/store";
import { Provider } from "react-redux";

const MyContext = React.createContext();
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <MyContext.Provider>
      <App />
    </MyContext.Provider>
  </Provider>
);
