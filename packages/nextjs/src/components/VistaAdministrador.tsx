import { useBlockchainContext } from '@/context/BlockchainProvider'
import { NavMenu, RolesBilleteras } from '@/types.d'
import { Box, Tab, Tabs } from '@mui/material'
import { blue } from '@mui/material/colors'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import VistaBilleteras from './VistaBilleteras'
import VistaBilleterasBloqueadas from './VistaBilleterasBloqueadas'
import VistaConfiguracion from './VistaConfiguracion'
import VistaTokens from './VistaTokens'

/******************************************************************************/

interface TabPanelProps {
  children?: React.ReactNode
  index: NavMenu
  value: NavMenu
}

const NAV_ITEMS = [
  'Configuración',
  'Administradores',
  'Billeteras Bloqueadas',
  'Tokens',
]

/******************************************************************************/

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      sx={{ padding: 3, width: '100%', flexGrow: 1 }}
      {...other}
    >
      {value === index && children}
    </Box>
  )
}

/******************************************************************************/

export default function VistaAdministrador() {
  const [getTabValue, setTabValue] = useState(NavMenu.configuracion)
  const {
    getters: { sesion },
  } = useBlockchainContext()
  const router = useRouter()

  const handleCambiarNavMenu = (
    event: React.SyntheticEvent,
    nuevoValor: NavMenu
  ) => {
    setTabValue(nuevoValor)
  }

  useEffect(() => {
    if (!sesion.cargando && sesion.datos.rol === RolesBilleteras.usuario) {
      router.push('/')
    }
  }, [sesion, router])

  /****************************************************************************/

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'primary.dark',
          color: 'common.white',
        }}
      >
        <Tabs
          value={getTabValue}
          onChange={handleCambiarNavMenu}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          {NAV_ITEMS.map((item, index) => (
            <Tab
              key={index}
              sx={{
                color: 'common.white',
                '&.Mui-selected': {
                  backgroundColor: blue[200],
                  color: 'common.white',
                  fontWeight: 'bold',
                },
              }}
              label={item}
              value={item}
            />
          ))}
        </Tabs>
      </Box>

      <TabPanel value={getTabValue} index={NavMenu.configuracion}>
        <VistaConfiguracion />
      </TabPanel>

      <TabPanel value={getTabValue} index={NavMenu.administradores}>
        <VistaBilleteras />
      </TabPanel>

      <TabPanel value={getTabValue} index={NavMenu.billeterasBloqueadas}>
        <VistaBilleterasBloqueadas />
      </TabPanel>

      <TabPanel value={getTabValue} index={NavMenu.tokens}>
        <VistaTokens />
      </TabPanel>
    </>
  )
}
