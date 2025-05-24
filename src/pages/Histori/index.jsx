import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Fade } from "@mui/material";
import Header from "../../components/Header";
import Trasfer from "../../assets/images.png";
import Form from "../../assets/formula.png";
import Fourier from "../../assets/JosephFourier .jpeg";
import "@fontsource/playfair-display";
import "@fontsource/roboto";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";





const AlinhadoComImagem = () => {
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
    <Box sx={{  }}>
      <Header />
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
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: "100%", md: "50%" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            order: { xs: -1, md: 2 },
          }}
        >
          <img
            src={Trasfer}
            alt="Exemplo"
            style={{
                width: "100%", // Responsivo
                maxWidth: "600px",
            }}
          />
        </Box>

        <Box sx={{ maxWidth: { xs: "100%", md: "40%" }, padding: "10px" }}>
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
            A Lei de Fourier
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
            A Lei de Fourier, desenvolvida por
            <span
              onClick={() => toggleInfo("fourier")}
              style={{ color: "#0300b0", fontWeight: "bold", cursor: "pointer" }}
            >
              {" "}Joseph Fourier
            </span>
          </Typography>
          {showInfo === "fourier" && (
            <Fade in={true}>
              <Box
                ref={popupRef}
                sx={{
                  position: "absolute",
                  backgroundColor: boxColor,
                  padding: 3,
                  boxShadow: 3,
                  borderRadius: 2,
                  width: "80%",
                  maxWidth: "600px",
                  textAlign: "center",
                  zIndex: 10,
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <Typography variant="body1" sx={{ color: textColor, fontSize: "18px", lineHeight: 1.8 }}>
                  Jean-Baptiste Joseph Fourier, nascido em Auxerre no Império Francês, foi um físico e matemático
                  conhecido por suas contribuições às séries matemáticas, especialmente pela famosa Série de Fourier.
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
                  <img
                    src={Fourier}
                    alt="Joseph Fourier"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Typography variant="body1" sx={{ color: textColor, fontSize: "18px", lineHeight: 1.8 }}>
                  Jean-Baptiste Joseph Fourier. <br />
                  De 21/03/1768 a 17/05/1830
                </Typography>
              </Box>
            </Fade>
          )}

           <Typography
            variant="body1"
            sx={{
              color: textColor,
              fontFamily: "'Roboto', sans-serif",
              fontSize: "18px",
              lineHeight: 1.8,
            }}
          >
         no início do século XIX, descreve a condução de calor em materiais. 
            Ela afirma que o fluxo de calor é proporcional ao gradiente de temperatura, com a constante de proporcionalidade sendo a 
            condutividade térmica do material. Essa lei é amplamente utilizada em estudos de transferência de calor e fenômenos 
            térmicos, formando a base para a análise de processos térmicos industriais.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", padding: 4 }}>
        <img src={Form} alt="Outra Imagem" style={{ maxWidth: "60%", height: "auto", borderRadius: "8px" }} />
      </Box>

      <Box sx={{ textAlign: "center", maxWidth: "80%", margin: "0 auto", padding: 4 }}>


      <Typography
          variant="body1"
          sx={{
            color: textColor,
            fontFamily: "'Roboto', sans-serif",
            fontSize: "18px",
            lineHeight: 1.8,
            padding: "20px"
          }}
        > A equação que traduz a lei de Fourier é: Q = k x A x (TD-TE)/l, em que Q é o débito de calor de D para E, A é a área da secção reta, l o comprimento da barra, TD e TE as temperaturas nos extremos da barra e k é a condutibilidade térmica do material de que é feita a barra.
A condutibilidade térmica de um material é uma propriedade física desse material e existem tabelas que indicam os valores de k para os diferentes materiais.  </Typography>

        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#7000b5", fontFamily: "'Playfair Display', serif" }}
        >
          O Impacto da Lei de Fourier
        </Typography>
        <Typography variant="body1" sx={{ color: textColor, fontFamily: "'Roboto', sans-serif", fontSize: "18px", lineHeight: 1.8 }}>
        Fourier criou essa lei para entender e quantificar a transferência de calor, essencial na Revolução Industrial, em sistemas térmicos e de engenharia. Sua teoria foi apresentada em 1807 e formalizada em 1822 no livro{" "}
          <span
            onClick={() => toggleInfo("teoria")}
            style={{ color: "#d32f2f", cursor: "pointer", fontWeight: "bold" }}
          >
            {" "}"Teoria Analítica do Calor"
          </span>
          {showInfo === "teoria" && (
         <Fade in={true}>
         <Box
           ref={popupRef}
           sx={{
             position: "absolute",
             backgroundColor: boxColor,
             padding: 3,
             boxShadow: 3,
             borderRadius: 2,
             width: "80%",
             maxWidth: "600px",
             textAlign: "center",
             zIndex: 10,
             left: "50%",
             transform: "translateX(-50%)",
           }}
         >
              <Typography variant="body1" sx={{ color: textColor, fontSize: "18px", lineHeight: 1.8 }}>
              Nessa teoria, todos os corpos emitem e recebem calor radiante de todas as direções, independente de suas temperaturas relativas. Se dois corpos estiverem com temperaturas diferentes, durante a troca, o corpo mais frio receberá mais calor do que irá emitir, até que o equilíbrio térmico seja estabelecido.
              </Typography>
            </Box>
          </Fade>
        )}, onde ele também introduziu as
          <span
            onClick={() => toggleInfo("series")}
            style={{ color: "#d32f2f", cursor: "pointer", fontWeight: "bold" }}
          >
            {" "}séries de Fourier
          </span>, amplamente usadas na matemática e física.
       
        
        {showInfo === "series" && (
         <Fade in={true}>
         <Box
           ref={popupRef}
           sx={{
             position: "absolute",
             backgroundColor: boxColor,
             padding: 3,
             boxShadow: 3,
             borderRadius: 2,
             width: "80%",
             maxWidth: "600px",
             textAlign: "center",
             zIndex: 10,
             left: "50%",
             transform: "translateX(-50%)",
           }}
         >
              <Typography variant="body1" sx={{ color: textColor, fontSize: "20px", lineHeight: 1.8 }}>
              Série de Fourier é uma forma de série trigonométrica usada para representar funções infinitas e periódicas complexas dos processos físicos, na forma de funções trigonométricas simples de senos e cossenos. Isto é, simplificando a visualização e manipulação de funções complexas.
              </Typography>
            </Box>
          </Fade>
        )}
       
          A lei teve impacto duradouro na ciência, sendo a base para estudos de transferência de calor em sólidos, isolamento térmico e diversas aplicações industriais e tecnológicas. Fourier é lembrado como um pioneiro na matemática aplicada e na termodinâmica.
          Sua contribuição é ainda fundamental em muitas áreas da ciência e engenharia, como no estudo da condução de calor em materiais e sistemas complexos. No campo da engenharia de materiais, a Lei de Fourier é usada para projetar e otimizar trocadores de calor.
          Além disso, a lei de Fourier está intrinsecamente ligada ao conceito de transformadas de Fourier, um método matemático fundamental em análise de sinais e imagem. As aplicações dessa técnica são observadas em áreas como compressão de imagens digitais e processamento de áudio.
          </Typography>
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
