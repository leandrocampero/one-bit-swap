// https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider
import GestorBilleteras from '@lib/managers/GestorBilleteras'
import { RolesBilleteras } from '@lib/types.d'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import LogoutIcon from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/Settings'
import { Button, Menu, MenuItem, MenuProps, styled } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { ethers } from 'ethers'
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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const [errorMessage, setErrorMessage] = useState('')
  const [address, setAddress] = useState('')
  const [addressRecortada, setAddressRecortada] = useState('')
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>()
  const [signer, setSigner] = useState<ethers.Signer>()
  const [logueado, setLogueado] = useState<boolean>(false)

  const gBilletera = new GestorBilleteras()

  async function connectToMetamask() {
    if (window.ethereum && window.ethereum.isMetaMask) {
      try {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          'any'
        )
        const address = await provider.send('eth_requestAccounts', [])
        accountChangedHandler(address[0])
        setSigner(provider.getSigner())
      } catch (error) {
        console.log(error)
      }
    } else {
      setErrorMessage('Please install MetaMask browser extension to interact')
      console.log('errorMessage', errorMessage)
    }
  }

  // update account, will cause component re-render
  function accountChangedHandler(newAccount: string) {
    console.log('newAccount', newAccount)
    const wallet = gBilletera.nuevo(newAccount)
    setAddress(wallet.direccion)
    console.log(address)
    const cadena1 =
      newAccount.toString().slice(0, 5) +
      '..' +
      newAccount.toString().slice(newAccount.length - 4)
    setAddressRecortada(cadena1)
    localStorage.setItem('wallet', JSON.stringify(newAccount))
    updateEthers()
  }

  function chainChangedHandler() {
    window.location.reload()
  }

  function cerrarSesion() {
    localStorage.removeItem('wallet')
    const wallet = gBilletera.nuevo('')
    setAddress(wallet.direccion)
    handleClose()
  }

  if (typeof window !== 'undefined') {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', accountChangedHandler)
      window.ethereum.on('chainChanged', chainChangedHandler)
      window.ethereum.on('disconnect', cerrarSesion)
    }
  }
  async function updateEthers() {
    const tempProvider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(tempProvider)

    const tempSigner = tempProvider.getSigner()
    setSigner(tempSigner)
  }

  useEffect(() => {
    try {
      const addressLS = JSON.parse(localStorage.getItem('wallet') || '')
      if (addressLS.length) {
        accountChangedHandler(addressLS)
      }
    } catch (error) {}
  }, [])

  return (
    <div>
      {!address.length ? (
        <Button variant="contained" onClick={connectToMetamask}>
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
            {addressRecortada}
          </Button>

          <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
              'aria-labelledby': 'demo-customized-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            {rol != 0 ? (
              <Link href="configuracion">
                <MenuItem disableRipple>
                  <SettingsIcon />
                  Configuracion
                </MenuItem>
              </Link>
            ) : null}
            <MenuItem onClick={cerrarSesion} disableRipple>
              <LogoutIcon />
              Desconectar Billetera
            </MenuItem>
          </StyledMenu>
        </>
      )}
    </div>
  )
}
