import { TiposOrdenes } from '@/types.d'
import { Box, Button, Modal } from '@mui/material'
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
import { OrdenContext } from './VistaOrdenes'

export default function EjecutarOrden() {
  const { actions } = useBlockchainContext()

  const contexto = React.useContext(OrdenContext)
  const [getEstadoModal, setEstadoModal] = useState(false)

  const { ejecutarOrden } = actions

  const handleModalNuevo = () => {
    setEstadoModal(!getEstadoModal)
  }
  const handleEjecutar = () => {
    console.log('Ejecutado')
    ejecutarOrden(contexto?.idOrden)
    setEstadoModal(!getEstadoModal)
  }

  return (
    <>
      <Button variant="contained" onClick={handleModalNuevo}>
        Ejecutar
      </Button>
      <Modal
        open={getEstadoModal}
        onClose={handleModalNuevo}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 600 }}>
          <Box>
            <h2>Resumen de Orden</h2>
            <h2>Recibo: {contexto?.montoVenta + ' ' + contexto?.tokenVenta}</h2>
            <h2>
              Cambio:
              {(contexto?.tipo == TiposOrdenes.compraVenta
                ? contexto?.montoCompra
                : 'traer del oraculo') +
                ' ' +
                contexto?.tokenCompra}
            </h2>
            {contexto?.tipo == TiposOrdenes.compraVenta && (
              <h2>Razon de Conversión: {'traer de chainlink'}</h2>
            )}
          </Box>
          <Button onClick={handleEjecutar}>Ejecutar</Button>
          <Button onClick={handleModalNuevo}>Cancelar</Button>
        </Box>
      </Modal>
    </>
  )
}
