import { useBlockchainContext } from '@/context/BlockchainProvider'
import { Box, Button, Modal, TextField } from '@mui/material'
import { ethers } from 'ethers'
import React, { useState } from 'react'

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
}

export default function NuevoAdministrador() {
  const [getDireccion, setDireccion] = useState('')
  const [getEstadoModal, setEstadoModal] = useState(false)
  const [error, setError] = useState<boolean>(false)

  const { getters, actions } = useBlockchainContext()
  const { transaccion } = getters
  const { nuevoAdministrador } = actions

  const handleAbrirModal = () => {
    setEstadoModal(!getEstadoModal)
  }

  const handleOnChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setDireccion(event.target.value.trim())
  }

  const handleAgregar = async () => {
    const { error } = transaccion
    if (ethers.utils.isAddress(getDireccion)) {
      await nuevoAdministrador(getDireccion)
      !error ? setEstadoModal(!getEstadoModal) : setError(true)
    } else {
      setError(true)
    }
  }

  return (
    <>
      <Button variant="contained" onClick={handleAbrirModal}>
        Nuevo Administrador
      </Button>
      <Modal
        open={getEstadoModal}
        onClose={handleAbrirModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <Box>
            <h2>Nuevo Adminsitrador</h2>
            <TextField
              required
              id="direccion-required"
              label="direccion"
              variant="standard"
              value={getDireccion}
              onChange={handleOnChange}
            />
            {error && <h3>Ingrese parametros validos</h3>}{' '}
          </Box>
          <Button onClick={handleAgregar}>Agregar</Button>
        </Box>
      </Modal>
    </>
  )
}
