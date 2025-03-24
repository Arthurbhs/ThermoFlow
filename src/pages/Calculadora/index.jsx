import { useState } from "react";
import { Box, Button, ButtonGroup, Typography, useTheme, useMediaQuery } from "@mui/material";
import Header from "../../components/Header";
import CalculadoraPlana from "../../components/calculadoraPlana";
import CalculadoraCilindro from "../../components/calculadoraCilindro";
import CalculadoraEsferico from "../../components/CalculadoraEsferica";
import CalculadoraEsfericaT2 from "../../components/calculadoraEsfericaT2";
import CalculadoraCilindroT2 from "../../components/calculadoraCilindricaT2";
import CalculadoraPlanaT2 from "../../components/calculadoraPlanaT2";
import Conducao from "../../assets/conducao.jpg";
import Conveccao from "../../assets/conveccao.jpg";

const CalculadoraCoe = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width: 900px)");

  const [categoria, setCategoria] = useState(null);
  const [selecionado, setSelecionado] = useState(null);
  const [hover, setHover] = useState(null);

  return (
    <Box sx={{ 
      textAlign: "center", 
      minHeight: "100vh", 
      width: "100vw", // Evita rolagem horizontal
      overflowX: "hidden" // Esconde qualquer conteúdo extra na horizontal
    }}>
      <Header />

      {!categoria ? (
        <Box 
          sx={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: 4, 
            flexWrap: "wrap", 
            margin: "20px 0" 
          }}
        >
          {[
            { img: Conducao, type: "conducao" },
            { img: Conveccao, type: "conveccao"},
          ].map(({ img, label, type }) => (
            <Box
              key={type}
              sx={{
                position: "relative",
                display: "inline-block",
                cursor: "pointer",
                overflow: "hidden",
                borderRadius: "10%",
                width: "90%", // Ajustado para telas menores
                maxWidth: "350px",
                height: "auto",
                margin: "10px",
              }}
              onMouseEnter={() => !isMobile && setHover(type)}
              onMouseLeave={() => !isMobile && setHover(null)}
              onClick={() => {
                setCategoria(type);
                setSelecionado(type === "conducao" ? "plana1" : "plana2");
                if (type === "conveccao") {
                  window.history.pushState(null, "", "calculadora/conveccao");
                } else {
                  window.history.pushState(null, "", "calculadora/conducao");
                }
              }}
              
            >
              <img
                src={img}
                alt={label}
                style={{
                  width: "100%",
                  height: "100%",
                  maxWidth: "100%", // Garante que não ultrapasse a tela
                  transition: "transform 0.3s ease",
                  transform: hover === type && !isMobile ? "scale(1.05)" : "none",
                }}
              />
              {!isMobile && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    transition: "opacity 0.3s ease",
                    opacity: hover === type ? 0 : 0.7,
                  }}
                />
              )}
              <Box sx={{ 
                position: "absolute", 
                bottom: "10px", 
                left: "10px", 
                color: "white", 
                backgroundColor: "rgba(0, 0, 0, 0.5)", 
                padding: "5px", 
                borderRadius: "5px" 
              }}>
                <Typography variant="h6">{label}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <>
          <ButtonGroup 
            variant="contained" 
            sx={{ 
              margin: "20px 0", 
              display: "flex", 
              flexWrap: "wrap", // Evita que os botões causem rolagem
              justifyContent: "center"
            }}
          >
            {categoria === "conducao" ? (
              <>
                <Button onClick={() => setSelecionado("plana1")} variant={selecionado === "plana1" ? "contained" : "outlined"}>Plana</Button>
                <Button onClick={() => setSelecionado("cilindro1")} variant={selecionado === "cilindro1" ? "contained" : "outlined"}>Cilindro</Button>
                <Button onClick={() => setSelecionado("esferico1")} variant={selecionado === "esferico1" ? "contained" : "outlined"}>Esférica</Button>
              </>
            ) : (
              <>
                <Button onClick={() => setSelecionado("plana2")} variant={selecionado === "plana2" ? "contained" : "outlined"}>Plana</Button>
                <Button onClick={() => setSelecionado("cilindro2")} variant={selecionado === "cilindro2" ? "contained" : "outlined"}>Cilindro</Button>
                <Button onClick={() => setSelecionado("esferico2")} variant={selecionado === "esferico2" ? "contained" : "outlined"}>Esférica</Button>
              </>
            )}
          </ButtonGroup>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
  onClick={() => {
    setCategoria(null);
    setSelecionado(null);
    setHover(null);
    window.history.pushState(null, "", "/calculadora"); // Restaura a URL original
  }}
  variant="outlined"
  sx={{ marginBottom: 5, marginRight: 2.5 }}
>
  Voltar
</Button>

          </Box>
        </>
      )}

      {selecionado === "plana1" && <CalculadoraPlana />}
      {selecionado === "cilindro1" && <CalculadoraCilindro />}
      {selecionado === "esferico1" && <CalculadoraEsferico />}
      {selecionado === "esferico2" && <CalculadoraEsfericaT2 />}
      {selecionado === "cilindro2" && <CalculadoraCilindroT2 />}
      {selecionado === "plana2" && <CalculadoraPlanaT2 />}
    </Box>
  );
};

export default CalculadoraCoe;
