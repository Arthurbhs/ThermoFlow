import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Fade } from "@mui/material";
import Header from "../../components/Header";
import "@fontsource/playfair-display";
import "@fontsource/roboto";
import Convccao from "../../assets/conveccao.png"
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";





const PageThree = () => {
  const [showInfo, setShowInfo] = useState(null);
  const popupRef = useRef(null);
const navigate = useNavigate();
const theme = useTheme();
const textColor = theme.palette.mode === "dark" ? "#e0e0e0" : "#424242";
const boxColor = theme.palette.mode === "dark" ? "#424242" : "white";

  // Fecha pop-up ao clicar fora dele
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

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showInfo]);

  const toggleInfo = (info) => {
    setShowInfo((prev) => (prev === info ? null : info));
  };
  return (
    <Box sx={{ }}>
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
    Convecção
</Typography>
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    padding: 0,
    flexDirection: { xs: "column", md: "row" },
    textAlign: { xs: "center", md: "left" },
    gap: 2,
    maxWidth: "90%",
    margin: "0 auto"
  }}
>
    <Box sx={{ flex: 1 }}>
 <Typography variant="body1" sx={{ color:textColor , fontFamily: "'Roboto', sans-serif", fontSize: "18px", lineHeight: 1.8 }}>
  Edmund Halley observou no ano de 1686, que o ar quente tende a subir.
  Convecção, ou convecção térmica, é um processo de transmissão de calor. Quando um fluido, 
  como o ar ou a água, é aquecido, suas porções mais quentes podem sofrer{" "}
  <span
    onClick={() => toggleInfo("dilatacao")}
    style={{ color: "#d32f2f", fontWeight: "bold", cursor: "pointer" }}
  >
    dilatação térmica
  </span>, {" "}
    {showInfo === "dilatacao" && (
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
        Dilatação térmica é o aumento de volume de um corpo ou substância em função do aumento da temperatura. 
        Esse fenómeno ocorre porque, ao serem aquecidas, as partículas movem-se mais rapidamente, afastando-se umas das outras.
      </Typography>
    </Box>
  </Fade>
)}
  expandindo seu volume. Em outras palavras, esse fluido aquecido passa a ocupar um volume maior
  do que o fluido nos arredores.
 Todo corpo inserido em um meio líquido ou gasoso sofre a ação de uma força vertical para cima, 
 chamada de <span
  onClick={() => toggleInfo("empuxo")}
  style={{ color: "#d32f2f", fontWeight: "bold", cursor: "pointer" }}
>
  empuxo
</span>{" "}Essa força é proporcional ao volume do fluido deslocado pelo corpo.
{showInfo === "empuxo" && (
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
        O empuxo é a força que um fluido exerce para cima sobre um corpo nele imerso, sendo responsável 
        pela sensação de leveza ao submergir objetos. Sua intensidade é igual ao peso do volume de fluido deslocado.
      </Typography>
    </Box>
  </Fade>
)}
 
</Typography>
</Box>



  <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
    <img
      src={Convccao}  // Substitui pela tua imagem
      alt="Ilustração de Convecção"
      style={{
        maxWidth: "100%",
        height: "auto",
        borderRadius: "8px",
        width: "300px"
      }}
    />
  </Box>
</Box>
<Typography variant="body1" sx={{ color: textColor, fontFamily: "'Roboto', sans-serif", fontSize: "18px", lineHeight: 1.8 }}>
Como o
  líquido aquecido passa a ocupar um volume maior, ele sofre mais empuxo e sobe, dando origem a
   um movimento ascendente. A subida do fluido aquecido dá espaço para que as porções mais frias
    e mais densas do fluido desçam, formando um movimento descendente. O processo continua até
     que todo o fluido esteja sob a mesma temperatura.
Quando acendemos uma lareira ou fogueira, o calor é transmitido ao redor da região onde a 
madeira é queimada. Essa transmissão ocorre a partir de fenômenos como a convecção e a irradiação.
 Assim, é possível sentir o ar quente subir, levando consigo fuligem e outros gases produzidos 
 durante a queima. Além disso, mesmo que não estejamos tão perto das fogueiras, conseguimos 
 perceber o calor em virtude da grande emissão de raios infravermelhos.
No cozimento de alimentos, o líquido sofre processo de convecção até que todo seu volume 
fique em equilíbrio térmico, cessando as correntes convectivas. No início da cocção,
 a água que está em contato com o fundo da panela recebe calor por condução. O aumento 
 de temperatura leva à diminuição de densidade, por isso, essa água um pouco mais quente sobe,
  transferindo calor às suas vizinhanças por meio de seu movimento ascendente. O processo repete-se
   até que todo o fluido atinja sua temperatura de <span
  onClick={() => toggleInfo("ebulicao")}
  style={{ color: "#d32f2f", fontWeight: "bold", cursor: "pointer" }}
>
  ebulição
</span>.
{showInfo === "ebulicao" && (
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
        Ebulição é o processo de mudança de estado físico de uma substância do estado líquido para o gasoso, 
        que ocorre quando a pressão do vapor iguala a pressão externa. Caracteriza-se pela formação de bolhas no interior do líquido.
      </Typography>
    </Box>
  </Fade>
)}
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

    
      <Box sx={{ textAlign: "center", maxWidth: "80%", margin: "0 auto", padding: 4 }}>


      
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#7000b5", fontFamily: "'Playfair Display', serif" }}
        >
         Diferenças entre condução e convecção
        </Typography>
        <Typography variant="body1" sx={{ color: textColor, fontFamily: "'Roboto', sans-serif", fontSize: "18px", lineHeight: 1.8 }}>
Condução e convecção são duas das três diferentes formas de propagação do calor. 
O ponto em comum entre ambos processos é que deve haver uma diferença de temperatura entre diferentes
corpos ou em diferentes pontos do mesmo corpo.
A condução, como dito, ocorre pelo contato direto entre moléculas, que, ao colidirem, 
transferem <span
  onClick={() => toggleInfo("energia")}
  style={{ color: "#d32f2f", fontWeight: "bold", cursor: "pointer" }}
>
  energia cinética
</span>{" "} para suas moléculas vizinhas. 
{showInfo === "energia" && (
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
        Energia cinética é a energia que um corpo possui devido ao seu movimento. No contexto da condução térmica, refere-se à energia das partículas em movimento, que é transferida entre moléculas através de colisões.
      </Typography>
    </Box>
  </Fade>
)}

Nesse tipo de transferência de calor, 
não há transporte de matéria. A convecção, por sua vez, ocorre exclusivamente em fluidos e, 
assim como na condução, só ocorre em meios materiais. A diferença entre a condução e a 
convecção é que, nesta, há transporte de massa pelas correntes convectivas. 
</Typography>
      </Box>
      <Box sx={{ textAlign: "center", padding: 4 }}>
<Box sx={{ textAlign: "center", padding: 4, display: "flex", justifyContent: "center", gap: 2 }}>
  <button
   onClick={() => {
  navigate("/estudos_pag1");
  window.scrollTo(0, 0);
}}

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
    onClick={() => {navigate("/estudos_pag2");
     window.scrollTo(0, 0);}}

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
    onClick={() => {navigate("/estudos_pag3");
      window.scrollTo(0, 0)
    }}
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

export default PageThree;
