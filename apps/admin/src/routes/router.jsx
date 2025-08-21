import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login/Login.jsx";
import NotFound from "../pages/notFound/NotFound.jsx";
import AppLayout from "../layout/AppLayout.jsx";
import Products from "../pages/products/Products.jsx";

const baseRoutes = [
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [],
  },
  {
    path: "login",
    element: <Login />,
  },
];

const productsRoutes = [
  {
    path: "products",
    element: <Products />,
  },
];

baseRoutes[0].children = [...productsRoutes];

export const router = createBrowserRouter(baseRoutes);
