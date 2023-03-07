import { BlockchainContext } from '@/context/BlockchainContext'
import { Box, Button, Modal, TextField } from '@mui/material'
import { ethers } from 'ethers'
import React, { useContext, useState } from 'react'

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

export default function NuevoSuspendido() {
  const [getDireccion, setDireccion] = useState<string>('')
  const [getEstadoModal, setEstadoModal] = useState(false)
  const [error, setError] = useState<boolean>(false)
  const { actions } = useContext(BlockchainContext)

  const { bloquearBilletera } = actions

  const handleAbrirModal = () => {
    setEstadoModal(!getEstadoModal)
  }

  const handleSuspender = () => {
    console.log('Nuevo Suspendido')
    if (ethers.utils.isAddress(getDireccion)) {
      bloquearBilletera(getDireccion)
      setEstadoModal(!getEstadoModal)
    } else {
      setError(true)
    }
  }

  return (
    <>
      <Button variant="contained" onClick={handleAbrirModal}>
        Suspender
      </Button>
      <Modal
        open={getEstadoModal}
        onClose={handleAbrirModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <Box>
            <h2>Suspender Billetera</h2>
            <TextField
              required
              id="direccion-required"
              label="direccion"
              variant="standard"
              value={getDireccion}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setDireccion(event.target.value.trim())
              }
            />
            {error && <h3>Ingrese parametros validos</h3>}
          </Box>
          <Button onClick={handleSuspender}>Suspender</Button>
        </Box>
      </Modal>
    </>
  )
}
