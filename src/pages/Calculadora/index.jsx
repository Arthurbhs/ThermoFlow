import { useState } from "react";
import Header from "../../components/Header";
import CalculadoraPlana from "../../components/calculadoraPlana";
import CalculadoraCilindro from "../../components/calculadoraCilindro";
import CalculadoraEsferico from "../../components/CalculadoraEsferica";
import CalculadoraEsfericaT2 from "../../components/calculadoraEsfericaT2";
import CalculadoraCilindroT2 from "../../components/calculadoraCilindricaT2";
import CalculadoraPlanaT2 from "../../components/calculadoraPlanaT2";
import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import Conducao from "../../assets/conducao.jpg";
import Conveccao from "../../assets/conveccao.jpg";

const styles = {
  imageContainer: {
    position: "relative",
    display: "inline-block",
    cursor: "pointer",
    overflow: "hidden",
    borderRadius: "10%",
  },
  image: {
    width: 340,
    height: "100%",
    transition: "transform 0.3s ease, opacity 0.3s ease",
  },
  imageHover: {
    transform: "scale(1.1)",
    opacity: 0.5,
  },
  textOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "white",
    fontWeight: "bold",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  textHover: {
    opacity: 1,
  },
  subtitle: {
    fontSize: "16px",
    fontWeight: "400",
    marginTop: "5px",
  },
};

const CalculadoraCoe = () => {
  const [categoria, setCategoria] = useState(null);
  const [selecionado, setSelecionado] = useState(null);
  const [hover, setHover] = useState(null);

  return (
    <Box sx={{ margin: "0px -8px -60px -8px", textAlign: "center", backgroundColor: "#0f0f0f", minHeight: "100vh" }}>
      <Header />

      {/* Escolha entre Condução e Convecção */}
      {!categoria ? (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 4, margin: "20px 0" }}>
          {[
            { img: Conducao, label: "Condução", subtitle: "Calculadora por condução", type: "conducao" },
            { img: Conveccao, label: "Convecção", subtitle: "Calculadora por convecção", type: "conveccao" }
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
              <img src={img} alt={label} style={{ ...styles.image, ...(hover === type ? styles.imageHover : {}) }} />
              <Box sx={{ ...styles.textOverlay, ...(hover === type ? styles.textHover : {}) }}>
                <Typography variant="h6">{label}</Typography>
                <Typography sx={styles.subtitle}>{subtitle}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <>
          {/* Botão para voltar */}
          <Button
  onClick={() => {
    setCategoria(null);
    setSelecionado(null);
    setHover(null); // Reseta o estado do hover
  }}
  variant="outlined"
  sx={{ marginBottom: 2, color: "white", borderColor: "gray" }}
>
  Voltar
</Button>


          {/* Escolha da calculadora dentro da categoria */}
          <ButtonGroup variant="contained" sx={{ margin: "20px 0" }}>
            {categoria === "conducao" ? (
              <>
                <Button onClick={() => setSelecionado("plana1")} color="primary">
                  Plana
                </Button>
                <Button onClick={() => setSelecionado("cilindro1")} color="secondary">
                  Cilíndrica
                </Button>
                <Button onClick={() => setSelecionado("esferico1")} color="success">
                  Esférica
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setSelecionado("plana2")} color="primary">
                  Plana
                </Button>
                <Button onClick={() => setSelecionado("cilindro2")} color="secondary">
                  Cilindro
                </Button>
                <Button onClick={() => setSelecionado("esferico2")} color="success">
                  Esférica
                </Button>
              </>
            )}
          </ButtonGroup>
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
