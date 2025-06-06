import React, { useState } from 'react';
import {
  Modal, Box, TextField, Button, Typography, Stack
} from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../../AuthContext';
import { db } from '../../firebase';

const CreateMaterialModal = ({ open, onClose, onMaterialCreated }) => {
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [density, setDensity] = useState('');
  const [conductivityDry, setConductivityDry] = useState('');
  const [conductivityWet, setConductivityWet] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [thumbnail, setThumbnail] = useState('');

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

  // Permite apenas dígitos e UM ponto
  if (/^[0-9]*\.?[0-9]*$/.test(value) || value === '') {
    setter(value);
  }
};


  const handleSubmit = async () => {
    if (!name || !type || !density || !conductivityDry) {
      alert('Preencha pelo menos: Nome, Tipo, Densidade e Condutividade Térmica (seco).');
      return;
    }

  const material = {
  name,
  type,
  density: parseFloat(density),
  thermalConductivityDry: parseFloat(conductivityDry),
  thermalConductivityWet: conductivityWet ? parseFloat(conductivityWet) : null,
  description: description || '',
  image: image || '',
  thumbnail: thumbnail || '',
  userId: user.uid,
  createdAt: new Date(),
};


    try {
      const docRef = await addDoc(collection(db, 'user_materials'), material);
      onMaterialCreated({ id: docRef.id, ...material });
      onClose();
      // Limpa o formulário
      setName('');
      setType('');
      setDensity('');
      setConductivityDry('');
      setConductivityWet('');
      setDescription('');
      setImage('');
      setThumbnail('');
    } catch (error) {
      console.error('Erro ao criar material:', error);
      alert('Erro ao criar material. Verifique sua conexão.');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          backgroundColor: 'white',
          p: 4,
          borderRadius: 2,
          maxWidth: 600,
          maxHeight: '90vh',
          overflowY: 'auto',
          margin: '5vh auto',
        }}
      >
        <Typography variant="h6" mb={2}>
          Criar Novo Material
        </Typography>

        <Stack spacing={2}>
          <TextField label="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
          <TextField label="Tipo" value={type} onChange={(e) => setType(e.target.value)} required />
        <TextField
  label="Densidade (kg/m³)"
  value={density}
  onChange={(e) => handleNumberInput(e, setDensity)}
  inputProps={{ inputMode: 'decimal', pattern: '^[0-9]*\\.?[0-9]*$' }}
  required
/>

<TextField
  label="Condutividade Térmica (seco)"
  value={conductivityDry}
  onChange={(e) => handleNumberInput(e, setConductivityDry)}
  inputProps={{ inputMode: 'decimal', pattern: '^[0-9]*\\.?[0-9]*$' }}
  required
/>

<TextField
  label="Condutividade Térmica (molhado) (opcional)"
  value={conductivityWet}
  onChange={(e) => handleNumberInput(e, setConductivityWet)}
  inputProps={{ inputMode: 'decimal', pattern: '^[0-9]*\\.?[0-9]*$' }}
/>
 <TextField label="Descrição (opcional)" multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />

          {/* Upload de imagem */}
          <Box>
            <Typography variant="body2" mb={1}>Imagem Principal (opcional)</Typography>
            <Button variant="contained" component="label">
              Enviar Imagem
              <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, setImage)} />
            </Button>
            {image && <Typography variant="caption">Imagem carregada ✔️</Typography>}
          </Box>

          <Box>
            <Typography variant="body2" mb={1}>Thumbnail (opcional)</Typography>
            <Button variant="contained" component="label">
              Enviar Thumbnail
              <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, setThumbnail)} />
            </Button>
            {thumbnail && <Typography variant="caption">Thumbnail carregado ✔️</Typography>}
          </Box>

          <Button variant="contained" onClick={handleSubmit}>
            Salvar Material
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default CreateMaterialModal;
