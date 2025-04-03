import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline, Container } from "@mui/material";
import axios from "axios";
import theme from "./theme";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ItemPage from "./pages/ItemPage";
import AdminPage from "./pages/AdminPage";
import Navbar from "./components/Navbar";

function App() {

  const [auth, setAuth] = useState({ user: null, token: null });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      axios
        .get(`/users/${auth.user}`, { headers: { Authorization: `Bearer ${storedToken}` } })
        .then((response) => {
          setAuth({ user: response.data, token: storedToken });
        })
        .catch(() => {
          localStorage.removeItem("token");
          setAuth({ user: null, token: null });
        });
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post("/login", { username, password });
      localStorage.setItem("token", response.data.token);
      setAuth({ user: response.data.username, token: response.data.token });
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth({ user: null, token: null });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar auth={auth} handleLogout={handleLogout} />
        <Container>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={auth.user ? <Navigate to="/" /> : <LoginPage handleLogin={handleLogin} />} />
            <Route path="/items/:id" element={<ItemPage />} />
            <Route path="/admin" element={auth.user ? <AdminPage /> : <Navigate to="/login" />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;