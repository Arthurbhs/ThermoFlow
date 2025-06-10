import React, { useState, useContext, useEffect } from 'react';
import {
  Modal, Box, TextField, Button, Typography, Stack
} from '@mui/material';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../AuthContext';
import { db } from '../../firebase';
import { ThemeContext } from '../../context/ThemeContext';
import ChartTitleWithPopover from '../TutorialLabel';

const CreateMaterialModal = ({
  open,
  onClose,
  onMaterialCreated,
  isEditing = false,
  editingMaterial = null,
  onMaterialUpdated
}) => {
  const { user } = useAuth();
  const { darkMode } = useContext(ThemeContext);

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [density, setDensity] = useState('');
  const [conductivityDry, setConductivityDry] = useState('');
  const [conductivityWet, setConductivityWet] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  // Preencher os campos se estiver editando
  useEffect(() => {
    if (isEditing && editingMaterial) {
      setName(editingMaterial.name || '');
      setType(editingMaterial.type || '');
      setDensity(editingMaterial.density?.toString() || '');
      setConductivityDry(editingMaterial.thermalConductivityDry?.toString() || '');
      setConductivityWet(editingMaterial.thermalConductivityWet?.toString() || '');
      setDescription(editingMaterial.description || '');
      setImage(editingMaterial.image || '');
      setThumbnail(editingMaterial.thumbnail || '');
    }
  }, [isEditing, editingMaterial]);

  const resetForm = () => {
    setName('');
    setType('');
    setDensity('');
    setConductivityDry('');
    setConductivityWet('');
    setDescription('');
    setImage('');
    setThumbnail('');
  };

  const handleImageUpload = (e, setFunction) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFunction(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleNumberInput = (e, setter) => {
    const value = e.target.value;
    if (/^[0-9]*\.?[0-9]*$/.test(value) || value === '') {
      setter(value);
    }
  };

  const handleSubmit = async () => {
    if (!name || !type || !density || !conductivityDry) {
      alert('Preencha pelo menos: Nome, Tipo, Densidade e Condutividade Térmica (seco).');
      return;
    }

    const materialData = {
      name,
      type,
      density: parseFloat(density),
      thermalConductivityDry: parseFloat(conductivityDry),
      thermalConductivityWet: conductivityWet ? parseFloat(conductivityWet) : null,
      description: description || '',
      image: image || '',
      thumbnail: thumbnail || '',
      userId: user.uid,
      updatedAt: new Date(),
    };

    try {
      if (isEditing && editingMaterial?.id) {
        const docRef = doc(db, 'user_materials', editingMaterial.id);
        await updateDoc(docRef, materialData);
        onMaterialUpdated({ id: editingMaterial.id, ...materialData });
      } else {
        const docRef = await addDoc(collection(db, 'user_materials'), {
          ...materialData,
          createdAt: new Date(),
        });
        onMaterialCreated({ id: docRef.id, ...materialData });
      }

      onClose();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar material:', error);
      alert('Erro ao salvar material. Verifique sua conexão.');
    }
  };

  return (
    <Modal open={open} onClose={() => { onClose(); resetForm(); }}>
      <Box
        sx={{
          backgroundColor: darkMode ? '#1e1e1e' : 'white',
          color: darkMode ? 'white' : 'black',
          p: 4,
          borderRadius: 2,
          maxWidth: 600,
          maxHeight: '90vh',
          overflowY: 'auto',
          margin: '5vh auto',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {isEditing ? 'Editar Material' : 'Criar Novo Material'}
          </Typography>
          <ChartTitleWithPopover description={isEditing
            ? "Altere os dados do material e clique em Salvar para atualizar."
            : "Preencha este formulário para cadastrar um novo material totalmente custuomizado."} />
        </Box>

        <Stack spacing={2}>
          {[
            { label: 'Nome', value: name, onChange: setName, desc: 'Nome do material a ser cadastrado (ex: Concreto, Alumínio).' },
            { label: 'Tipo', value: type, onChange: setType, desc: 'Categoria do material (ex: metálico, isolante, orgânico).' },
            { label: 'Densidade (kg/m³)', value: density, onChange: setDensity, desc: 'Massa por unidade de volume do material, em kg/m³.', number: true },
            { label: 'Condutividade Térmica (seco)', value: conductivityDry, onChange: setConductivityDry, desc: 'Capacidade do material seco de conduzir calor (W/m·K).', number: true },
            { label: 'Condutividade Térmica (molhado) (opcional)', value: conductivityWet, onChange: setConductivityWet, desc: 'Condutividade térmica quando o material está úmido (opcional).', number: true },
            { label: 'Descrição (opcional)', value: description, onChange: setDescription, desc: 'Observações gerais ou características adicionais do material.', multiline: true },
          ].map((field, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                label={field.label}
                value={field.value}
                onChange={(e) => field.number ? handleNumberInput(e, field.onChange) : field.onChange(e.target.value)}
                inputProps={field.number ? { inputMode: 'decimal', pattern: '^[0-9]*\\.?[0-9]*$' } : {}}
                multiline={field.multiline}
                rows={field.multiline ? 3 : 1}
                required={['Nome', 'Tipo', 'Densidade (kg/m³)', 'Condutividade Térmica (seco)'].includes(field.label)}
                fullWidth
                variant="outlined"
                sx={{
                  input: { color: darkMode ? 'white' : 'black' },
                  label: { color: darkMode ? 'white' : 'black' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: darkMode ? 'white' : 'black',
                    },
                    '&:hover fieldset': {
                      borderColor: darkMode ? '#c38fff' : '#7000b5',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: darkMode ? '#c38fff' : '#7000b5',
                    },
                  },
                }}
              />
              <ChartTitleWithPopover description={field.desc} />
            </Box>
          ))}

          {/* Uploads */}
          {[{ label: 'Imagem Principal', value: image, set: setImage, desc: 'Imagem ilustrativa do material (ex: foto ou gráfico representativo).' },
            { label: 'Thumbnail', value: thumbnail, set: setThumbnail, desc: 'Miniatura utilizada para carregamento leve e visualização rápida.' }]
            .map((img, index) => (
              <Box key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">{img.label} (opcional)</Typography>
                  <ChartTitleWithPopover description={img.desc} />
                </Box>
                <Button variant="contained" component="label">
                  Enviar {img.label}
                  <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, img.set)} />
                </Button>
                {img.value && <Typography variant="caption">{img.label} carregada ✔️</Typography>}
              </Box>
            ))}

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: darkMode ? '#c38fff' : '#7000b5',
              color: 'white',
              '&:hover': {
                backgroundColor: darkMode ? '#a96df2' : '#50008e',
              },
            }}
          >
            {isEditing ? 'Salvar Alterações' : 'Salvar Material'}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default CreateMaterialModal;
