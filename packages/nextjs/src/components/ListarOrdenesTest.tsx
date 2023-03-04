import { BlockchainContext } from '@/context/BlockchainProvider'
import { Orden, Token } from '@/types.d'
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import { useContext, useState } from 'react'

export default function ListarOrdenesTest() {
  const { state, actions } = useContext(BlockchainContext)
  const [tokenVenta, setTokenVenta] = useState<string>('')
  const [tokenCompra, setTokenCompra] = useState<string>('')

  const { tokens, ordenes } = state
  const { cargarOrdenesActivas } = actions

  return (
    <>
      <Button
        variant="contained"
        sx={{ width: '50%', marginBottom: 4 }}
        onClick={async () =>
          await cargarOrdenesActivas(
            ordenes.datos[ordenes.datos.length - 1].idOrden
          )
        }
      >
        Dame ordenes
      </Button>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id="token-venta-input">Token Venta</InputLabel>
            <Select
              labelId="token-venta-input"
              id="token-compra"
              value={tokenVenta || tokens.datos[0]?.ticker || ''}
              label="token-venta"
              onChange={(event: SelectChangeEvent) =>
                setTokenVenta(event.target.value)
              }
            >
              {tokens.datos.map((token: Token) => (
                <MenuItem key={token.ticker} value={token.ticker}>
                  {token.ticker}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id="token-compra-input">Token Compra</InputLabel>
            <Select
              labelId="token-compra-input"
              id="token-compra"
              value={tokenCompra || tokens.datos[1]?.ticker || ''}
              label="token-compra"
              onChange={(event: SelectChangeEvent) =>
                setTokenCompra(event.target.value)
              }
            >
              {tokens.datos.map((token: Token) => (
                <MenuItem key={token.ticker} value={token.ticker}>
                  {token.ticker}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {ordenes.datos.map((orden: Orden) => (
          <Grid key={orden.idOrden} item xs={12}>
            {orden.idOrden}
          </Grid>
        ))}
      </Grid>
    </>
  )
}
