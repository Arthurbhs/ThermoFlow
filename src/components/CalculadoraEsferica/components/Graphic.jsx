import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ZAxis } from "recharts";

const BubbleChart = ({ selectedMaterials }) => {
  const data = selectedMaterials.map((layer, index) => {
    const r1 = parseFloat(layer.r1) || 0;
    const r2 = parseFloat(layer.r2) || 0;
    const thickness = Math.max((r2 - r1) * 10, 5); // Tamanho da bolha aumentado

    return {
      material: `Camada ${index + 1}: ${layer.material}`,
      k: parseFloat(layer.k) || 0,  // Condutividade térmica no eixo X
      r2,  // Raio Externo no eixo Y
      thickness, // Tamanho da bolha
    };
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart margin={{ top: 20, right: 30, bottom: 50, left: 30 }}>  {/* Aumentando a margem inferior */}
        <CartesianGrid strokeDasharray="3 3" />
        
        {/* Ajustando a posição do eixo X */}
        <XAxis 
          type="number" 
          dataKey="k" 
          name="Condutividade Térmica (W/mK)" 
          label={{ value: "Condutividade Térmica (W/mK)", position: "bottom", offset: 35 }}  
        />
        
        {/* Eixo Y */}
        <YAxis 
          type="number" 
          dataKey="r2"  
          name="Raio Externo (m)" 
          label={{ value: "Raio Externo (m)", angle: -90, position: "insideLeft" }} 
        />

        {/* Ajuste ZAxis para controle do tamanho das bolhas */}
        <ZAxis dataKey="thickness" range={[500, 5000]} name="Espessura da Camada (m)" />

        {/* Tooltip */}
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        
        {/* Ajuste da legenda */}
        <Legend 
          layout="vertical" 
          verticalAlign="top" 
          align="right" 
          wrapperStyle={{ top: 0, left: '90%' }} 
        />
        
        {/* Gráfico de Bolhas */}
        <Scatter 
          name="Materiais" 
          data={data} 
          fill="#8884d8" 
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default BubbleChart;
