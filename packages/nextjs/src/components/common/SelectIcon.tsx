import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import IconDAI from '../Icon/DAI'
import IconLINK from '../Icon/LINK'
import IconMATIC from '../Icon/MATIC'
import IconSAND from '../Icon/SAND'
import IconUSDT from '../Icon/USDT'
import IconWBTC from '../Icon/WBTC'
import IconWETH from '../Icon/WETH'

const SelectIcon = ({ ticker }: { ticker: string }) => {
  switch (ticker) {
    case 'USDT':
      return <IconUSDT />
    case 'LINK':
      return <IconLINK />
    case 'SAND':
      return <IconSAND />
    case 'WETH':
      return <IconWETH />
    case 'MATIC':
      return <IconMATIC />
    case 'DAI':
      return <IconDAI />
    case 'WBTC':
      return <IconWBTC />
    default:
      return <MonetizationOnIcon />
  }
}

export default SelectIcon
