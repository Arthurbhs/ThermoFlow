import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, Button, keyframes } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
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
  const { darkMode } = useContext(ThemeContext);
  const [icons, setIcons] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [firstTime, setFirstTime] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("lastPopupDate"); // Apaga o registro
  }, []);
  
  const [fadeIn, setFadeIn] = useState(false);
  
  useEffect(() => {
    if (showPopup) {
      setTimeout(() => setFadeIn(true), 50); // Pequeno atraso para suavizar a transição
    }
  }, [showPopup]);  

  useEffect(() => {
    const lastPopupDate = localStorage.getItem("lastPopupDate");

    if (!lastPopupDate) {
      // Primeira vez acessando a página
      setShowPopup(true);
      setFirstTime(true);
      localStorage.setItem("lastPopupDate", new Date().toISOString());
    } else {
      const lastDate = new Date(lastPopupDate);
      const currentDate = new Date();
      const diffInMonths = (currentDate - lastDate) / (1000 * 60 * 60 * 24 * 30); // Diferença em meses

      if (diffInMonths >= 2) {
        setShowPopup(true);
        setFirstTime(true);
        localStorage.setItem("lastPopupDate", new Date().toISOString());
      }
    }
  }, []);

  const addIcon = () => {
    const IconComponent = ICONS[Math.floor(Math.random() * ICONS.length)];
    const icon = {
      id: Date.now(),
      positionX: Math.random() * window.innerWidth,
      IconComponent,
    };
    setIcons((prevIcons) => [...prevIcons, icon]);

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

      {firstTime ? (
        <StyledButton variant="contained" onClick={() => setShowPopup(true)}>
          Começar
        </StyledButton>
      ) : (
        <StyledButton variant="contained" onClick={() => navigate("/Calculadora")}>
          Entrar
        </StyledButton>
      )}

      {showPopup && (
      <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: fadeIn ? "translate(-50%, -50%) translateY(0)" : "translate(-50%, -50%) translateY(-30px)",
        opacity: fadeIn ? 1 : 0,
        transition: "opacity 0.3s ease-out, transform 0.5s ease-out",
        backgroundColor: darkMode ? "#1e1e1e" : "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: darkMode
          ? "0px 4px 10px rgba(255, 255, 255, 0.25)"
          : "0px 4px 10px rgba(0, 0, 0, 0.25)",
        zIndex: 3,
        textAlign: "center",
      }}
    >
       <Typography
         variant="h4"
         sx={{
           fontFamily: "'Poppins', sans-serif",
           color: darkMode ? "#bb86fc" : "#7000b5",
           marginBottom: "10px",
         }}
       >
         Vamos começar!
       </Typography>
       <Typography
         variant="body2"
         sx={{
           fontFamily: "'Poppins', sans-serif",
           color: darkMode ? "#ccc" : "#555",
           marginBottom: "20px",
         }}
       >
         Esse website é um projeto que visa auxiliar e ensinar de forma didática sobre o cálculo de fluxo de calor.
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
            onClick={() => {
              setShowPopup(false);
              setFirstTime(false);
            }}
          >
            Continuar
          </Button>
     </Box>
      )}
    </StyledBox>
  );
};

export default WelcomePage;
