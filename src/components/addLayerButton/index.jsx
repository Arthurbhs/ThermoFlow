import React from "react";
import { Button } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const AddLayerButton = ({ onClick }) => {
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      startIcon={<AddCircleIcon />}
      sx={{
        marginBottom: "20px",
        color: "#7300ff",
        borderColor: "#7300ff",
        "&:hover": { backgroundColor: "#7300ff", color: "white" },
      }}
    >
      Adicionar Camada
    </Button>
  );
};

export default AddLayerButton;
