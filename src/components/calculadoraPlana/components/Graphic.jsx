import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

const ThermalConductivityChart = ({ selectedMaterials }) => {
  if (!selectedMaterials || selectedMaterials.length === 0) {
    console.warn("Nenhum material selecionado para o gráfico.");
    return null;
  }

  console.log("Materiais Selecionados para o Gráfico:", selectedMaterials);

  const data = selectedMaterials.map((material, index) => ({
    name: `Camada ${index + 1}: ${material.name}`,
    thermalConductivity: parseFloat(material.thermalConductivity) || 0, 
    area: parseFloat(material.area) || 0,  
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" label={{ value: "W/m·K", angle: -90, position: "insideLeft" }} />
        <YAxis yAxisId="right" orientation="right" label={{ value: "m²", angle: -90, position: "insideRight" }} />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="thermalConductivity" fill="#8884d8" name="Condutividade Térmica (W/m·K)" />
        <Bar yAxisId="right" dataKey="area" fill="#82ca9d" name="Área (m²)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ThermalConductivityChart;
