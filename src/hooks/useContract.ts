import { Contract } from '@ethersproject/contracts'
import { ChainId, WETH } from 'uniswap-xdai-sdk'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { useMemo } from 'react'
import ENS_ABI from '../constants/abis/ens-registrar.json'
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json'
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20'
import ERC20_ABI from '../constants/abis/erc20.json'
import MASTERCHEF_ABI from '../constants/abis/masterchef.json'
import BAO from '../constants/abis/bao.json'
import UNI_ORACLE_ABI from '../constants/abis/unioracle.json'
import UNIV2LP from '../constants/abis/uni_v2_lp.json'
import UNISOCKS_ABI from '../constants/abis/unisocks.json'
import WETH_ABI from '../constants/abis/weth.json'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import { getContract } from '../utils'
import { useActiveWeb3React } from './index'
import { contractAddresses } from '../bao/lib/constants'

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

// native wrapped chain currency
export function useWETHContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? WETH[chainId].address : undefined, WETH_ABI, withSignerIfPossible)
}

export function useLPContract(address?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, UNIV2LP, withSignerIfPossible)
}

export function useMasterChefContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()

  return useContract(
    chainId === ChainId.XDAI ? contractAddresses.masterChef[ChainId.XDAI] : undefined,
    MASTERCHEF_ABI,
    withSignerIfPossible
  )
}

export function useBaoContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()

  return useContract(
    chainId === ChainId.XDAI ? contractAddresses.bao[ChainId.XDAI] : undefined,
    BAO,
    withSignerIfPossible
  )
}

export function useBaoPriceContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()

  return useContract(
    chainId === ChainId.XDAI ? contractAddresses.baoPrice[ChainId.XDAI] : undefined,
    UNI_ORACLE_ABI,
    withSignerIfPossible
  )
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.XDAI:
        address = '0x25D2252Ec30de7830b6825D6b4A08E70a581cD6a'
        break
      case ChainId.MAINNET:
      case ChainId.GÖRLI:
      case ChainId.ROPSTEN:
      case ChainId.RINKEBY:
        address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
        break
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible)
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}

export function useSocksController(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(
    chainId === ChainId.MAINNET ? '0x65770b5283117639760beA3F867b69b3697a91dd' : undefined,
    UNISOCKS_ABI,
    false
  )
}
