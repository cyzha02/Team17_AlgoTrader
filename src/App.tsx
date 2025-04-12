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
import ApiService from "./ApiCalls/ApiService";

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isAuthenticated = ApiService.isUserAuthenticated();

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
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
