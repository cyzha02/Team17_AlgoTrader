import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "./pages/MainScreen";
import About from "./pages/About";
import "./App.css";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppContent() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="app-container">
      {!isLoginPage && <Navbar />}
      <main className="content">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Home /> : <Navigate to="/login" replace />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
