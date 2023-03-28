import {
  Autocomplete,
  Box,
  FormControl,
  InputAdornment,
  OutlinedInput,
  TextField,
} from '@mui/material'
import React from 'react'
import {
  CompraMontoContext,
  CompraTokenContext,
  VentaMontoContext,
  VentaTokenContext,
} from './CrearOrden'

import { useBlockchainContext } from '@/context/BlockchainProvider'
import { Estados, Token } from '@/types.d'

export default function OrdenCompra(props: any) {
  const { getters } = useBlockchainContext()
  const { tokens } = getters

  const { compraMonto, setCompraMonto } = React.useContext(CompraMontoContext)
  const { compraToken, setCompraToken } = React.useContext(CompraTokenContext)
  const { ventaMonto, setVentaMonto } = React.useContext(VentaMontoContext)
  const { ventaToken, setVentaToken } = React.useContext(VentaTokenContext)

  const labelVenta = 'Token a Entregar (Vender)'
  const labelCompra = 'Token a Recibir (Comprar)'

  const handleCambiarTokenCompra = (
    event: React.SyntheticEvent,
    value: Token | null
  ) => {
    setCompraToken(value)
  }

  const handleInputChangeCompra = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCompraMonto(event.target.value)
  }

  const handleCambiarTokenVenta = (
    event: React.SyntheticEvent,
    value: Token | null
  ) => {
    setVentaToken(value)
  }

  const handleInputChangeVenta = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVentaMonto(event.target.value)
  }

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '97%' },
      }}
      noValidate
      autoComplete="off"
    >
      <Autocomplete
        id="controllable-states-demo"
        options={tokens.datos}
        getOptionDisabled={(option: Token) =>
          option.ticker === ventaToken?.ticker ||
          option.estado == Estados.suspendido
        }
        value={compraToken}
        onChange={handleCambiarTokenCompra}
        getOptionLabel={(option: Token) => option.ticker}
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
            {...props}
          >
            {/*  <SvgIcon
              component={`/${option.value}.svg`}
              viewBox="0 0 600 476.6"
            /> */}
            {/*  <Image
        width="20"
        height="20"
        src={`/${option.value}.svg`}
        alt="token"
      />  */}
            {option.ticker}
          </Box>
        )}
        renderInput={(params) => <TextField {...params} label={labelCompra} />}
      />

      {!props.intercambio && (
        <FormControl fullWidth sx={{ m: 1, width: '97%' }} variant="outlined">
          <OutlinedInput
            id="outlined-adornment-monto-compra"
            type="number"
            value={compraMonto}
            onChange={handleInputChangeCompra}
            endAdornment={
              <InputAdornment position="end">
                {compraToken?.ticker}
              </InputAdornment>
            }
            aria-describedby="outlined-monto-helper-text"
            inputProps={{
              'aria-label': 'monto',
              min: 0,
            }}
          />
        </FormControl>
      )}

      <Autocomplete
        id="controllable-states-demo"
        options={tokens.datos}
        getOptionDisabled={(option: Token) =>
          option.ticker === compraToken?.ticker ||
          option.estado == Estados.suspendido
        }
        value={ventaToken}
        onChange={handleCambiarTokenVenta}
        getOptionLabel={(option: Token) => option.ticker}
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
            {...props}
          >
            {/*  <SvgIcon
        component={`/${option.value}.svg`}
        viewBox="0 0 600 476.6"
      /> */}
            {/*  <Image
  width="20"
  height="20"
  src={`/${option.value}.svg`}
  alt="token"
/>  */}
            {option.ticker}
          </Box>
        )}
        renderInput={(params) => <TextField {...params} label={labelVenta} />}
      />

      <FormControl
        fullWidth
        sx={{ m: 1, mb: 3, width: '97%' }}
        variant="outlined"
      >
        <OutlinedInput
          id="outlined-adornment-monto-venta"
          type="number"
          value={ventaMonto}
          onChange={handleInputChangeVenta}
          endAdornment={
            <InputAdornment position="end">{ventaToken?.ticker}</InputAdornment>
          }
          aria-describedby="outlined-monto-helper-text"
          inputProps={{
            'aria-label': 'monto',
            min: 0,
          }}
        />
      </FormControl>
    </Box>
  )
}
