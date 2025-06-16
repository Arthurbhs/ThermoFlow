import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, Button, keyframes } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import "@fontsource/poppins";
import BackgroundAnimation from "../../components/Animation";
import { useAuth } from "../../AuthContext";



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



const WelcomePage = () => {
  const { darkMode } = useContext(ThemeContext);
  const [icons, setIcons] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [firstTime, setFirstTime] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();


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
  if (!user) {
    const lastPopupDate = localStorage.getItem("lastPopupDate");

    if (!lastPopupDate) {
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
  }
}, [user]);



  return (
    <StyledBox>
      <BackgroundAnimation/>
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

   
   {firstTime ? (
  <StyledButton variant="contained" onClick={() => setShowPopup(true)}>
    Começar
  </StyledButton>
) : (
  <>
    <StyledButton
      variant="contained"
      onClick={() => {
        if (user?.uid) {
          navigate("/Calculadora"); // Redireciona para a home se já está logado
        } else {
          navigate("/Login"); // Vai para a página de login se não está logado
        }
      }}
    >
      Entrar
    </StyledButton>

    <Typography
      variant="body2"
      sx={{
        marginTop: "10px",
        color: "#7000b5",
        cursor: "pointer",
        textDecoration: "underline",
        "&:hover": {
          color: "#d890d3",
        },
      }}
      onClick={() => navigate("/Calculadora")}
    >
      Entrar como anônimo
    </Typography>
  </>
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
         através da leitura de conseitos, consulta de materiais e simulações de transferência de calor.
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
