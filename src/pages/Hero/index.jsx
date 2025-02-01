import React, { useEffect, useState } from "react";
import { Box, Typography, Button, keyframes } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom"; // Importa o hook useNavigate
import {
  Functions,
  Calculate,
  Percent,
  AddCircle,
  RemoveCircle,
  Done,
  Repeat,
  Star,
} from "@mui/icons-material";
import "@fontsource/poppins";

const StyledBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
});

const StyledButton = styled(Button)({
  marginTop: "20px",
  backgroundColor: "#7000b5",
  color: "white",
  padding: "10px 20px",
  fontSize: "18px",
  textTransform: "none",
  fontFamily: "'Poppins', sans-serif",
  zIndex: 2,
  "&:hover": {
    backgroundColor: "#d890d3",
  },
});

const fallAnimation = keyframes`
  0% {
    transform: translateY(-80px); 
  }
  100% {
    transform: translateY(107vh); 
  }
`;

const ICONS = [Functions, Calculate, Percent, AddCircle, RemoveCircle, Done, Repeat, Star];

const WelcomePage = () => {
  const [icons, setIcons] = useState([]);
  const [showPopup, setShowPopup] = useState(false); // Estado para controlar a visibilidade da popup
  const navigate = useNavigate(); // Hook para navegação

  const addIcon = () => {
    const IconComponent = ICONS[Math.floor(Math.random() * ICONS.length)];
    const icon = {
      id: Date.now(),
      positionX: Math.random() * window.innerWidth,
      IconComponent,
    };
    setIcons((prevIcons) => [...prevIcons, icon]);

    // Remove o ícone após o tempo da animação (5s)
    setTimeout(() => {
      setIcons((prevIcons) => prevIcons.filter((i) => i.id !== icon.id));
    }, 4800);
  };

  useEffect(() => {
    const interval = setInterval(addIcon, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <StyledBox>
      <Typography
        variant="h2"
        sx={{
          fontWeight: "bold",
          color: "#7000b5",
          marginBottom: "10px",
          fontFamily: "'Poppins', sans-serif",
          zIndex: 2,
        }}
      >
        Bem Vindo!
      </Typography>
      <Typography
        variant="h5"
        sx={{
          color: "#7000b5",
          marginBottom: "20px",
          fontFamily: "'Poppins', sans-serif",
          zIndex: 2,
        }}
      >
        Calculadora coeficiente de transferência de calor
      </Typography>

      {icons.map(({ id, positionX, IconComponent }) => (
        <Box
          key={id}
          sx={{
            position: "absolute",
            left: positionX,
            top: 0,
            animation: `${fallAnimation} 5s linear`,
            color: "#e89be3",
            fontSize: 30,
            zIndex: 1,
          }}
        >
          <IconComponent />
        </Box>
      ))}

      <StyledButton variant="contained" onClick={() => setShowPopup(true)}>
        Começar
      </StyledButton>

      {showPopup && (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
            zIndex: 3,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              color: "#7000b5",
              marginBottom: "10px",
            }}
          >
            Vamos começar!
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              color: "#555",
              marginBottom: "20px",
            }}
          >
            Esse web site é um projeto que visa auxiliar e ensinar de forma didática, sobre o 
            Calculo de fluxo de calor
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#7000b5",
              color: "white",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#d890d3",
              },
            }}
            onClick={() => navigate("/Calculadora")} // Redireciona para a página "Home"
          >
            Entrar
          </Button>
        </Box>
      )}
    </StyledBox>
  );
};

export default WelcomePage;
