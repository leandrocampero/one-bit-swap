import { createContext } from 'react'
import { BlockchainActions, BlockchainState } from '@/context/context.d'

type BlockchainContextProps = {
  state: BlockchainState
  actions: BlockchainActions
}

export const BlockchainContext = createContext<BlockchainContextProps>(
  {} as BlockchainContextProps
)
