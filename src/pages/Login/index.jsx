import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import UserInput from "../../components/Inputs/UserInput";
import { useAuth } from "../../AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import "@fontsource/poppins";
import BackgroundAnimation from "../../components/Animation";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { darkMode } = useContext(ThemeContext);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const traduzirErroFirebase = (codigo) => {
    const erros = {
      "auth/invalid-email": "Email inválido. Verifique e tente novamente.",
      "auth/user-not-found": "Usuário não encontrado. Verifique o email.",
      "auth/wrong-password": "Senha incorreta. Tente novamente.",
      "auth/too-many-requests": "Muitos acessos. Tente novamente mais tarde.",
      "auth/email-already-in-use": "Este email já está em uso.",
      "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
    };
    return erros[codigo] || "Ocorreu um erro. Tente novamente.";
  };

  const handleEmailLogin = async () => {
    setError("");
    try {
      await login(email, senha);
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
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: darkMode ? "#121212" : "#f4f4f4",
      }}
    >
      <BackgroundAnimation />
      <Box
        sx={{
          width: "400px",
          backgroundColor: darkMode ? "#1f1f1f" : "white",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: darkMode
            ? "0 4px 20px rgba(0,0,0,0.7)"
            : "0 4px 20px rgba(0,0,0,0.1)",
          textAlign: "center",
          zIndex: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            marginBottom: "10px",
            color: "#7000b5",
            fontWeight: "bold",
          }}
        >
          Login
        </Typography>

        <UserInput
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <UserInput
          label="Senha"
          type={showPassword ? "text" : "password"}
          fullWidth
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
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
          <Typography sx={{ color: "red", marginBottom: "10px" }}>
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: "#7000b5",
            color: "white",
            marginBottom: "10px",
            textTransform: "none",
            "&:hover": { backgroundColor: "#d890d3" },
          }}
          onClick={handleEmailLogin}
        >
          Entrar
        </Button>

        <Button
          fullWidth
          variant="outlined"
          sx={{
            borderColor: darkMode ? "#a326f0" : "#7000b5",
            color: darkMode ? "#a326f0" : "#7000b5",
            textTransform: "none",
            "&:hover": {
              backgroundColor: darkMode
                ? "rgba(216, 144, 211, 0.1)"
                : "#f8e6ff",
              borderColor: darkMode ? "#a326f0" : "#7000b5",
            },
          }}
          onClick={() => navigate("/Register")}
        >
          Registrar
        </Button>

        <Divider
          sx={{
            marginY: "15px",
            backgroundColor: "rgba(0, 0, 0, 0)",
          }}
        >
          ou
        </Divider>

        <Typography
          sx={{
            marginTop: "15px",
            color: darkMode ? "#a326f0" : "#7000b5",
            cursor: "pointer",
            textDecoration: "underline",
            "&:hover": {
              color: "#d890d3",
            },
          }}
          onClick={() => navigate("/")}
        >
          Voltar
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
