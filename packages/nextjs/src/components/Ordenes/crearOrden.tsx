import { Box, Button, Tab, Tabs, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import FormularioOrden from './FormularioOrden'
import { NavMenu, TiposOrdenes, Token } from '@/types.d'
import { BlockchainContext } from '@/context/BlockchainProvider'
import { ethers } from 'ethers'

interface TabPanelProps {
  children?: React.ReactNode
  index: NavMenu
  value: NavMenu
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
  const { actions } = useContext(BlockchainContext)
  const { nuevaOrden } = actions

  const [valueTab, setValueTab] = useState<NavMenu>(NavMenu.compraVenta)
  const [compraMonto, setCompraMonto] = React.useState<number>(0)
  const [compraToken, setCompraToken] = React.useState<Token | null>(null)
  const [ventaMonto, setVentaMonto] = React.useState<number>(0)
  const [ventaToken, setVentaToken] = React.useState<Token | null>(null)

  const montoCompraVenta = () => {
    return !ventaMonto || !compraMonto ? 0 : ventaMonto / compraMonto
  }

  const handleCambiarTipoOrden = (
    event: React.SyntheticEvent,
    value: NavMenu
  ) => {
    setValueTab(value)
  }

  const handleClicCrearOrden = () => {
    console.log('ordenPorCrear')
    if (
      (compraToken &&
        compraMonto &&
        ventaToken &&
        ventaMonto &&
        valueTab == NavMenu.compraVenta) ||
      (compraToken &&
        compraMonto &&
        ventaToken &&
        valueTab == NavMenu.intercambio)
    ) {
      nuevaOrden(
        compraToken.ticker,
        ventaToken.ticker,
        ethers.utils.parseUnits(compraMonto.toString()).toString(),
        ethers.utils.parseUnits(ventaMonto.toString()).toString(),
        valueTab == NavMenu.intercambio
          ? TiposOrdenes.intercambio
          : TiposOrdenes.compraVenta
      )
    }
    console.log('ordenCreada')
  }

  return (
    <div>
      <Tabs
        value={valueTab}
        onChange={handleCambiarTipoOrden}
        indicatorColor="primary"
        textColor="inherit"
        variant="fullWidth"
        aria-label="full width tabs example"
      >
        <Tab value={NavMenu.compraVenta} label={NavMenu.compraVenta}></Tab>
        <Tab value={NavMenu.intercambio} label={NavMenu.intercambio}></Tab>
      </Tabs>
      <TabPanel value={valueTab} index={NavMenu.compraVenta}>
        <CompraMontoContext.Provider value={{ compraMonto, setCompraMonto }}>
          <CompraTokenContext.Provider value={{ compraToken, setCompraToken }}>
            <VentaMontoContext.Provider value={{ ventaMonto, setVentaMonto }}>
              <VentaTokenContext.Provider value={{ ventaToken, setVentaToken }}>
                <FormularioOrden />
              </VentaTokenContext.Provider>
            </VentaMontoContext.Provider>
          </CompraTokenContext.Provider>
        </CompraMontoContext.Provider>
        <Typography variant="body2" gutterBottom align="center" mb={2}>
          {'Total ' +
            montoCompraVenta() +
            ' ' +
            ventaToken?.ticker +
            ' por ' +
            compraToken?.ticker}
        </Typography>
        <Box textAlign="center">
          <Button variant="contained">
            {'Crear orden de ' + NavMenu.compraVenta}
          </Button>
        </Box>
      </TabPanel>
      <TabPanel value={valueTab} index={NavMenu.intercambio}>
        <CompraMontoContext.Provider value={{ compraMonto, setCompraMonto }}>
          <CompraTokenContext.Provider value={{ compraToken, setCompraToken }}>
            <VentaMontoContext.Provider value={{ ventaMonto, setVentaMonto }}>
              <VentaTokenContext.Provider value={{ ventaToken, setVentaToken }}>
                <FormularioOrden intercambio={true} />
              </VentaTokenContext.Provider>
            </VentaMontoContext.Provider>
          </CompraTokenContext.Provider>
        </CompraMontoContext.Provider>
        <Box textAlign="center">
          <Button variant="contained" onClick={handleClicCrearOrden}>
            {'Crear orden de ' + NavMenu.intercambio}
          </Button>
        </Box>
      </TabPanel>
    </div>
  )
}
