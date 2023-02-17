import GestorBilleteras from '@lib/managers/GestorBilleteras'
import Billeteras from '@lib/models/Billeteras'
import { NavMenu, RolesBilleteras } from '@lib/types.d'
import { Box, Tab, Tabs } from '@mui/material'
import React, { useState } from 'react'
import { b10 } from 'scripts/modelos'
import VistaBilleteras from './VistaBilleteras'
import VistaBilleterasSuspendidas from './VistaBilleterasSuspendidas'
import VistaConfiguracion from './VistaConfiguracion'
import VistaTokens from './VistaTokens'

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

export default function VistaAdminsitrador() {
  const [getTabValue, setTabValue] = useState(NavMenu.configuracion)
  const [getBilleteraUsuario, setBilleteraUsuario] = useState<Billeteras>(b10)
  const gestorBilletera = GestorBilleteras.instanciar()

  const handleTabChange = (
    event: React.SyntheticEvent,
    nuevoValor: NavMenu
  ) => {
    setTabValue(nuevoValor)
  }

  return (
    <div>
      <Tabs
        value={getTabValue}
        onChange={handleTabChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
      >
        {gestorBilletera.verificarRol(getBilleteraUsuario) >
          RolesBilleteras.usuario && (
          <Tab value={NavMenu.configuracion} label={NavMenu.configuracion} />
        )}
        {gestorBilletera.verificarRol(getBilleteraUsuario) >
          RolesBilleteras.usuario && (
          <Tab value={NavMenu.billeteras} label={NavMenu.billeteras} />
        )}
        {gestorBilletera.verificarRol(getBilleteraUsuario) >
          RolesBilleteras.usuario && (
          <Tab
            value={NavMenu.billeterasSuspendidas}
            label={NavMenu.billeterasSuspendidas}
          />
        )}
        {gestorBilletera.verificarRol(getBilleteraUsuario) >
          RolesBilleteras.usuario && (
          <Tab value={NavMenu.tokens} label={NavMenu.tokens} />
        )}
      </Tabs>

      <TabPanel value={getTabValue} index={NavMenu.configuracion}>
        {gestorBilletera.verificarRol(getBilleteraUsuario) >
          RolesBilleteras.usuario && <VistaConfiguracion />}
      </TabPanel>

      <TabPanel value={getTabValue} index={NavMenu.billeteras}>
        {gestorBilletera.verificarRol(getBilleteraUsuario) >
          RolesBilleteras.usuario && <VistaBilleteras />}
      </TabPanel>

      <TabPanel value={getTabValue} index={NavMenu.billeterasSuspendidas}>
        {gestorBilletera.verificarRol(getBilleteraUsuario) >
          RolesBilleteras.usuario && <VistaBilleterasSuspendidas />}
      </TabPanel>

      <TabPanel value={getTabValue} index={NavMenu.tokens}>
        {gestorBilletera.verificarRol(getBilleteraUsuario) >
          RolesBilleteras.usuario && <VistaTokens />}
      </TabPanel>
    </div>
  )
}
