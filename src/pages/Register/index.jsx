import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import UserInput from "../../components/Inputs/UserInput";
import { useAuth } from "../../AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import BackgroundAnimation from "../../components/Animation";


const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { darkMode } = useContext(ThemeContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const traduzirErroFirebase = (codigo) => {
    const erros = {
      "auth/invalid-email": "Email inválido. Verifique e tente novamente.",
      "auth/email-already-in-use": "Este email já está em uso. Tente fazer login.",
      "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
      "auth/operation-not-allowed":
        "Cadastro com email e senha não está habilitado.",
      "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde.",
    };
    return erros[codigo] || "Ocorreu um erro. Tente novamente.";
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailRegex.test(email)) {
      setError("Por favor, insira um email válido.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      await register(email, password, name);
      navigate("/Calculadora");
    } catch (err) {
      const mensagemAmigavel = traduzirErroFirebase(err.code);
      setError(mensagemAmigavel);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: darkMode ? "#121212" : "#f4f4f4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <BackgroundAnimation/>
      <Box
        component="form"
        onSubmit={handleRegister}
        sx={{
          backgroundColor: darkMode ? "#1e1e1e" : "white",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: darkMode
            ? "0 0 10px rgba(255, 255, 255, 0.1)"
            : "0 4px 10px rgba(0,0,0,0.1)",
          maxWidth: "400px",
          width: "100%",
          zIndex: 2
        }}
      >
        <Typography
          variant="h4"
          mb={2}
          textAlign="center"
          sx={{
            color: darkMode ? "#d890d3" : "#7000b5",
            fontWeight: "bold",
          }}
        >
          Registrar
        </Typography>

        <UserInput
          label="Nome"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <UserInput
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <UserInput
          label="Senha"
          variant="outlined"
          fullWidth
          margin="normal"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <UserInput
          label="Repetir senha"
          variant="outlined"
          fullWidth
          margin="normal"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {error && (
          <Typography color="error" mt={1} textAlign="center">
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            marginTop: "20px",
            backgroundColor: darkMode ? "#d890d3" : "#7000b5",
            color: darkMode ? "#121212" : "white",
            textTransform: "none",
            "&:hover": {
              backgroundColor: darkMode ? "#bb5cc9" : "#d890d3",
            },
          }}
        >
          Registrar
        </Button>

        <Typography
          variant="body2"
          mt={2}
          textAlign="center"
          sx={{
            color: darkMode ? "#d890d3" : "#7000b5",
          }}
        >
          Já tem uma conta?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{
              cursor: "pointer",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            Entrar
          </span>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
