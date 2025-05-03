import React, { useState } from "react";
import { TextField, Button, Typography, Box, Alert, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function LoginPage({ handleLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await handleLogin(username, password);
      navigate("/");
    } catch {
      setError("Invalid username or password.");
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={6}>
      <Paper elevation={3} sx={{ padding: 4, width: 400 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Log In
          </Button>
        </form>
        <Box mt={2} textAlign="center">
          <Link to={"/register"} underline="hover">
            Don't have an account? Register here
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}

export default LoginPage;