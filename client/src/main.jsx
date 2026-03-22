if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark");
}
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(<App />);
