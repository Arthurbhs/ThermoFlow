import React, { useEffect, useState } from "react";
import {Box,Typography,List,ListItem,ListItemText,Button,useTheme,IconButton
} from "@mui/material";
import { useAuth } from "../../../AuthContext";
import {collection,query,where,orderBy,deleteDoc,doc,onSnapshot,getDocs
} from "firebase/firestore";
import { db } from "../../../firebase";
import DeleteIcon from "@mui/icons-material/Delete";

const HistoryPlaneFirestore = () => {
  const [history, setHistory] = useState([]);
  const theme = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "history"),
      where("userId", "==", user.uid),
      where("calculatorType", "==", "conduction_spherical"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistory(data);
    });

    return () => unsubscribe();
  }, [user]);

   const handleClear = async () => {
    if (!user) return;
  
    try {
      const q = query(
        collection(db, "history"),
        where("userId", "==", user.uid),
        where("calculatorType", "==", "conduction_spherical")
      );
  
      const querySnapshot = await getDocs(q);
  
      const deletePromises = querySnapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, "history", docSnap.id))
      );
  
      await Promise.all(deletePromises);
      console.log("Histórico esférico apagado do Firestore.");
    } catch (error) {
      console.error("Erro ao limpar histórico:", error);
    }
  };

   const handleDeleteItem = async (id) => {
      try {
        await deleteDoc(doc(db, "history", id));
        console.log(`Documento ${id} deletado com sucesso.`);
      } catch (error) {
        console.error("Erro ao deletar documento:", error);
      }
    };
  
 const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";
  try {
    return timestamp.toDate
      ? timestamp.toDate().toLocaleString()
      : new Date(timestamp).toLocaleString();
  } catch (error) {
    return "Data inválida";
  }
};
  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "5px auto",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: 3,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Histórico de Condução Esférica
      </Typography>
      <List>
        {history.length === 0 ? (
          <Typography variant="body2">Nenhum histórico encontrado.</Typography>
        ) : (
          history.map((entry, index) => (
             <ListItem
              key={entry.id}
              sx={{
                textAlign: "left",
                borderBottom: `1px solid ${theme.palette.divider}`,
                alignItems: "flex-start",
              }}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  color="error"
                  onClick={() => handleDeleteItem(entry.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
               <ListItemText
                primary={
                  <Typography variant="body1" sx={{ textAlign: "left" }}>
                    ΔT: {entry.deltaT}K 
                    Resistência: {Number(entry.totalResistance).toFixed(6)} K/W | Fluxo: {entry.heatFlux} W
                  </Typography>
                }
                secondary={
                  <Box sx={{ textAlign: "left", color: theme.palette.text.secondary }}>
                    📅 Data:{" "}
                    {formatDate(entry.timestamp)}        
                     <ul style={{ paddingLeft: "16px", margin: 0 }}>
                      {entry.layers &&
                        entry.layers.map((layer, i) => (
                          <li key={i}>
                            🔹 <strong>Material:</strong> {layer.material || "N/A"} |{" "}
                            <strong>r1:</strong> {layer.r1 || "N/A"} m |{" "}
                            <strong>r2:</strong> {layer.r2 || "N/A"} m |{" "}
                            <strong>Estado:</strong> {layer.state || "seco"}
                          </li>
                        ))}
                    </ul>
                  </Box>
                }
              />
            </ListItem>
          ))
        )}
      </List>
      {history.length > 0 && (
        <Button
          variant="contained"
          color="error"
          onClick={handleClear}
          sx={{ marginTop: "10px" }}
        >
          Limpar Histórico
        </Button>
      )}
    </Box>
  );
};

export default HistoryPlaneFirestore;
