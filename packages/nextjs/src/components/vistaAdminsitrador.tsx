import { NavMenu, RolesBilleteras, Billetera } from '@/types.d'
import { Box, Tab, Tabs } from '@mui/material'
import React, { useState } from 'react'
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

  const handleCambiarNavMenu = (
    event: React.SyntheticEvent,
    nuevoValor: NavMenu
  ) => {
    setTabValue(nuevoValor)
  }

  return (
    <div>
      <Tabs
        value={getTabValue}
        onChange={handleCambiarNavMenu}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
      >
        <Tab value={NavMenu.configuracion} label={NavMenu.configuracion} />

        <Tab value={NavMenu.billeteras} label={NavMenu.billeteras} />

        <Tab
          value={NavMenu.billeterasSuspendidas}
          label={NavMenu.billeterasSuspendidas}
        />
        <Tab value={NavMenu.tokens} label={NavMenu.tokens} />
      </Tabs>

      <TabPanel value={getTabValue} index={NavMenu.configuracion}>
        <VistaConfiguracion />
      </TabPanel>

      <TabPanel value={getTabValue} index={NavMenu.billeteras}>
        <VistaBilleteras />
      </TabPanel>

      <TabPanel value={getTabValue} index={NavMenu.billeterasSuspendidas}>
        <VistaBilleterasSuspendidas />
      </TabPanel>

      <TabPanel value={getTabValue} index={NavMenu.tokens}>
        <VistaTokens />
      </TabPanel>
    </div>
  )
}
