import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container, Paper, TextField, Button, Typography, Box, Alert,
} from "@mui/material";
import { useApp } from "../context/AppContext";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const result = login(username, password);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0f",
        backgroundImage: `radial-gradient(at 20% 30%, rgba(139, 92, 246, 0.15) 0px, transparent 50%), radial-gradient(at 80% 70%, rgba(59, 130, 246, 0.15) 0px, transparent 50%)`,
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 5,
            background: "rgba(26, 26, 36, 0.8)",
            backdropFilter: "blur(20px)",
            border: "1px solid #2a2a3a",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(139, 92, 246, 0.15)",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                width: 80, height: 80, margin: "0 auto 20px",
                borderRadius: "20px",
                background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
                boxShadow: "0 10px 30px rgba(139, 92, 246, 0.4)",
              }}
            />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              ورود به حساب
            </Typography>
            <Typography sx={{ color: "#9ca3af" }}>برای دسترسی به داشبورد مالی خود وارد شوید</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="نام کاربری" value={username} onChange={(e) => setUsername(e.target.value)} margin="normal" required
              sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#2a2a3a" }, "&:hover fieldset": { borderColor: "#8b5cf6" }, "&.Mui-focused fieldset": { borderColor: "#8b5cf6" } } }} />
            <TextField fullWidth label="رمز عبور" type="password" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" required
              sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#2a2a3a" }, "&:hover fieldset": { borderColor: "#8b5cf6" }, "&.Mui-focused fieldset": { borderColor: "#8b5cf6" } } }} />
            <Button type="submit" fullWidth variant="contained" size="large"
              sx={{ mt: 3, mb: 2, py: 1.5, background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)", fontWeight: 600, fontSize: "1rem", boxShadow: "0 4px 14px rgba(139, 92, 246, 0.4)", "&:hover": { background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)", boxShadow: "0 6px 20px rgba(139, 92, 246, 0.6)" } }}>
              ورود
            </Button>
          </form>

          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ color: "#9ca3af" }}>
              حساب کاربری ندارید؟{" "}
              <Link to="/register" style={{ color: "#8b5cf6", fontWeight: 600, textDecoration: "none" }}>ثبت‌نام کنید</Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;