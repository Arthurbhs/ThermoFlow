import { useState, useEffect} from "react";
import { Box, Button, ButtonGroup, useTheme, useMediaQuery } from "@mui/material";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import CalculadoraPlana from "../../components/calculadoraPlana";
import CalculadoraCilindro from "../../components/calculadoraCilindro";
import CalculadoraEsferico from "../../components/CalculadoraEsferica";
import CalculadoraEsfericaT2 from "../../components/calculadoraEsfericaT2";
import CalculadoraCilindroT2 from "../../components/calculadoraCilindricaT2";
import CalculadoraPlanaT2 from "../../components/calculadoraPlanaT2";
import Conducao from "../../assets/conducao.jpg";
import Conveccao from "../../assets/conveccao.jpg";
import NovaImagem1 from "../../assets/material.png";
import NovaImagem2 from "../../assets/conceito.png";
import { useNavigate } from "react-router-dom";

const CalculadoraCoe = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const navigate = useNavigate();
  const location = useLocation();

const [categoria, setCategoria] = useState(null);
const [selecionado, setSelecionado] = useState(null);
  const [hover, setHover] = useState(null);

 const imagens = [
  { id: "conducao", img: Conducao, type: "conducao" },
  { id: "conveccao", img: Conveccao, type: "conveccao" },
  { id: "materiais", img: NovaImagem1, redirect: "/materiais" },
  { id: "estudos", img: NovaImagem2, redirect: "/estudos_pag1" },
];



useEffect(() => {
  if (location.pathname.includes("/conducao")) {
    setCategoria("conducao");
    setSelecionado("plana1");
  } else if (location.pathname.includes("/conveccao")) {
    setCategoria("conveccao");
    setSelecionado("plana2");
  }
}, [location.pathname]);



  return (
    <Box sx={{ 
      textAlign: "center", 
      minHeight: "100vh", 
      width: "100vw", 
      overflowX: "hidden" 
    }}>
      <Header />

      {!categoria ? (
       <Box 
  sx={{ 
    display: "flex", 
    justifyContent: "center", 
    gap: 2, 
    flexWrap: "wrap", 
    margin: "20px 0" 
  }}
>
  {imagens.map(({ img, id, type, redirect }) => (
    <Box
      key={id}
      sx={{
        position: "relative",
        display: "inline-block",
        cursor: "pointer",
        overflow: "hidden",
        borderRadius: "10%",
        width: { xs: '45%', sm: '30%', md: '23%' },
        minWidth: '150px',

      }}
      onMouseEnter={() => !isMobile && setHover(id)}
      onMouseLeave={() => !isMobile && setHover(null)}
      onClick={() => {
        if (redirect) {
          navigate(redirect);
        } else {
          setCategoria(type);
          setSelecionado(type === "conducao" ? "plana1" : "plana2");
          window.history.pushState(null, "", type === "conveccao" ? "calculadora/conveccao" : "calculadora/conducao");
        }
      }}
    >
      <img
        src={img}
        alt={id}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.3s ease",
          transform: hover === id && !isMobile ? "scale(1.05)" : "none",
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
            opacity: hover === id ? 0 : 0.7,
          }}
        />
      )}
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
              flexWrap: "wrap", 
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
                window.history.pushState(null, "", "/calculadora");
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
