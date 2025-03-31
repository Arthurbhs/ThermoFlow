import React, { useState } from "react";
import { TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";

const normalizeText = (text) => {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
};

const MaterialSelector = ({ materials, selectedMaterial, selectedState, onMaterialChange, onStateChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  const filteredMaterials = materials.filter(material =>
    normalizeText(material.name).includes(normalizeText(searchTerm))
  );

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
        MenuProps={{ PaperProps: { style: { maxHeight: 250 } }, disableListWrap: true, autoFocus: false }}
      >
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

      {selectedMaterial && (
        <FormControl fullWidth style={{ marginTop: 10 }}>
          <InputLabel>Estado</InputLabel>
          <Select value={selectedState} onChange={(e) => onStateChange(e.target.value)}>
            <MenuItem value="seco">Seco</MenuItem>
            <MenuItem value="molhado">Molhado</MenuItem>
          </Select>
        </FormControl>
      )}
    </FormControl>
  );
};

export default MaterialSelector;
