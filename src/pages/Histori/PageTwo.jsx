import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Fade } from "@mui/material";
import Header from "../../components/Header";
import Edmun from "../../assets/Edmund.jpeg";
import Isacc from "../../assets/isacc.jpeg";
import Conducao from "../../assets/conducao.png";
import "@fontsource/playfair-display";
import "@fontsource/roboto";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";





const AlinhadoComImagem = () => {

const navigate = useNavigate();
   const [showInfo, setShowInfo] = useState(null);
  const popupRef = useRef(null);
  const theme = useTheme();
const textColor = theme.palette.mode === "dark" ? "#e0e0e0" : "#424242";
const boxColor = theme.palette.mode === "dark" ? "#424242" : "white";


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowInfo(null);
      }
    };

    if (showInfo) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showInfo]);

  const toggleInfo = (info) => {
    setShowInfo((prev) => (prev === info ? null : info));
  };

  return (
    <Box sx={{}}>
      <Header />
       <Box sx={{ textAlign: "center", maxWidth: "80%", margin: "0 auto", padding: 4 }}>

      
         <Typography
  variant="h4"
  component="h1"
  gutterBottom
  sx={{
    fontWeight: "bold",
    color: "#7000b5",
    fontFamily: "'Playfair Display', serif",
  }}
>
  Os processos de transferência de calor
</Typography>
  <Typography variant="body1" sx={{ color: textColor, fontFamily: "'Roboto', sans-serif", fontSize: "18px", lineHeight: 1.8 }}> 
 <span
             onClick={() => toggleInfo("halley")}
            style={{ color: "#0300b0", fontWeight: "bold", cursor: "pointer" }}
          >
            Edmund Halley
          </span>
           {showInfo === "halley" && (
  <Fade in={true}>
    <Box
      ref={popupRef}
      sx={{
        position: "absolute",
        backgroundColor: boxColor,
        padding: 2,
        boxShadow: 3,
        borderRadius: 2,
        width: "60%",
        maxWidth: "450px",
        height: "250px",
        textAlign: "center",
        zIndex: 10,
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <Typography variant="body1" sx={{ color: textColor, fontSize: "14px", lineHeight: 1.6 }}>
        Edmund Halley foi um astrónomo e meteorologista britânico, conhecido pela previsão da
        órbita do cometa que leva o seu nome e pelas suas observações sobre o comportamento do ar quente.
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <img
          src={Edmun}
          alt="Edmund Halley"
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      </Box>
      <Typography variant="body2" sx={{ color: textColor, fontSize: "14px", marginTop: 1 }}>
        08/11/1656 — 14/01/1742
      </Typography>
    </Box>
  </Fade>
)}
          {" "} observou, no ano de 1686, que o ar quente tende a subir, sendo esta uma observação 
essencial para a compreensão dos padrões climáticos e meteorológicos. Em 1701, <span
  onClick={() => toggleInfo("newton")}
  style={{ color: "#0300b0", fontWeight: "bold", cursor: "pointer" }}
>
  Isaac Newton
  
</span>
{showInfo === "newton" && (
  <Fade in={true}>
    <Box
      ref={popupRef}
      sx={{
        position: "absolute",
        backgroundColor: boxColor,
        padding: 2,
        boxShadow: 3,
        borderRadius: 2,
        width: "60%",
        maxWidth: "450px",
        textAlign: "center",
        zIndex: 10,
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <Typography variant="body1" sx={{ color: textColor, fontSize: "14px", lineHeight: 1.6 }}>
        Isaac Newton (1643-1727) foi um físico, matemático e astrónomo inglês, autor das leis do movimento
        e da gravitação universal. Em 1701, formulou a lei do arrefecimento, essencial para os estudos de
        transferência de calor.
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <img
          src={Isacc}
          alt="Isaac Newton"
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      </Box>
      <Typography variant="body2" sx={{ color: textColor, fontSize: "14px", marginTop: 1 }}>
        04/01/1643 — 31/03/1727
      </Typography>
    </Box>
  </Fade>
)}


{" "} 
introduziu a lei do arrefecimento, relacionando a taxa de perda de calor de um corpo com a 
diferença de temperatura entre o corpo e o ambiente. Esses fenómenos foram analisados por 
vários estudiosos ao longo dos anos, o que, futuramente, contribuiu para o conhecimento dos 
processos de transferência de calor que temos hoje em dia, sendo os mais utilizados a 
condução e a convecção.
</Typography>

       


           <Typography
            variant="body1"
            sx={{
              color: textColor,
              fontFamily: "'Roboto', sans-serif",
              fontSize: "18px",
              lineHeight: 1.8,
            }}
          >
         
          </Typography>
 
      </Box>
  <Box sx={{ textAlign: "center", maxWidth: "100%", margin: "0 auto", padding: 2 }}>

       <Typography
      variant="h4"
      component="h2"
      gutterBottom
      sx={{ fontWeight: "bold", color: "#7000b5", fontFamily: "'Playfair Display', serif" }}
    >
      Condução
    </Typography>
    <Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    padding: 4,
    flexDirection: { xs: "column", md: "row" },
    textAlign: { xs: "center", md: "left" },
    gap: 3,
    maxWidth: "80%",
    margin: "0 auto"
  }}
>
  <Box sx={{ flex: 1 }}>
 
    <Typography
      variant="body1"
      sx={{ color: textColor, fontFamily: "'Roboto', sans-serif", fontSize: "18px", lineHeight: 1.8 }}
    >
      A condução térmica, ou simplesmente condução, é um processo de transferência de calor que ocorre
      predominantemente no interior de materiais sólidos, resultante de uma diferença de temperatura.
      Neste processo, a energia térmica é transmitida entre os átomos e moléculas sem que haja
      movimentação de matéria, até que se atinja o equilíbrio térmico.
     
    </Typography>
  </Box>

  <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
    <img
      src={Conducao}// substitui pelo URL da tua imagem
      alt="Exemplo de Condução Térmica"
      style={{
        maxWidth: "100%",
        height: "auto",
        borderRadius: "8px",
        width: "300px"
      }}
    />
    
  </Box>
   <Typography
  variant="body1"
  sx={{ color: textColor, fontFamily: "'Roboto', sans-serif", fontSize: "18px", lineHeight: 1.8 }}
>
  Este fenómeno pode ocorrer em qualquer substância, independentemente do seu estado físico,
  embora seja mais comum em sólidos. Isso deve-se ao fato que, no estado sólido, os átomos
  estão organizados numa estrutura fixa, conhecida como{" "}
  <span
    onClick={() => toggleInfo("rede")}
    style={{ color: "#d32f2f", fontWeight: "bold", cursor: "pointer" }}
  >
    rede cristalina
  </span>
  , o que favorece a troca de energia devido à elevada frequência das colisões entre partículas.
   Durante o processo de condução, os átomos das regiões mais quentes, ao receberem energia,
      vibram com maior intensidade. Ao colidirem com átomos vizinhos, transmitem parte da sua
      energia cinética, reduzindo assim a sua agitação e aumentando a dos átomos menos energéticos.
      Este mecanismo provoca a transferência de calor das zonas de maior temperatura para as de
      menor temperatura, até que todo o sistema atinja uma temperatura uniforme.
      Nos gases, a condução térmica ocorre unicamente através das colisões entre as partículas.
      Já nos sólidos não metálicos, dá-se sobretudo através das vibrações propagadas ao longo
      da rede cristalina. Nos metais, que são excelentes condutores térmicos, a condução
      verifica-se tanto pela propagação das vibrações da rede cristalina como pelo movimento
      desordenado dos elétrons livres presentes no material.
  
  {/* ... resto do texto */}
</Typography>

{showInfo === "rede" && (
  <Fade in={true}>
    <Box
      ref={popupRef}
      sx={{
        position: "absolute",
        backgroundColor: boxColor,
        padding: 2,
        boxShadow: 3,
        borderRadius: 2,
        width: "60%",
        maxWidth: "400px",
        textAlign: "center",
        zIndex: 10,
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <Typography variant="body1" sx={{ color: textColor, fontSize: "16px", lineHeight: 1.6 }}>
        Rede cristalina é a estrutura organizada e repetitiva em que os átomos ou moléculas de um sólido se
        encontram. Esta configuração favorece a propagação da energia térmica por meio de vibrações,
        sendo essencial para o processo de condução térmica.
      </Typography>
    </Box>
  </Fade>
)}

</Box>
</Box>

        <Box sx={{ textAlign: "center", padding: 4 }}>
      <Box sx={{ textAlign: "center", padding: 4, display: "flex", justifyContent: "center", gap: 2 }}>
        <button
          onClick={() => navigate("/estudos_pag1")}
          style={{
            backgroundColor: "#7000b5",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          1
        </button>
      
        <button
          onClick={() => navigate("/estudos_pag2")}
          style={{
            backgroundColor: "#7000b5",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          2
        </button>
      
        <button
          onClick={() => navigate("/estudos_pag3")}
          style={{
            backgroundColor: "#7000b5",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          3
        </button>
      </Box>
      
      </Box>
    </Box>
  );
};

export default AlinhadoComImagem;
