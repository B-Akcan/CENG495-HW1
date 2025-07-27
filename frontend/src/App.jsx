import React, { useState, useEffect } from "react";
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

  const [auth, setAuth] = useState({ user: null, token: null, isAdmin: null, phoneNumber: null });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      axios
        .get(`https://ceng-495-hw-1-steel.vercel.app/users/${auth.user}`, { headers: { Authorization: `Bearer ${storedToken}` } })
        .then((response) => {
          setAuth({ user: response.data.username, token: storedToken, isAdmin: response.data.isAdmin, phoneNumber: response.data.phoneNumber });
        })
        .catch(() => {
          localStorage.removeItem("token");
          setAuth({ user: null, token: null, isAdmin: null, phoneNumber: null });
        });
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post("https://ceng-495-hw-1-steel.vercel.app/login", { username, password });
      localStorage.setItem("token", response.data.token);
      setAuth({ user: response.data.username,
                token: response.data.token,
                isAdmin: response.data.isAdmin,
                phoneNumber: response.data.phoneNumber });
    } catch {
      throw new Error("Login failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth({ user: null, token: null, isAdmin: null, phoneNumber: null });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar auth={auth} handleLogout={handleLogout} />
        <Container>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={auth.user ? <Navigate to="/" /> : <LoginPage handleLogin={handleLogin} />} />
            <Route path="/items/:id" element={<ItemPage auth={auth} />} />
            <Route path="/admin" element={auth.user ? <AdminPage auth={auth} /> : <Navigate to="/login" />} />
            <Route path="/user" element={auth.user ? <UserPage auth={auth} /> : <Navigate to="/login" />} />
            <Route path="/new-item" element={auth.user ? <NewItem auth={auth} /> : <Navigate to="/login" />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;