import { useBlockchainContext } from '@/context/BlockchainProvider'
import { EstadosOrdenes, Orden } from '@/types.d'
import { getTimeAgoString } from '@/utils/helpers'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import {
  Box,
  Button,
  Card,
  CardProps,
  Chip,
  Divider,
  Grid,
  Typography,
} from '@mui/material'
import { blueGrey } from '@mui/material/colors'
import { ethers } from 'ethers'
import { useMemo } from 'react'
import SelectIcon from '../common/SelectIcon'

export interface TarjetaOrdenProps extends CardProps {
  orden: Orden
  deshabilitarAccion: boolean
  onAccion: (idOrden: string, accion: 'ejecutar' | 'cancelar') => Promise<void>
}

export default function TarjetaOrden({
  orden,
  sx,
  deshabilitarAccion,
  onAccion,
}: TarjetaOrdenProps) {
  const { getters } = useBlockchainContext()
  const { sesion } = getters

  const ordenComputada = useMemo(() => ({ ...orden }), [orden])

  const fechaCreacion = useMemo(
    () => new Date(Number(ordenComputada.fechaCreacion) * 1000),
    [ordenComputada]
  )
  const fechaFinalizacion = useMemo(
    () => new Date(Number(ordenComputada.fechaFinalizacion) * 1000),
    [ordenComputada]
  )
  const tiempo = useMemo(() => getTimeAgoString(fechaCreacion), [fechaCreacion])
  const montoCompra = useMemo(() => {
    const montoCompraParsed = ethers.utils.formatUnits(
      ordenComputada.montoCompra
    )

    const montoCompraFormated =
      montoCompraParsed.split('.')[1].length > 6
        ? parseFloat(montoCompraParsed).toFixed(6)
        : montoCompraParsed

    return montoCompraFormated
  }, [ordenComputada])
  const montoVenta = useMemo(
    () => ethers.utils.formatUnits(ordenComputada.montoVenta),
    [ordenComputada]
  )

  const esPropia = useMemo(() => {
    return ordenComputada.vendedor === sesion.datos.direccion
  }, [ordenComputada, sesion])

  const badge = useMemo(() => {
    const { estado } = ordenComputada

    switch (estado) {
      case EstadosOrdenes.finalizada:
        return (
          <Chip
            label="Finalizada"
            color="success"
            sx={{ fontWeight: 'bold', fontSize: 14 }}
          />
        )
      case EstadosOrdenes.cancelada:
        return (
          <Chip
            label="Cancelada"
            color="error"
            sx={{ fontWeight: 'bold', fontSize: 14 }}
          />
        )
      default:
        return (
          <Chip
            label="Activa"
            color="primary"
            sx={{ fontWeight: 'bold', fontSize: 14 }}
          />
        )
    }
  }, [ordenComputada])

  /******************************************************************************/

  return (
    <Card
      sx={{
        width: '100%',
        border: `1px solid ${blueGrey[900]}`,
        backgroundColor: 'common.white',
        padding: 2,
        ...sx,
      }}
      elevation={3}
    >
      <Grid container spacing={0} alignItems={'center'}>
        <Grid item xs={4}>
          <Typography
            variant="button"
            component="div"
            color="primary.dark"
            fontSize={16}
            fontWeight={'bold'}
          >
            {ordenComputada.tipo === 0 ? 'Compra-Venta' : 'Intercambio'}
          </Typography>

          <Typography
            variant="caption"
            component="div"
            marginRight={1}
            lineHeight={1}
          >
            {`Creada hace ${tiempo} - ${fechaCreacion.toLocaleDateString()}`}
          </Typography>
        </Grid>

        <Grid
          item
          xs={5}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="center">
            <Box marginRight={1}>
              <SelectIcon ticker={ordenComputada.tokenVenta} />
            </Box>
            <Box>
              <Typography
                variant="body2"
                fontWeight={'bold'}
                sx={{ color: blueGrey[700] }}
              >
                {ordenComputada.tokenVenta}
              </Typography>
              <Typography
                sx={{ color: 'common.black' }}
                variant="button"
                fontSize={16}
                fontWeight={'bold'}
              >
                {montoVenta}
              </Typography>
            </Box>
          </Box>

          <SwapHorizIcon color="primary" fontSize="large" />

          <Box display="flex" alignItems="center" minWidth={120}>
            <Box marginRight={1}>
              <SelectIcon ticker={ordenComputada.tokenCompra} />
            </Box>

            <Box>
              <Typography
                variant="body2"
                fontWeight={'bold'}
                sx={{ color: blueGrey[700] }}
              >
                {ordenComputada.tokenCompra}
              </Typography>
              <Typography
                sx={{ color: 'common.black' }}
                variant="button"
                fontSize={16}
                fontWeight={'bold'}
                textTransform={'inherit'}
              >
                {ordenComputada.tipo === 0 ||
                ordenComputada.estado === EstadosOrdenes.finalizada
                  ? montoCompra
                  : 'A cotizar'}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={3} display="flex" justifyContent="end">
          {!deshabilitarAccion &&
            (ordenComputada.estado === EstadosOrdenes.activa ? (
              esPropia ? (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => onAccion(ordenComputada.idOrden, 'cancelar')}
                >
                  Cancelar
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  disabled={ordenComputada.vendedor === sesion.datos.direccion}
                  onClick={() => onAccion(ordenComputada.idOrden, 'ejecutar')}
                >
                  Ejecutar
                </Button>
              )
            ) : (
              badge
            ))}
        </Grid>

        {ordenComputada.estado !== EstadosOrdenes.activa && (
          <Grid item xs={12} marginTop={1}>
            <Divider sx={{ marginY: 1 }} />
            <Typography variant="caption" component="div">
              {`Finalizada en ${fechaFinalizacion.toLocaleString()}`}
            </Typography>

            {ordenComputada.estado === EstadosOrdenes.finalizada && (
              <Typography variant="caption" component="div">
                {`Comprador: ${ordenComputada.comprador}`}
              </Typography>
            )}
          </Grid>
        )}
      </Grid>
    </Card>
  )
}
