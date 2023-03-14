import { Billetera, Token, Estados } from '@/types.d'
import { Box, Button, Modal } from '@mui/material'
import { useState } from 'react'

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

export default function CambiarEstado() {
  const [getItem, setItem] = useState<Token | Billetera>(undefined)
  const [getEstadoModal, setEstadoModal] = useState(false)

  const handleModalNuevo = () => {
    setEstadoModal(!getEstadoModal)
  }
  const handleCambiarEstado = () => {
    console.log('')
    if (getItem instanceof Token) {
      getItem.estado == Estados.activo ? getItem.Activar() : getItem.Suspender()
    } else {
      getItem.Activar()
    }
    setEstadoModal(!getEstadoModal)
  }

  return (
    <>
      <Button variant="contained" onClick={handleModalNuevo}>
        Bloquear Plataforma
      </Button>
      <Modal
        open={getEstadoModal}
        onClose={handleModalNuevo}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <Box>
            <h2>El estado de la plataforma pasará a Bloqueado.</h2>
            <h2>
              Esto implica que toda acción sobre el sitio estará deshabilitada
            </h2>
          </Box>
          <Button onClick={handleCambiarEstado}>
            {Estados[getItem.estado]}
          </Button>
        </Box>
      </Modal>
    </>
  )
}
