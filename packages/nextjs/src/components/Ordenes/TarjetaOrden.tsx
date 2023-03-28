import { useBlockchainContext } from '@/context/BlockchainProvider'
import { EstadosOrdenes, Orden } from '@/types.d'
import { getTimeAgoString } from '@/utils/helpers'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardProps,
  Chip,
  Divider,
  Grid,
  Typography,
} from '@mui/material'
import { blueGrey } from '@mui/material/colors'
import { ethers } from 'ethers'
import { useMemo } from 'react'
import IconDAI from '../Icon/DAI'
import IconLINK from '../Icon/LINK'
import IconMATIC from '../Icon/MATIC'
import IconSAND from '../Icon/SAND'
import IconUSDT from '../Icon/USDT'
import IconWETH from '../Icon/WETH'

export interface TarjetaOrdenProps extends CardProps {
  orden: Orden
  onAccion: (idOrden: string, accion: 'ejecutar' | 'cancelar') => Promise<void>
}

const selectIcon = (ticker: string): JSX.Element | undefined => {
  switch (ticker) {
    case 'USDT':
      return <IconUSDT />
    case 'LINK':
      return <IconLINK />
    case 'SAND':
      return <IconSAND />
    case 'WETH':
      return <IconWETH />
    case 'MATIC':
      return <IconMATIC />
    case 'DAI':
      return <IconDAI />
    default:
      break
  }
}

export default function TarjetaOrden({
  orden,
  sx,
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
            size={'small'}
            sx={{ marginLeft: 1 }}
          />
        )
      case EstadosOrdenes.cancelada:
        return (
          <Chip
            label="Cancelada"
            color="error"
            size={'small'}
            sx={{ marginLeft: 1 }}
          />
        )
      default:
        return (
          <Chip
            label="Activa"
            color="primary"
            size={'small'}
            sx={{ marginLeft: 1 }}
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
        ...sx,
      }}
      elevation={3}
    >
      <Box
        sx={{
          backgroundColor: blueGrey[50],
          padding: 2,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Grid container spacing={0} alignItems={'center'} wrap="nowrap">
          <Grid item xs={6}>
            <Box sx={{ marginRight: 'auto' }}>
              <Typography
                variant="button"
                color="primary.dark"
                fontSize={20}
                fontWeight={'bold'}
              >
                {ordenComputada.tipo === 0 ? 'Compra-Venta' : 'Intercambio'}
                {badge}
              </Typography>
              <Typography
                variant="body2"
                fontWeight={'bold'}
                sx={{ color: blueGrey[700] }}
              >
                {`${ordenComputada.tokenVenta} por ${ordenComputada.tokenCompra}`}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
            {selectIcon(ordenComputada.tokenVenta)}
            <Typography
              sx={{ marginLeft: 1, color: 'common.black' }}
              variant="button"
              fontSize={24}
              fontWeight={'bold'}
            >
              {montoVenta}
            </Typography>
          </Grid>

          <Grid item xs={1}>
            <SwapHorizIcon color="primary" fontSize="large" />
          </Grid>

          <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
            {selectIcon(ordenComputada.tokenCompra)}
            {(ordenComputada.tipo === 0 ||
              ordenComputada.estado === EstadosOrdenes.finalizada) && (
              <Typography
                sx={{ marginLeft: 1, color: 'common.black' }}
                variant="button"
                fontSize={24}
                fontWeight={'bold'}
              >
                {montoCompra}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ display: 'flex' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="body1">{`Creada hace ${tiempo} - ${fechaCreacion.toLocaleDateString()}`}</Typography>

          <Divider sx={{ marginY: 1 }} />
          <Typography variant="body2">{`Vendedor: ${ordenComputada.vendedor}`}</Typography>

          {ordenComputada.estado === EstadosOrdenes.finalizada && (
            <>
              <Typography variant="body2">{`Comprador: ${ordenComputada.comprador}`}</Typography>
            </>
          )}
          {ordenComputada.estado !== EstadosOrdenes.activa && (
            <>
              <Typography variant="body2">{`Finalizada en ${fechaFinalizacion.toLocaleString()}`}</Typography>
            </>
          )}

          <Divider sx={{ marginY: 1 }} />

          <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
            {`ID: ${ordenComputada.idOrden}`}
          </Typography>
        </CardContent>
        {ordenComputada.estado === EstadosOrdenes.activa && (
          <CardActions>
            {esPropia ? (
              <>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => onAccion(ordenComputada.idOrden, 'cancelar')}
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="success"
                disabled={ordenComputada.vendedor === sesion.datos.direccion}
                onClick={() => onAccion(ordenComputada.idOrden, 'ejecutar')}
              >
                Ejecutar
              </Button>
            )}

            {/* <Button variant="contained" color='primary'>Learn More</Button> */}
          </CardActions>
        )}
      </Box>
    </Card>
  )
}
