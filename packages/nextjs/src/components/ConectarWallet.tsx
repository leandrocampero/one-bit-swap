// https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider
import { useWallet } from '@/hooks/wallet'
import { RolesBilleteras } from '@/types.d'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import LogoutIcon from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/Settings'
import { Button, Menu, MenuProps, styled } from '@mui/material'
import { alpha } from '@mui/material/styles'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}))

const rol = RolesBilleteras.administrador

export default function ConectarWallet() {
  const { accounts, connect } = useWallet()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [address, setAddress] = useState('')
  const open = Boolean(anchorEl)

  useEffect(() => {
    try {
      const addressLS = JSON.parse(localStorage.getItem('wallet') || '')
      if (addressLS.length) {
        localStorage.setItem('wallet', JSON.stringify(addressLS))
      }
    } catch (error) {}
  }, [])

  useEffect(() => {
    const current = accounts[0] ?? ''
    setAddress(
      !current
        ? ''
        : current.slice(0, 5) + '..' + current.slice(current.length - 4)
    )
  }, [accounts[0]])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const cerrarSesion = () => {
    setAnchorEl(null)
    localStorage.removeItem('wallet')
  }

  if (typeof window !== 'undefined') {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('disconnect', cerrarSesion)
    }
  }

  return (
    <div>
      {!address ? (
        <Button variant="contained" onClick={connect}>
          Conectar Wallet
        </Button>
      ) : (
        <>
          <Button
            id="demo-customized-button"
            aria-controls={open ? 'demo-customized-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            variant="contained"
            disableElevation
            onClick={handleClick}
            endIcon={<AccountBalanceWalletIcon />}
          >
            {address}
          </Button>

          {rol == RolesBilleteras.administrador ? (
            <Button
              id="demo-customized-button"
              aria-controls={open ? 'demo-customized-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              variant="contained"
              disableElevation
              onClick={handleClick}
              startIcon={<SettingsIcon />}
            >
              <Link href="/configuracion">Configuracion</Link>
            </Button>
          ) : null}

          <Button
            id="demo-customized-button"
            aria-controls={open ? 'demo-customized-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            variant="contained"
            disableElevation
            onClick={cerrarSesion}
            startIcon={<LogoutIcon />}
          >
            Desconectar Billetera
          </Button>
        </>
      )}
    </div>
  )
}
