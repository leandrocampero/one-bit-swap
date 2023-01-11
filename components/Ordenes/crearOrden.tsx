import { Box, Button, Tab, Tabs, Typography } from '@mui/material'
import React, { useState } from 'react'
import OrdenCompra from './OrdenCompra'
import OrdenVenta from './OrdenVenta'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export const VentaMontoContext = React.createContext<any>({})
export const VentaTokenContext = React.createContext<any>({})
export const CompraMontoContext = React.createContext<any>({})
export const CompraTokenContext = React.createContext<any>({})

export default function CrearOrden() {
  const labelVenta = 'Token a Entregar (Vender)'
  const labelCompra = 'Token a Recibir (Comprar)'
  const [valueTab, setValueTab] = useState(0)
  const [compraMonto, setCompraMonto] = React.useState<number>()
  const [compraToken, setCompraToken] = React.useState('USDT')
  const [ventaMonto, setVentaMonto] = React.useState<number>()
  const [ventaToken, setVentaToken] = React.useState('BNB')

  const montoCompraVenta = () => {
    if (!ventaMonto) {
      return 0
    }
    if (!compraMonto) {
      return 0
    }
    return ventaMonto / compraMonto
  }

  const handleChange = (event: React.SyntheticEvent, value: any) => {
    setValueTab(value)
  }

  return (
    <div>
      <Tabs
        value={valueTab}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="inherit"
        variant="fullWidth"
        aria-label="full width tabs example"
      >
        <Tab label="Compra/Venta"></Tab>
        <Tab label="Intercambio"></Tab>
      </Tabs>
      <TabPanel value={valueTab} index={0}>
        <CompraMontoContext.Provider value={{ compraMonto, setCompraMonto }}>
          <CompraTokenContext.Provider value={{ compraToken, setCompraToken }}>
            <OrdenCompra label={labelCompra} />
          </CompraTokenContext.Provider>
        </CompraMontoContext.Provider>
        <VentaMontoContext.Provider value={{ ventaMonto, setVentaMonto }}>
          <VentaTokenContext.Provider value={{ ventaToken, setVentaToken }}>
            <OrdenVenta label={labelVenta} />
          </VentaTokenContext.Provider>
        </VentaMontoContext.Provider>
        <Typography variant="body2" gutterBottom align="center" mb={2}>
          {'Total ' +
            montoCompraVenta() +
            ' ' +
            ventaToken +
            ' por ' +
            compraToken}
        </Typography>
        <Box textAlign="center">
          <Button variant="contained">{'Crear orden de compra'}</Button>
        </Box>
      </TabPanel>
      <TabPanel value={valueTab} index={1}>
        <CompraMontoContext.Provider value={{ compraMonto, setCompraMonto }}>
          <CompraTokenContext.Provider value={{ compraToken, setCompraToken }}>
            <OrdenCompra label={labelCompra} intercambio={true} />
          </CompraTokenContext.Provider>
        </CompraMontoContext.Provider>
        <VentaMontoContext.Provider value={{ ventaMonto, setVentaMonto }}>
          <VentaTokenContext.Provider value={{ ventaToken, setVentaToken }}>
            <OrdenVenta label={labelVenta} />
          </VentaTokenContext.Provider>
        </VentaMontoContext.Provider>
        <Box textAlign="center">
          <Button variant="contained">{'Crear orden de intercambio'}</Button>
        </Box>
      </TabPanel>
    </div>
  )
}
