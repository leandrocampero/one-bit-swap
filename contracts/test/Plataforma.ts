import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('Plataforma', function () {
  async function cuentasPrueba() {
    const [propietario, otraCuenta] = await ethers.getSigners()

    const Plataforma = await ethers.getContractFactory('Plataforma')
    const plataforma = await Plataforma.deploy(5)

    return { propietario, otraCuenta, plataforma }
  }

  describe('Despliegue', function () {
    it('Debería fallar e indicar que no es propietario', async function () {
      const { otraCuenta, plataforma } = await loadFixture(cuentasPrueba)

      await expect(plataforma.connect(otraCuenta).prueba()).to.be.revertedWith(
        'Solo el propietario puede acceder'
      )
    })

    it('Debería pasar indicando que es propietario', async function () {
      const { propietario, plataforma } = await loadFixture(cuentasPrueba)
      const recibo = await plataforma.connect(propietario).prueba()

      await expect(recibo).to.emit(plataforma, 'AccesoExitoso')
    })
  })
})
