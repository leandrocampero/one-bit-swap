import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('Plataforma', function () {
  async function cuentasPrueba() {
    const [propietario, otraCuenta] = await ethers.getSigners()

    const Test = await ethers.getContractFactory('contracts/Test.sol:Pruebas')
    const test = await Test.deploy()

    return { propietario, otraCuenta, plataforma: test }
  }

  describe('Pruebas (mapa iterable)', function () {
    it('Largo del arreglo', async function () {
      const { plataforma } = await loadFixture(cuentasPrueba)
      const recibo = await plataforma.tamanio()

      await expect(recibo).to.be.equal(4)
    })

    it('Devolver arreglo', async function () {
      const { plataforma } = await loadFixture(cuentasPrueba)
      const recibo = await plataforma.getArray()
      console.log(recibo)

      await expect(recibo.length).to.be.equal(4)
    })

    it('Devolver mapa', async function () {
      const { propietario, plataforma } = await loadFixture(cuentasPrueba)
      const recibo = (await plataforma.connect(propietario)).listar(false)

      await expect(recibo).not.to.be.reverted
    })
  })
})
