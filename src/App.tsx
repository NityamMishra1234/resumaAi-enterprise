import { createBrowserRouter, RouterProvider } from "react-router-dom";

import PublicLayout from "./layoutes/PublicLayout";
import HomePage from "./pages/notProtected/HomePage";
import LoginPage from "./pages/notProtected/LoginPage";
import SignupPage from "./pages/notProtected/SignupPage";
import Dashboard from "./pages/protected/Dashboard";
import ProtectedRoute from "./services/ProtectedRoute";
import ForgotPasswordPage from "./pages/notProtected/ForgotPasswrd";

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />
      }
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;