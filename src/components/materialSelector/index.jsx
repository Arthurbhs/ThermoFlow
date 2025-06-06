import React, { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";

import {collection,getDocs,query,where,addDoc,deleteDoc,doc,
} from "firebase/firestore";
import MaterialCreate from "../MaterialCreate"; // ajuste o caminho conforme seu projeto
import { db } from "../../firebase";
import { useAuth } from "../../AuthContext";



const normalizeText = (text) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const MaterialSelector = ({
  selectedMaterial,
  selectedState,
  onMaterialChange,
  onStateChange,
}) => {
  const { user } = useAuth();

  const [apiMaterials, setApiMaterials] = useState([]);
  const [userMaterials, setUserMaterials] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // 🔥 Fetch materiais e favoritos
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Materiais da API
        const res = await fetch(
          "https://minha-api-workers.apimateriallistcalculator.workers.dev/src/index"
        );
        const data = await res.json();
        setApiMaterials(data);

        // Materiais do usuário
        let userMats = [];
        if (user?.uid) {
          const q = query(
            collection(db, "user_materials"),
            where("userId", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);
          userMats = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserMaterials(userMats);

          // Favoritos
          const favQuery = query(
            collection(db, "favorites"),
            where("userId", "==", user.uid)
          );
          const favSnapshot = await getDocs(favQuery);
          const favs = favSnapshot.docs.map((doc) => ({
            id: doc.id,
            materialName: doc.data().materialName,
          }));
          setFavorites(favs);
        }
      } catch (error) {
        console.error("Erro ao buscar materiais:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // 🔧 Lista total de materiais
  const allMaterials = [...userMaterials, ...apiMaterials];

  // 🔥 Aplicar favoritos no topo
  const sortedMaterials = [
    // Favoritos primeiro
    ...allMaterials.filter((mat) =>
      favorites.some((fav) => fav.materialName === mat.name)
    ),
    // Depois materiais do usuário (não favoritos)
    ...allMaterials.filter(
      (mat) =>
        !favorites.some((fav) => fav.materialName === mat.name) &&
        userMaterials.some((um) => um.name === mat.name)
    ),
    // Depois materiais da API (não favoritos)
    ...allMaterials.filter(
      (mat) =>
        !favorites.some((fav) => fav.materialName === mat.name) &&
        !userMaterials.some((um) => um.name === mat.name)
    ),
  ];

  // 🔍 Filtro por busca
  const filteredMaterials = sortedMaterials.filter((material) =>
    normalizeText(material.name).includes(normalizeText(searchTerm))
  );

  // ⭐ Verifica se é favorito
  const isFavorite = (materialName) =>
    favorites.some((fav) => fav.materialName === materialName);

  // ⭐ Adiciona ou remove favorito
  const toggleFavorite = async (materialName) => {
    if (!user?.uid) return;

    const favorite = favorites.find((f) => f.materialName === materialName);

    if (favorite) {
      // Remover
      try {
        await deleteDoc(doc(db, "favorites", favorite.id));
        setFavorites((prev) =>
          prev.filter((f) => f.materialName !== materialName)
        );
      } catch (err) {
        console.error("Erro ao remover favorito:", err);
      }
    } else {
      // Adicionar
      try {
        const docRef = await addDoc(collection(db, "favorites"), {
          userId: user.uid,
          materialName,
        });
        setFavorites((prev) => [
          ...prev,
          { id: docRef.id, materialName: materialName },
        ]);
      } catch (err) {
        console.error("Erro ao adicionar favorito:", err);
      }
    }
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Material</InputLabel>
      <Select
        value={selectedMaterial}
        onChange={(e) => onMaterialChange(e.target.value)}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        displayEmpty
        renderValue={(selected) => selected || "Selecione um material"}
        MenuProps={{
          PaperProps: { style: { maxHeight: 250 } },
          disableListWrap: true,
          autoFocus: false,
        }}
      >
        <MenuItem
  onClick={() => {
    setCreateModalOpen(true);
    setOpen(false); // fecha o select para abrir modal
  }}
  sx={{ fontWeight: "bold", color: "primary.main" }}
>
  + Criar material
</MenuItem>

        <MenuItem disableRipple>
          <TextField
            placeholder="Buscar Material..."
            variant="standard"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </MenuItem>

        {loading ? (
          <MenuItem disabled>
            <CircularProgress size={20} sx={{ mr: 1 }} /> Carregando...
          </MenuItem>
        ) : filteredMaterials.length > 0 ? (
          filteredMaterials.map((material) => (
            <MenuItem
              key={material.id || material.name}
              value={material.name}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {material.name}
              <Box display="flex" gap={1}>
                <Tooltip
                  title={
                    <Box>
                      <Typography variant="body2">
                        <strong>Condutividade Seca:</strong>{" "}
                        {material.thermalConductivityDry ??
                          material.conductivityDry ??
                          "N/A"}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Condutividade Molhada:</strong>{" "}
                        {material.thermalConductivityWet ??
                          material.conductivityWet ??
                          "N/A"}
                      </Typography>
                    </Box>
                  }
                >
                  <IconButton
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                {user && (
                  <Tooltip
                    title={
                      isFavorite(material.name)
                        ? "Remover dos favoritos"
                        : "Adicionar aos favoritos"
                    }
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(material.name);
                      }}
                    >
                      {isFavorite(material.name) ? (
                        <StarIcon fontSize="small" color="warning" />
                      ) : (
                        <StarBorderIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>Nenhum material encontrado</MenuItem>
        )}
      </Select>

      {selectedMaterial && (
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={selectedState}
            onChange={(e) => onStateChange(e.target.value)}
          >
            <MenuItem value="seco">Seco</MenuItem>
            <MenuItem value="molhado">Molhado</MenuItem>
          </Select>
          
        </FormControl>
        
      )}
      {createModalOpen && (
  <MaterialCreate
    open={createModalOpen}
    onClose={() => setCreateModalOpen(false)}
    onMaterialCreated={(newMaterial) => {
      setUserMaterials((prev) => [...prev, newMaterial]);
      setCreateModalOpen(false);
      onMaterialChange(newMaterial.name); // opcional: já seleciona o novo material
    }}
  />
)}

    </FormControl>
    
  );
  
};

export default MaterialSelector;
