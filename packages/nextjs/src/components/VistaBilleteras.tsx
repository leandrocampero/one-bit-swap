import { useBlockchainContext } from '@/context/BlockchainProvider'
import { Billetera, RolesBilleteras } from '@/types.d'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  LinearProgress,
  Paper,
  Slide,
  TextField,
  Typography,
} from '@mui/material'
import { blueGrey } from '@mui/material/colors'
import { TransitionProps } from '@mui/material/transitions'
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import WindowPaper from './common/WindowPaper'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function VistaBilleteras() {
  const { getters, actions } = useBlockchainContext()
  const { administradores, transaccion, sesion } = getters
  const { cargarAdministradores, quitarAdministrador, nuevoAdministrador } =
    actions

  const [billetera, setBilletera] = useState('')
  const [cadenaBusqueda, setCadenaBusqueda] = useState('')
  const [preBusqueda, setPreBusqueda] = useState('')
  const [timeOut, setTimeOut] = useState<NodeJS.Timeout | undefined>(undefined)
  const [showModal, setShowModal] = useState<boolean>(false)

  /******************************************************************************/

  const handleOpenModal = useCallback(() => {
    setShowModal(true)
  }, [])

  const handleCloseModal = useCallback(async () => {
    setShowModal(false)
    setBilletera('')
  }, [])

  const handleRecargar = async () => {
    await cargarAdministradores()
  }

  const handleQuitarRol = useCallback(
    async (billetera: string) => {
      await quitarAdministrador(billetera)
    },
    [quitarAdministrador]
  )

  const handleAgregarAdministrador = useCallback(async () => {
    await nuevoAdministrador(billetera)
    handleCloseModal()
  }, [nuevoAdministrador, billetera, handleCloseModal])

  const handleSearchInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const cadena = event.target.value.trim()
      setPreBusqueda(cadena)

      if (timeOut) {
        clearTimeout(timeOut)
      }

      const timeOutId = setTimeout(() => {
        setCadenaBusqueda(cadena)
      }, 650)
      setTimeOut(timeOutId)
    },
    [timeOut]
  )

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setBilletera(event.target.value.trim())
    },
    []
  )

  /******************************************************************************/

  const listarBilleterasAdministradoras = useMemo(() => {
    return administradores.datos
      .filter((billetera: Billetera) =>
        billetera.direccion.toLowerCase().includes(cadenaBusqueda)
      )
      .map((billetera: Billetera, index) => {
        return (
          <Paper
            key={index}
            elevation={3}
            sx={{
              paddingX: 2,
              paddingY: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: `1px solid ${blueGrey[900]}`,
              ...(index !== 0 && { marginTop: 2 }),
            }}
          >
            <Typography variant="body1" color="initial">
              {billetera.direccion}
            </Typography>

            <Button
              variant="contained"
              color="error"
              disabled={sesion.datos.rol !== RolesBilleteras.propietario}
              onClick={() => handleQuitarRol(billetera.direccion)}
            >
              {'Quitar'}
            </Button>
          </Paper>
        )
      })
  }, [administradores.datos, cadenaBusqueda, handleQuitarRol, sesion.datos.rol])

  /******************************************************************************/

  useEffect(() => {
    const { error, cargando } = transaccion
    if (!error && !cargando) {
      cargarAdministradores()
    }
  }, [transaccion, cargarAdministradores])

  /******************************************************************************/

  return (
    <>
      <Dialog
        open={showModal}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="xs"
        fullWidth
        onClose={handleCloseModal}
        aria-describedby="dialog-nuevo-admin"
      >
        <DialogTitle
          sx={{
            backgroundColor: 'primary.main',
            color: 'common.white',
            marginBottom: 2,
          }}
          id="dialog-nuevo-admin"
        >
          {`Agregar administrador`}
        </DialogTitle>

        <DialogContent>
          <FormControl sx={{ marginTop: 1 }} fullWidth variant="outlined">
            <TextField
              id="nuevo-admin"
              label="Ingresa billetera"
              type="text"
              value={billetera}
              onChange={handleInputChange}
            />
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseModal} variant="outlined">
            Cerrar
          </Button>

          <Button
            onClick={handleAgregarAdministrador}
            variant="contained"
            color="success"
          >
            {transaccion.cargando ? (
              <CircularProgress size={24} sx={{ color: 'common.white' }} />
            ) : (
              'Agregar'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          {/* TOKEN VENTA */}
          <FormControl fullWidth variant="outlined">
            <TextField
              id="cadena-busqueda"
              label="Buscar billetera"
              type="text"
              value={preBusqueda}
              onChange={handleSearchInputChange}
            />
          </FormControl>
        </Grid>

        <Grid item xs={2}>
          <Button
            variant="contained"
            sx={{ height: '100%', width: '100%' }}
            onClick={handleRecargar}
          >
            {administradores.cargando ? (
              <CircularProgress size={24} sx={{ color: 'common.white' }} />
            ) : (
              'Recargar'
            )}
          </Button>
        </Grid>

        <Grid item xs={2}>
          <Button
            variant="contained"
            color="success"
            sx={{ height: '100%', width: '100%' }}
            onClick={handleOpenModal}
          >
            {transaccion.cargando ? (
              <CircularProgress size={24} sx={{ color: 'common.white' }} />
            ) : (
              'Agregar'
            )}
          </Button>
        </Grid>
      </Grid>

      {administradores.cargando || transaccion.cargando ? (
        <LinearProgress sx={{ marginY: 3 }} />
      ) : (
        <Divider sx={{ borderBottomWidth: 4, marginY: 3 }} />
      )}

      <WindowPaper>{listarBilleterasAdministradoras}</WindowPaper>
    </>
  )
}
