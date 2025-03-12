import { useState } from "react";
import Header from "../../components/Header";
import CalculadoraPlana from "../../components/calculadoraPlana";
import CalculadoraCilindro from "../../components/calculadoraCilindro";
import CalculadoraEsferico from "../../components/CalculadoraEsferica";
import CalculadoraEsfericaT2 from "../../components/calculadoraEsfericaT2";
import CalculadoraCilindroT2 from "../../components/calculadoraCilindricaT2";
import CalculadoraPlanaT2 from "../../components/calculadoraPlanaT2";
import { Box, Button, ButtonGroup, Typography, useTheme } from "@mui/material";
import Conducao from "../../assets/conducao.jpg";
import Conveccao from "../../assets/conveccao.jpg";

const styles = {
  imageContainer: {
    position: "relative",
    display: "inline-block",
    cursor: "pointer",
    overflow: "hidden",
    borderRadius: "10%",
    width: "350px",  // Tamanho fixo para as imagens
    height: "auto",  // Mantém a proporção da imagem
    boxSizing: "border-box",
    margin: "10px",
  },
  image: {
    width: "100%",  // Faz com que a imagem ocupe 100% da largura da container
    height: "100%", // Mantém a proporção original da imagem
    transition: "transform 0.3s ease", // Efeito de zoom ao passar o mouse
  },
  imageHover: {
    transform: "scale(1.05)", // Aplica o efeito de zoom
  },
  darkOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%", // A largura da box escura será igual à da imagem
    height: "100%", // A altura será igual à da imagem
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Fundo escuro semitransparente
    transition: "opacity 0.3s ease", // Transição suave
    opacity: 0.7, // Sempre visível
  },
  overlayVisible: {
    opacity: 0, // Some no hover
  },
  mobileNoHover: {
    transform: "none !important", // Remove o efeito de hover em telas pequenas
  },
  mobileNoOverlay: {
    opacity: 0, // Remove a box escura em dispositivos móveis
  },
};

const CalculadoraCoe = () => {
  const theme = useTheme();

  const [categoria, setCategoria] = useState(null);
  const [selecionado, setSelecionado] = useState(null);
  const [hover, setHover] = useState(null);

  return (
    <Box sx={{ margin: "0px -8px -60px -8px", textAlign: "center", minHeight: "100vh" }}>
      <Header />

      {/* Escolha entre Condução e Convecção */}
      {!categoria ? (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 4, flexWrap: "wrap", margin: "20px 0" }}>
          {[
            { img: Conducao, type: "conducao" },
            { img: Conveccao, type: "conveccao" }
          ].map(({ img, label, subtitle, type }) => (
            <Box
              key={type}
              sx={styles.imageContainer}
              onMouseEnter={() => setHover(type)}
              onMouseLeave={() => setHover(null)}
              onClick={() => {
                setCategoria(type);
                setSelecionado(type === "conducao" ? "plana1" : "plana2");
              }}
            >
              <img
                src={img}
                alt={label}
                style={{
                  ...styles.image,
                  ...(hover === type ? styles.imageHover : {}),
                }}
              />
              {/* Overlay escuro */}
              <Box
                sx={{
                  ...styles.darkOverlay,
                  ...(hover === type ? styles.overlayVisible : {}),
                  ...(window.innerWidth <= 768 ? styles.mobileNoOverlay : {}),
                }}
              />
              <Box sx={{ position: "absolute", bottom: "10px", left: "10px", color: "white", backgroundColor: "rgba(0, 0, 0, 0.5)", padding: "5px", borderRadius: "5px" }}>
                <Typography variant="h6">{label}</Typography>
                <Typography sx={{ fontSize: "0.875rem" }}>{subtitle}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <>
          {/* Escolha da calculadora dentro da categoria */}
          <ButtonGroup variant="contained" sx={{ margin: "20px 0" }}>
            {categoria === "conducao" ? (
              <>
                <Button onClick={() => setSelecionado("plana1")} variant={selecionado === "plana1" ? "contained" : "outlined"} sx={{ color: theme.palette.background, borderColor: theme.palette.background }}>
                  Plana
                </Button>
                <Button onClick={() => setSelecionado("cilindro1")} variant={selecionado === "cilindro1" ? "contained" : "outlined"} sx={{ color: theme.palette.background, borderColor: theme.palette.background }}>
                  Cilindro
                </Button>
                <Button onClick={() => setSelecionado("esferico1")} variant={selecionado === "esferico1" ? "contained" : "outlined"} sx={{ color: theme.palette.background, borderColor: theme.palette.background }}>
                  Esférica
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setSelecionado("plana2")} variant={selecionado === "plana2" ? "contained" : "outlined"} sx={{ color: theme.palette.background, borderColor: theme.palette.background }}>
                  Plana
                </Button>
                <Button onClick={() => setSelecionado("cilindro2")} variant={selecionado === "cilindro2" ? "contained" : "outlined"} sx={{ color: theme.palette.background, borderColor: theme.palette.background }}>
                  Cilindro
                </Button>
                <Button onClick={() => setSelecionado("esferico2")} variant={selecionado === "esferico2" ? "contained" : "outlined"} sx={{ color: theme.palette.background, borderColor: theme.palette.background }}>
                  Esférica
                </Button>
              </>
            )}
          </ButtonGroup>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={() => {
                setCategoria(null);
                setSelecionado(null);
                setHover(null); // Reseta o estado do hover
              }}
              variant="outlined"
              sx={{ color: theme.palette.background, borderColor: theme.palette.background, marginBottom: 5, marginRight: 2.5 }}
            >
              Voltar
            </Button>
          </Box>
        </>
      )}

      {/* Exibição da calculadora selecionada */}
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
