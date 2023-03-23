import { Orden } from '@/types.d'
import { getTimeAgoString } from '@/utils/helpers'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardProps,
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
  onEjecutar?: (idOrden: string) => Promise<void>
  onCancelar?: (idOrden: string) => Promise<void>
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

export default function TarjetaOrden({ orden, sx }: TarjetaOrdenProps) {
  const ordenComputada = useMemo(() => ({ ...orden }), [orden])

  const fecha = useMemo(
    () => new Date(Number(ordenComputada.fechaCreacion) * 1000),
    [ordenComputada]
  )
  const tiempo = useMemo(() => getTimeAgoString(fecha), [fecha])
  const montoCompra = useMemo(
    () => ethers.utils.formatUnits(ordenComputada.montoCompra),
    [ordenComputada]
  )
  const montoVenta = useMemo(
    () => ethers.utils.formatUnits(ordenComputada.montoVenta),
    [ordenComputada]
  )

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
        <Box sx={{ marginRight: 'auto' }}>
          <Typography
            variant="button"
            color="primary.dark"
            fontSize={20}
            fontWeight={'bold'}
          >
            {ordenComputada.tipo === 0 ? 'Compra-Venta' : 'Intercambio'}
          </Typography>
          <Typography
            variant="body2"
            fontWeight={'bold'}
            sx={{ color: blueGrey[700] }}
          >
            {`${ordenComputada.tokenVenta} por ${ordenComputada.tokenCompra}`}
          </Typography>
        </Box>

        {selectIcon(ordenComputada.tokenVenta)}
        <Typography
          sx={{ marginLeft: 1, color: 'common.black' }}
          variant="button"
          fontSize={24}
          fontWeight={'bold'}
        >
          {montoVenta}
        </Typography>

        <SwapHorizIcon color="primary" fontSize="large" />

        {selectIcon(ordenComputada.tokenCompra)}
        {ordenComputada.tipo === 0 && (
          <Typography
            sx={{ marginLeft: 1, color: 'common.black' }}
            variant="button"
            fontSize={24}
            fontWeight={'bold'}
          >
            {montoCompra}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="body1">{`Hace ${tiempo} - ${fecha.toLocaleDateString()}`}</Typography>
          <Typography variant="body2">{`Creador: ${ordenComputada.vendedor}`}</Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Share</Button>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Box>
    </Card>
  )
}
