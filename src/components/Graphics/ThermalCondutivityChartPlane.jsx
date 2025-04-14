import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const ThermalConductivityChartPlane = ({ selectedMaterials }) => {
  console.log("Dados recebidos:", selectedMaterials);

  // Preparando os dados para o gráfico
  const data = selectedMaterials.map((layer, index) => ({
    name: `Camada ${(index + 1)}: ${layer.material}`,
    k: layer.thermalConductivity,  // Agora bate com o nome certo
    length: parseFloat(layer.length) || 0,
  }));
  

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        
        {/* Escala para Condutividade Térmica (W/mK) - Esquerda */}
        <YAxis 
          yAxisId="left" 
          label={{ value: "W/mK", angle: -90, position: "insideLeft" }} 
        />
        
        {/* Escala para Comprimento (m) - Direita */}
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          label={{ value: "Metros", angle: -90, position: "insideRight" }} 
        />

        <Tooltip />
        <Legend />

        {/* Barras vinculadas aos respectivos eixos */}
        <Bar yAxisId="left" dataKey="k" fill="#8884d8" name="Condutividade Térmica (W/mK)" />
        <Bar yAxisId="right" dataKey="length" fill="#82ca9d" name="Comprimento (m)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ThermalConductivityChartPlane;
