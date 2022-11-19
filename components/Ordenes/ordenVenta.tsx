import {
  Autocomplete,
  Box,
  FormControl,
  InputAdornment,
  OutlinedInput,
  TextField,
} from '@mui/material'
import React from 'react'
import { VentaMontoContext, VentaTokenContext } from './CrearOrden'

const currencies = ['USDT', 'BNB', 'ETH']

export default function OrdenVenta(props: any) {
  const { ventaMonto, setVentaMonto } = React.useContext(VentaMontoContext)
  const { ventaToken, setVentaToken } = React.useContext(VentaTokenContext)

  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        value={ventaToken}
        onChange={(event: any, newValue: string | null) => {
          setVentaToken(newValue)
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

      <FormControl
        fullWidth
        sx={{ m: 1, mb: 3, width: '97%' }}
        variant="outlined"
      >
        <OutlinedInput
          id="outlined-adornment-monto-venta"
          type="number"
          value={ventaMonto}
          onChange={handleChange2}
          endAdornment={
            <InputAdornment position="end">{ventaToken}</InputAdornment>
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
