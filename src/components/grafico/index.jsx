import React from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from "chart.js";
import { Box, Typography } from "@mui/material";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

const HeatTransferChart = ({ layers, deltaT }) => {
  const resistances = layers.map((layer, index) => {
    const k = parseFloat(layer.k);
    const r1 = parseFloat(layer.r1);
    const r2 = parseFloat(layer.r2);

    if (!isNaN(k) && !isNaN(r1) && !isNaN(r2) && k > 0 && r1 > 0 && r2 > r1) {
      return (1 / (4 * Math.PI * k)) * ((1 / r1) - (1 / r2));
    }
    return 0;
  });

  const totalResistance = resistances.reduce((sum, r) => sum + r, 0);
  const heatFlux = totalResistance > 0 ? (parseFloat(deltaT) || 0) / totalResistance : 0;

  // Dados para o gráfico de barras (Resistência térmica por camada)
  const barData = {
    labels: layers.map((_, i) => `Camada ${i + 1}`),
    datasets: [
      {
        label: "Resistência Térmica (m².K/W)",
        data: resistances,
        backgroundColor: "rgba(115, 0, 255, 0.7)",
        borderColor: "rgba(115, 0, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Dados para o gráfico de linha (Fluxo de Calor)
  const lineData = {
    labels: ["Início", "Médio", "Final"],
    datasets: [
      {
        label: "Fluxo de Calor (W)",
        data: [heatFlux, heatFlux, heatFlux],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.4,
      },
    ],
  };

  return (
    <Box sx={{ marginTop: "20px", padding: "15px", borderRadius: "8px", backgroundColor: "#f4f4f4" }}>
      <Typography variant="h6" gutterBottom>
        Análise Gráfica
      </Typography>

      <Box sx={{ marginBottom: "20px" }}>
        <Typography variant="subtitle1">Resistência Térmica por Camada</Typography>
        <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: true } } }} />
      </Box>

      <Box>
        <Typography variant="subtitle1">Fluxo de Calor Total</Typography>
        <Line data={lineData} options={{ responsive: true, plugins: { legend: { display: true } } }} />
      </Box>
    </Box>
  );
};

export default HeatTransferChart;
