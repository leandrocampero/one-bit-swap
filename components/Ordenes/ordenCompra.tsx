import {
  Autocomplete,
  Box,
  FormControl,
  InputAdornment,
  OutlinedInput,
  TextField,
} from '@mui/material'
import React from 'react'
import { CompraMontoContext, CompraTokenContext } from './CrearOrden'

const currencies = ['USDT', 'BNB', 'ETH']

export default function OrdenCompra(props: any) {
  const { compraMonto, setCompraMonto } = React.useContext(CompraMontoContext)
  const { compraToken, setCompraToken } = React.useContext(CompraTokenContext)

  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompraMonto(event.target.value)
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
        value={compraToken}
        onChange={(event: any, newValue: string | null) => {
          setCompraToken(newValue)
        }}
        id="controllable-states-demo"
        options={currencies}
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
            {option}
          </Box>
        )}
        renderInput={(params) => <TextField {...params} label={props.label} />}
      />

      {!props.intercambio && (
        <FormControl fullWidth sx={{ m: 1, width: '97%' }} variant="outlined">
          <OutlinedInput
            id="outlined-adornment-monto-compra"
            type="number"
            value={compraMonto}
            onChange={handleChange2}
            endAdornment={
              <InputAdornment position="end">{compraToken}</InputAdornment>
            }
            aria-describedby="outlined-monto-helper-text"
            inputProps={{
              'aria-label': 'monto',
              min: 0,
            }}
          />
        </FormControl>
      )}
    </Box>
  )
}
