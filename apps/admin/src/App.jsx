import "./App.css";
import Login from "./pages/Login/Login";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router.jsx";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
