import { Box, Button, Modal, TextField } from '@mui/material'
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

import { useBlockchainContext } from '@/context/BlockchainProvider'
import { ethers } from 'ethers'
import { EsNuevoContext } from './VistaTokens'

export default function NuevoModificaToken() {
  const contexto = React.useContext(EsNuevoContext)
  const [getContrato, setContrato] = useState<string>(contexto?.contrato ?? '')
  const [getOraculo, setOraculo] = useState<string>(contexto?.oraculo ?? '')
  const [getEstadoModal, setEstadoModal] = useState(false)
  const [error, setError] = useState<boolean>(false)

  const { actions } = useBlockchainContext()

  const { nuevoToken, modificarOraculoToken } = actions

  const handleMostrarOcultarModal = () => {
    setEstadoModal(!getEstadoModal)
  }
  const handleCrear = () => {
    if (
      contexto == undefined &&
      ethers.utils.isAddress(getContrato) &&
      ethers.utils.isAddress(getOraculo)
    ) {
      nuevoToken(getContrato, getOraculo)
      setEstadoModal(!getEstadoModal)
    } else if (contexto != undefined && ethers.utils.isAddress(getOraculo)) {
      modificarOraculoToken(contexto?.ticker, getOraculo)
      setEstadoModal(!getEstadoModal)
    } else {
      setError(true)
    }
  }

  return (
    <>
      <Button
        sx={{ mr: 1 }}
        variant="contained"
        onClick={handleMostrarOcultarModal}
      >
        {contexto == undefined ? 'Nuevo' : 'Modificar'}
      </Button>
      <Modal
        open={getEstadoModal}
        onClose={handleMostrarOcultarModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <Box>
            <h2>
              {contexto == undefined
                ? 'Creación de Nuevo Token'
                : 'Modificación'}
            </h2>
            <TextField
              required
              fullWidth
              disabled={contexto == undefined ? false : true}
              id="contrato-required"
              label="Contrato"
              variant="standard"
              value={getContrato}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setContrato(event.target.value.trim())
              }
            />
            <TextField
              required
              fullWidth
              id="oraculo-required"
              label="Oraculo"
              variant="standard"
              value={getOraculo}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setOraculo(event.target.value.trim())
              }
            />
            {error && <h3>Ingrese parametros validos</h3>}
          </Box>

          <Box
            display="flex"
            sx={{ mt: 2, mb: -1 }}
            justifyContent="space-around"
          >
            <Button onClick={handleCrear}>
              {contexto == undefined ? 'Crear' : 'Modificar'}
            </Button>
            <Button onClick={handleMostrarOcultarModal}>Cancelar</Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}
