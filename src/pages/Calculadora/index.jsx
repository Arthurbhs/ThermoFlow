import { useState } from "react";
import Header from "../../components/Header";
import CalculadoraPlana from "../../components/calculadoraPlana";
import CalculadoraCilindro from "../../components/calculadoraCilindro";
import CalculadoraEsferico from "../../components/CalculadoraEsferica";
import { Box, Button, ButtonGroup } from "@mui/material";

const CalculadoraCoe = () => {
  const [selecionado, setSelecionado] = useState("plana");

  return (
    <Box sx={{ margin: "-10px", textAlign: "center" }}>
      <Header />

      <ButtonGroup variant="contained" sx={{ margin: "20px 0" }}>
        <Button onClick={() => setSelecionado("plana")} color="primary">
          Plana
        </Button>
        <Button onClick={() => setSelecionado("cilindro")} color="secondary">
          Cilíndrica
        </Button>
        <Button onClick={() => setSelecionado("esferico")} color="success">
          Esférica
        </Button>
      </ButtonGroup>

      {selecionado === "plana" && <CalculadoraPlana />}
      {selecionado === "cilindro" && <CalculadoraCilindro />}
      {selecionado === "esferico" && <CalculadoraEsferico />}
    </Box>
  );
};

export default CalculadoraCoe;
