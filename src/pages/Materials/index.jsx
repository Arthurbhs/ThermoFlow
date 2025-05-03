// src/pages/MaterialSelectionPage.jsx
import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import Header from "../../components/Header"
import MaterialsButton from "../../components/MaterialButton";
import MaterialDisplay from "../../components/MaterialShow";

const MaterialSelectionPage = () => {
  const [materials, setMaterials] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await fetch("https://materialsapi.onrender.com/materials");
        const data = await res.json();
        setMaterials(data);
        setSelected(data[0]); // seleciona o primeiro por padrão
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar materiais:", err);
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  if (loading) {
    return (
      
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        
        <CircularProgress />
      </Box>
    );
  }

  return (
<Box>          
  <Header/>

  {/* Painel principal à esquerda */}
  <Box flex={1}>
    <MaterialDisplay material={selected} />
  </Box>

  <Box mt={4}>
  <Typography
    variant="h6"
    mb={2}
    sx={{
      textAlign: 'center',
      color: 'purple',
      fontWeight: 'bold',
    }}
  >
    Selecione um material
  </Typography>

  <Grid
    container
    spacing={2}
    sx={(theme) => ({
      backgroundColor:
        theme.palette.mode === 'dark' ? theme.palette.grey[900] : '#ffffff',
      padding: 2,
      borderRadius: 2,
    })}
  >
    {materials.map((mat, index) => (
      <Grid item key={index} sx={{ width: '10%' }}>
        <MaterialsButton
          material={mat}
          onSelect={setSelected}
          isSelected={mat.id === selected?.id}
        />
      </Grid>
    ))}
  </Grid>
</Box>

</Box>

  );
};

export default MaterialSelectionPage;
