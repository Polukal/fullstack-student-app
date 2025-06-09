import { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useLoginMutation } from "../api/authApi";
import { useAppDispatch } from "../hooks";
import { setToken } from "../authSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(form).unwrap();
      dispatch(setToken(res.access_token));
      navigate("/");
    } catch (_) {
      /* handled below */
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={8}>
      <Paper sx={{ p: 4, width: 320 }}>
        <Typography variant="h6" mb={2}>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="username"
            fullWidth
            margin="normal"
            onChange={handleChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            onChange={handleChange}
          />
          {error && (
            <Typography color="error" variant="body2">
              Invalid credentials
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? "…" : "Login"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
