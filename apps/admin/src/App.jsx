import "./App.css";
import Login from "./pages/Login/Login";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router.jsx";
import { AdminAuthProvider } from "./context/AdminAuthContext.js";
import { AdminProductProvider } from "./context/AdminProductContext.js";

function App() {
  return (
    <AdminAuthProvider>
      <AdminProductProvider>
        <RouterProvider router={router} />;
      </AdminProductProvider>
    </AdminAuthProvider>
  );
}

export default App;
