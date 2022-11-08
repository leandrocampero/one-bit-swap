// https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import LogoutIcon from '@mui/icons-material/Logout'
import { Button, Menu, MenuItem, MenuProps, styled } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { ethers } from 'ethers'
import React, { SetStateAction, useEffect, useState } from 'react'
import ModalError from './ModalError'

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

export default function ConectarWallet() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errorMessage, setErrorMessage] = useState('')
  const [address, setAddress] = useState('')
  const [addressRecortada, setAddressRecortada] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [signer, setSigner] = useState<ethers.Signer>()

  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((result: any[]) => {
          accountChangedHandler(result[0])
          console.log('result[0]', result[0])
        })
        .catch((error: { message: SetStateAction<string> }) => {
          setErrorMessage(error.message)
        })
    } else {
      setErrorMessage('Please install MetaMask browser extension to interact')
      console.log('errorMessage', errorMessage)
    }
  }

  // update account, will cause component re-render
  const accountChangedHandler = (newAccount: string) => {
    setAddress(newAccount)
    const cadena1 =
      newAccount.slice(0, 5) + '..' + newAccount.slice(newAccount.length - 4)
    setAddressRecortada(cadena1)
    localStorage.setItem('wallet', JSON.stringify(newAccount))
    updateEthers()
  }

  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload()
  }

  const cerrarSesion = () => {
    localStorage.removeItem('wallet')
    setAddress('')
    handleClose()
  }

  // listen for account changes
  if (typeof window !== 'undefined') {
    console.log('hola')
    if (typeof window.ethereum !== 'undefined') {
      console.log('hola1')
      // Client-side-only code
      window.ethereum.on('accountsChanged', accountChangedHandler)

      window.ethereum.on('chainChanged', chainChangedHandler)

      window.ethereum.on('disconnect', cerrarSesion)
    }
  }
  const updateEthers = async () => {
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
      {errorMessage.length ? <ModalError /> : null}
      {!address.length ? (
        <Button variant="contained" onClick={connectWalletHandler}>
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
