import React from "react";
import { Button } from "@mui/material";

const CalculateButton = ({ onClick, isFormValid }) => {
  return (
    <Button 
      variant="contained" 
      color="primary" 
      onClick={onClick} 
      disabled={!isFormValid} // Agora a lógica está correta
      sx={{ 
        display: "block", 
        margin: "10px auto",
        backgroundColor: isFormValid ? "#007BFF" : "#ccc", 
        cursor: isFormValid ? "pointer" : "not-allowed",
        "&.Mui-disabled": { backgroundColor: "#ccc", color: "#666" } // Corrige o visual quando desativado
      }}
    >
      Calcular
    </Button>
  );
};

export default CalculateButton;
