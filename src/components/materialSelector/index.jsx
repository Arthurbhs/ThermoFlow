import React, { useState } from "react";
import { TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";

// Função para normalizar texto (remove acentos e ignora maiúsculas/minúsculas)
const normalizeText = (text) => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const MaterialSelector = ({ materials, selectedMaterial, onChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  // Filtra os materiais ignorando acentos e maiúsculas/minúsculas
  const filteredMaterials = materials.filter(material =>
    normalizeText(material.name).includes(normalizeText(searchTerm))
  );

  return (
    <FormControl fullWidth>
      <InputLabel></InputLabel>
      <Select
        value={selectedMaterial}
        onChange={(e) => onChange(e.target.value)}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        displayEmpty
        renderValue={(selected) => selected || "Selecione um material"}
        MenuProps={{
          PaperProps: { style: { maxHeight: 250 } },
          disableListWrap: true, // Impede seleção rápida por teclas
          autoFocus: false, // Evita que o Select intercepte teclas
        }}
      >
        {/* Barra de pesquisa dentro do Select */}
        <MenuItem disableRipple>
          <TextField
            placeholder="Buscar Material..."
            variant="standard"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            onClick={(e) => e.stopPropagation()} // Impede o fechamento do menu
            onMouseDown={(e) => e.stopPropagation()} // Impede fechamento ao clicar
            onKeyDown={(e) => e.stopPropagation()} // Impede que teclas acionem seleção rápida
          />
        </MenuItem>

        {/* Lista filtrada de materiais */}
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map((material, index) => (
            <MenuItem key={index} value={material.name}>
              {material.name}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>Nenhum material encontrado</MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default MaterialSelector;
