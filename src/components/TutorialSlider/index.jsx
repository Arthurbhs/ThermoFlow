import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Fade,
  Backdrop,
  IconButton
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloseIcon from "@mui/icons-material/Close";
import { db } from "../../firebase"; // ajuste para seu caminho
import { doc, getDoc, setDoc } from "firebase/firestore";

const TutorialModal = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: "Bem-vindo!",
      description:
        "As nossas calculadoras de transferência de calor são interativas e permitem simular a transferência de calor por convecção ou condução em estruturas compostas por várias camadas.",
      image: "/imagens/welcome.png",
    },
    {
      title: "Insira as informações!",
      description:
        "Cada camada representa um objeto. Informe a diferença de temperatura, coeficientes de convecção, dimensões e selecione o material correspondente.",
      image: "/imagens/inputs.png",
    },
    {
      title: "Resultados e Gráficos",
      description:
        "Visualize resultados como resistência térmica e fluxo de calor, e compare camadas com nossos gráficos interativos.",
      image: "/imagens/grafico.png",
    },
  ];

  const modalStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    outline: "none",
    textAlign: "center",
    zIndex: 1301,
  };

  const iconButtonStyle = {
    position: "fixed",
    bottom: 16,
    right: 16,
    zIndex: 1300,
    backgroundColor: "#a200ff",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#5a038c",
    },
  };

  const current = slides[step];

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setStep(0);
  };

  const handleNext = async () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
      if (user?.uid) {
       await setDoc(doc(db, "tutorial_status", user.uid), {
  seen: true,
  userId: user.uid, // útil para as regras de segurança
});
      }
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  // Abre automaticamente se for a primeira vez
  useEffect(() => {
  console.log("TutorialModal mounted");
  if (!user) {
    console.log("User not ready");
    return;
  }

  const checkIfSeen = async () => {
    console.log("Checking tutorial view for user:", user.uid);
    const docRef = doc(db, "tutorial_status", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log("Tutorial never seen. Opening modal...");
      setOpen(true);
    } else {
      console.log("Tutorial already seen.");
    }
  };

  checkIfSeen();
}, [user]);



  return (
    <>
      <IconButton onClick={handleOpen} sx={iconButtonStyle}>
        <HelpOutlineIcon />
      </IconButton>

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <Box sx={modalStyle}>
            <IconButton
              onClick={handleClose}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>

            <Typography variant="h6" gutterBottom>
              {current.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {current.description}
            </Typography>
            {current.image && (
              <Box
                component="img"
                src={current.image}
                alt={current.title}
                sx={{ width: "100%", maxHeight: 200, objectFit: "contain", my: 2 }}
              />
            )}
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button onClick={handleBack} disabled={step === 0}>
                Anterior
              </Button>
              <Button onClick={handleNext}>
                {step === slides.length - 1 ? "Finalizar" : "Próximo"}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default TutorialModal;
