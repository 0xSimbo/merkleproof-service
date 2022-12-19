import { BigNumber } from 'ethers';
import { Collateral, Collection, type, UniV3Collateral } from '../types';
import { CollateralInsidePayload, CollectionInsidePayload, UniV3CollateralInsidePayload } from '../types';
import { StrategyLeafType } from '../types';
import { getAddress } from 'ethers/lib/utils';
export const mockData = {
  data: {
    leaves: [
      {
        amount0Min: { hex: '0x00', type: 'BigNumber' },
        amount1Min: { hex: '0x00', type: 'BigNumber' },
        borrower: '0x3aF925979cD0F086aACf48Ead7C01efE29BCddDC',
        fee: { hex: '0x05', type: 'BigNumber' },
        leaf: '0xa8cbca5af4f038b4dbca146f16d2474c1e5551745dfb63a63088ebef14356c51',
        lien: {
          amount: { hex: '0x05', type: 'BigNumber' },
          duration: { hex: '0x05', type: 'BigNumber' },
          liquidationInitialAsk: { hex: '0x05', type: 'BigNumber' },
          maxPotentialDebt: { hex: '0x05', type: 'BigNumber' },
          rate: { hex: '0x05', type: 'BigNumber' },
        },
        minLiquidity: { hex: '0x01', type: 'BigNumber' },
        tickLower: { hex: '0x05', type: 'BigNumber' },
        tickUpper: { hex: '0x05', type: 'BigNumber' },
        token: '0xAfd5cD092BeF488803aAaDa4fF3FEbF2aF1a2a4a',
        token0: '0x3302E37F3F4d9D4E09E9E0A6F759e05bE5Becd2D',
        token1: '0xF1748C8A3Cb5E6e8B4954D68fB3c5B2d0eCaCDb5',
        type: 3,
      },
    ],
    signature: {
      _vs: '0x9bc8f93dfe49331273c11706e57dec8ad954fcd5ac2994b8641cd0a435674a5e',
      compact:
        '0x05093d79661e48b235490d764b7156478503479902b7f9e2aec5fa81844eed0a9bc8f93dfe49331273c11706e57dec8ad954fcd5ac2994b8641cd0a435674a5e',
      r: '0x05093d79661e48b235490d764b7156478503479902b7f9e2aec5fa81844eed0a',
      recoveryParam: '1',
      s: '0x1bc8f93dfe49331273c11706e57dec8ad954fcd5ac2994b8641cd0a435674a5e',
      v: '28',
      yParityAndS: '0x9bc8f93dfe49331273c11706e57dec8ad954fcd5ac2994b8641cd0a435674a5e',
    },
    typedData: {
      domain: {
        chainId: 5,
        verifyingContract: '0xc9490242DFa4446d952d0C58135eb041119FAC21',
        version: 0,
      },
      message: {
        deadline: 0x05,
        nonce: 0x07,
        root: '0xa8cbca5af4f038b4dbca146f16d2474c1e5551745dfb63a63088ebef14356c51',
      },
      primaryType: 'StrategyDetails',
      types: {
        EIP712Domain: [
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        StrategyDetails: [
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
          { name: 'root', type: 'bytes32' },
        ],
      },
    },
  },
};

