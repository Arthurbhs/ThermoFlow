// src/pages/MaterialSelectionPage.jsx
import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import Header from "../../components/Header"
import MaterialsButton from "../../components/MaterialButton";
import MaterialDisplay from "../../components/MaterialShow";
import CreateMaterialModal from '../../components/MaterialCreate';

import { useAuth } from '../../AuthContext';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase"; 



const MaterialSelectionPage = () => {
  const [materials, setMaterials] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);

const { user } = useAuth();

 useEffect(() => {
  const fetchMaterials = async () => {
    try {
      const res = await fetch("https://minha-api-workers.apimateriallistcalculator.workers.dev/src/index");
      const data = await res.json();

      let userMaterials = [];
     if (user?.uid) {
  const q = query(
    collection(db, "user_materials"),
    where("userId", "==", user.uid)
  );


        const querySnapshot = await getDocs(q);
        userMaterials = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }

      const allMaterials = [...data, ...userMaterials];

      setMaterials(allMaterials);
      setSelected(allMaterials[0]);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao buscar materiais:", err);
      setLoading(false);
    }
  };

  fetchMaterials();
}, [user]);


  if (loading) {
    return (
      
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        
        <CircularProgress />
      </Box>
    );
  }
  const handleDeleteMaterial = (id) => {
  setMaterials((prev) => prev.filter((material) => material.id !== id));
};

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

  <Box mt={4}>

  <Box display="flex" justifyContent="center">
    <Grid
      container
      spacing={2}
      justifyContent="center"
      sx={(theme) => ({
        backgroundColor:
          theme.palette.mode === 'dark' ? theme.palette.grey[900] : '#ffffff',
        padding: 2,
        borderRadius: 2,
        width: '100%',
        maxWidth: 1200,
        margin: '0 auto', // centraliza horizontalmente
      })}
    >
      {materials.map((mat, index) => (
        <Grid
          item
          key={index}
          xs={6}   // 2 colunas no celular
          sm={3}   // 4 colunas em tablets
          md={2.4} // 5 colunas em desktop
        >
          <MaterialsButton
            material={mat}
            onSelect={setSelected}
            isSelected={mat.id === selected?.id}
             onDelete={handleDeleteMaterial}
          />
        </Grid>
      ))}
      {user?.uid && (
  <Grid item xs={6} sm={3} md={2.4}>
    <MaterialsButton
      onDelete={handleDeleteMaterial}
      material={{
        name: "Criar",
        thumbnail: "https://img.icons8.com/ios-filled/100/plus-math.png",
      }}
      onSelect={() => setOpenCreateModal(true)}
      isSelected={false}
    />
  </Grid>
)}


    </Grid>
  </Box>
</Box>
<CreateMaterialModal
  open={openCreateModal}
  onClose={() => setOpenCreateModal(false)}
  onMaterialCreated={(newMaterial) => {
    setMaterials(prev => [...prev, newMaterial]);
    setSelected(newMaterial);
  }}
/>
</Box>

</Box>

  );
};

export default MaterialSelectionPage;
