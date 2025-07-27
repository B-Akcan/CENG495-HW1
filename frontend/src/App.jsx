import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline, Container } from "@mui/material";
import axios from "axios";
import theme from "./theme";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ItemPage from "./pages/ItemPage";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import NewItem from "./pages/NewItem";
import Navbar from "./components/Navbar";

function App() {

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post("https://ceng-495-hw-1-steel.vercel.app/login", { username, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", response.data.username);
      localStorage.setItem("isAdmin", response.data.isAdmin);
      localStorage.setItem("phoneNumber", response.data.phoneNumber);
      window.location.reload();
    } catch {
      throw new Error("Login failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("phoneNumber");
    window.location.reload();
  };

  const user = localStorage.getItem("user");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar handleLogout={handleLogout} />
        <Container>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage handleLogin={handleLogin} />} />
            <Route path="/items/:id" element={<ItemPage />} />
            <Route path="/admin" element={user ? <AdminPage /> : <Navigate to="/login" />} />
            <Route path="/user" element={user ? <UserPage /> : <Navigate to="/login" />} />
            <Route path="/new-item" element={user ? <NewItem /> : <Navigate to="/login" />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;