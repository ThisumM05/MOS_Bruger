import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import axios from "axios";
import { store } from "./redux/store";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App.jsx";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

axios.interceptors.request.use((config) => {
  if (
    typeof config.url === "string" &&
    config.url.startsWith("http://localhost:8000")
  ) {
    config.url = config.url.replace("http://localhost:8000", API_BASE_URL);
  }
  return config;
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
