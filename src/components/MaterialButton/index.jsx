import { Box, IconButton, Tooltip, Typography, Snackbar, Alert } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from "../../AuthContext";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useState } from "react";

const MaterialsButton = ({ material, onSelect, isSelected, onDelete }) => {
  const { user } = useAuth();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleDelete = async (e) => {
    e.stopPropagation(); // ⚠️ Impede que o clique no botão acione o onClick do card

    const confirm = window.confirm("Deseja realmente excluir este material?");
    if (confirm) {
      try {
        await deleteDoc(doc(db, "user_materials", material.id));
        onDelete(material.id);
        setSnackbar({ open: true, message: "Material deletado com sucesso", severity: "success" });
      } catch (err) {
        console.error("Erro ao deletar:", err);
        setSnackbar({ open: true, message: "Erro ao deletar material", severity: "error" });
      }
    }
  };

  return (
    <>
      <Box
        onClick={() => onSelect(material)}
        sx={{
          position: 'relative',
          padding: 0,
          border: isSelected ? '2px solid' : 'none',
          borderColor: isSelected ? 'primary.main' : 'transparent',
          overflow: 'hidden',
          borderRadius: 2,
          aspectRatio: '1',
          width: '100%',
          maxWidth: 120,
          height: 'auto',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          transform: isSelected ? 'scale(1.05)' : 'none',
          '&:hover .overlay': { opacity: 1 },
          '&:active': { transform: 'scale(0.98)' },
        }}
      >
        {/* Imagem de fundo */}
        <Box
          component="img"
          src={material?.thumbnail || "https://via.placeholder.com/150"}
          alt={material?.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />

        {/* Botão deletar */}
        {material.userId === user?.uid && (
          <Tooltip title="Excluir">
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                top: 4,
                right: 4,
                backgroundColor: "#fff",
                zIndex: 10, // 🏆 Garante que fique acima de todas as camadas
                '&:hover': { backgroundColor: "#eee" }
              }}
              onClick={handleDelete}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {/* Overlay com nome */}
        <Box
          className="overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.3s',
            fontWeight: 'bold',
            textAlign: 'center',
            px: 1,
          }}
        >
          <Typography variant="body2" noWrap>
            {material?.name}
          </Typography>
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MaterialsButton;
