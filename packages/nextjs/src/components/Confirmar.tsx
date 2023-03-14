import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import React, { useState } from 'react'

export default function Confirmar() {
  const [getEstado, setEstado] = useState(false)

  const handleEstadoModal = () => {
    setEstado(!getEstado)
  }
  return (
    <React.Fragment>
      <Button onClick={handleEstadoModal}>Crear</Button>
      <Dialog
        hideBackdrop
        open={getEstado}
        onClose={handleEstadoModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Aceptar</Button>
          <Button onClick={handleClose} autoFocus>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
