import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
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
import { keyframes } from "@emotion/react";

// Lista de ícones
const ICONS = [Functions, Calculate, Percent, AddCircle, RemoveCircle, Done, Repeat, Star];

// Animação
const fallAnimation = keyframes`
  0% {
    transform: translateY(-80px);
  }
  100% {
    transform: translateY(107vh);
  }
`;

const FallingIcons = () => {
  const [icons, setIcons] = useState([]);

  const addIcon = () => {
    const IconComponent = ICONS[Math.floor(Math.random() * ICONS.length)];
    const icon = {
      id: Date.now() + Math.random(),
      positionX: Math.random() * window.innerWidth,
      IconComponent,
    };
    setIcons((prev) => [...prev, icon]);

    setTimeout(() => {
      setIcons((prev) => prev.filter((i) => i.id !== icon.id));
    }, 5000);
  };

  useEffect(() => {
    const interval = setInterval(addIcon, 800); // frequência dos ícones
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {icons.map(({ id, positionX, IconComponent }) => (
        <Box
          key={id}
          sx={{
            position: "fixed",
            left: positionX,
            top: 0,
            animation: `${fallAnimation} 5s linear`,
            color: "#e89be3",
            fontSize: 30,
            zIndex: 1,
            pointerEvents: "none", // 👈 Não interfere nos cliques
          }}
        >
          <IconComponent />
        </Box>
      ))}
    </>
  );
};

export default FallingIcons;
