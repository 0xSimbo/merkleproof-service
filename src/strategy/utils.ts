import { JsonRpcProvider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';
import { keccak256, defaultAbiCoder, getAddress, splitSignature } from 'ethers/lib/utils';
import { Wallet, Signature } from 'ethers';
import invariant from 'tiny-invariant';
import {
  Collateral,
  Collection,
  Strategy,
  StrategyLeafType,
  IPFSStrategyPayload,
  TypedData,
  UniV3Collateral,
  JsonPayload,
  CollectionInsidePayload,
  CollateralInsidePayload,
  UniV3CollateralInsidePayload,
} from '../types';
import MerkleTree from 'merkletreejs';
import * as fs from 'fs';
import { mockData } from '../helpers/mockData';


export const hashCollateral = (collateral: Collateral): string => {
  // invariant(collateral, 'hashCollateral: collateral must be defined')

  let encode = defaultAbiCoder.encode(
    ['uint8', 'address', 'uint256', 'address', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256'],
    [
      collateral.type,
      collateral.token,
      collateral.tokenId,
      collateral.borrower,
      collateral.lien.amount,
      collateral.lien.rate,
      collateral.lien.duration,
      collateral.lien.maxPotentialDebt,
      collateral.lien.liquidationInitialAsk,
    ]
  );

  return keccak256(encode);
};

export const hashUniV3Collateral = (collateral: UniV3Collateral): string => {
  invariant(collateral, 'hashUniV3Collateral: collateral must be defined');

  let encode = defaultAbiCoder.encode(
    [
      'uint8',
      'address',
      'address',
      'address',
      'address',
      'uint24',
      'int24',
      'int24',
      'uint128',
      'uint256',
      'uint256',
      'uint256',
      'uint256',
      'uint256',
      'uint256',
      'uint256',
    ],
    [
      collateral.type,
      collateral.token,
      collateral.borrower,

      collateral.token0,
      collateral.token1,
      collateral.fee,
      collateral.tickLower,
      collateral.tickUpper,
      collateral.minLiquidity,
      collateral.amount0Min,
      collateral.amount1Min,

      collateral.lien.amount,
      collateral.lien.rate,
      collateral.lien.duration,
      collateral.lien.maxPotentialDebt,
      collateral.lien.liquidationInitialAsk,
    ]
  );

  return keccak256(encode);
};

export const hashCollection = (collection: Collection): string => {
  invariant(collection, 'hashCollection: collection must be defined');

  const encode = defaultAbiCoder.encode(
    ['uint8', 'address', 'address', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256'],
    [
      collection.type,
      collection.token,
      collection.borrower,

      collection.lien.amount,
      collection.lien.rate,
      collection.lien.duration,
      collection.lien.maxPotentialDebt,
      collection.lien.liquidationInitialAsk,
    ]
  );
  return keccak256(encode);
};


export type ParsedStrategyRow = Array<Collateral | Collection | UniV3Collateral>;

export interface StrategyObjectFactory<RowType> {
  (rowData: string): RowType;
}

export const createCollateralOrCollection: StrategyObjectFactory<Collateral | Collection | UniV3Collateral> = (
  rowData
) => {
  const row: any = RE_STRATEGY_ROW.exec(rowData)?.groups;
  switch (parseInt(row.type, 10)) {
    case StrategyLeafType.Collateral: {
      return {
        type: StrategyLeafType.Collateral,
        token: getAddress(row.token.toLowerCase()),
        tokenId: BigNumber.from(String(row.tokenId)),
        borrower: getAddress(row.borrower.toLowerCase()),
        lien: {
          amount: BigNumber.from(String(row.amount)),
          rate: BigNumber.from(String(row.rate)),
          duration: BigNumber.from(String(row.duration)),
          maxPotentialDebt: BigNumber.from(String(row.maxPotentialDebt)),
          liquidationInitialAsk: BigNumber.from(String(row.liquidationInitialAsk)),
        },
      };
    }

    case StrategyLeafType.Collection: {
      return {
        type: StrategyLeafType.Collection,
        token: getAddress(row.token.toLowerCase()),
        borrower: getAddress(row.borrower.toLowerCase()),
        lien: {
          amount: BigNumber.from(String(row.amount)),
          rate: BigNumber.from(String(row.rate)),
          duration: BigNumber.from(String(row.duration)),
          maxPotentialDebt: BigNumber.from(String(row.maxPotentialDebt)),
          liquidationInitialAsk: BigNumber.from(String(row.liquidationInitialAsk)),
        },
      };
    }

    case StrategyLeafType.UniV3Collateral: {
      return {
        type: StrategyLeafType.UniV3Collateral,
        token: getAddress(row.token.toLowerCase()),
        borrower: getAddress(row.borrower.toLowerCase()),
        token0: getAddress(row.token0.toLowerCase()),
        token1: getAddress(row.token1.toLowerCase()),
        fee: BigNumber.from(String(row.fee)),
        tickLower: BigNumber.from(String(row.tickLower)),
        tickUpper: BigNumber.from(String(row.tickUpper)),
        minLiquidity: BigNumber.from(String(row.minLiquidity)),
        amount0Min: BigNumber.from(String(row.amount0Min)),
        amount1Min: BigNumber.from(String(row.amount1Min)),
        lien: {
          amount: BigNumber.from(String(row.amount)),
          rate: BigNumber.from(String(row.rate)),
          duration: BigNumber.from(String(row.duration)),
          maxPotentialDebt: BigNumber.from(String(row.maxPotentialDebt)),
          liquidationInitialAsk: BigNumber.from(String(row.liquidationInitialAsk)),
        },
      };
    }
  }

  throw Error('invalid row');
};
export const RE_STRATEGY_ROW =
  /^(?<type>\d+)[,]{1}(?<token>0x[a-fA-F0-9]{40})[,]{1}(?<tokenId>\d{0,78})[,]{0,1}(?<borrower>0x[a-fA-F0-9]{40})[,]{1}((?<token0>0x[a-fA-F0-9]{40})[,]{1}(?<token1>0x[a-fA-F0-9]{40})[,]{1}(?<fee>\d{1,8})[,]{1}(?<tickLower>-\d{1,8})[,]{1}(?<tickUpper>-\d{1,8})[,]{1}(?<minLiquidity>\d{1,39})[,]{1}(?<amount0Min>\d{0,78})[,]{1}(?<amount1Min>\d{0,78})[,]{1}){0,1}(?<amount>\d{0,78})[,]{1}(?<rate>\d{0,78})[,]{1}(?<duration>\d{1,20})[,]{1}(?<maxPotentialDebt>\d{0,78})[,]{1}(?<liquidationInitialAsk>\d{0,78})$/;

const validateCollateralOrCollectionRow = (row: string): boolean => row.length > 0 && RE_STRATEGY_ROW.test(row);

const trimAndSplitByLine = (csv: string): string[] => csv.replaceAll(' ', '').replaceAll('\r', '').split('\n');

interface ValidateStrategyCSV {
  (csv: string): ParsedStrategyRow;
}

export const validate: ValidateStrategyCSV = (csv: string) => {
  const rows = trimAndSplitByLine(csv);

  const parsed = rows.filter(validateCollateralOrCollectionRow).map(createCollateralOrCollection);

  return parsed;
};

// hashes the parameters of the terms and collateral to produce a single bytes32 value to act as the root
export const prepareLeaves = (csv: Array<Collateral | Collection | UniV3Collateral>) => {
  csv.forEach((row: Collateral | Collection | UniV3Collateral) => {
    switch (row.type) {
      case StrategyLeafType.Collection: {
        row.leaf = hashCollection(row);
        break;
      }

      case StrategyLeafType.Collateral: {
        row.leaf = hashCollateral(row);
        break;
      }

      case StrategyLeafType.UniV3Collateral: {
        row.leaf = hashUniV3Collateral(row);
        break;
      }
    }
  });
};

type ProofAndRoot = {
  proof: string[];
  root: string;
};
const generateProof = (leaves: Array<Collateral | Collection | UniV3Collateral>, leaf: string) => {
  const treeLeaves: string[] = leaves.map((leaf) => {
    switch (leaf.type) {
      case StrategyLeafType.Collection: {
        return hashCollection(leaf);
      }
      case StrategyLeafType.Collateral: {
        return hashCollateral(leaf);
      }

      case StrategyLeafType.UniV3Collateral: {
        return hashUniV3Collateral(leaf);
      }
    }
  });

  const tree = new MerkleTree(treeLeaves, keccak256, { sort: true });
  const root = tree.getHexRoot();
  const proof = tree.getHexProof(leaf);
  //Verify proof
  const isValid = tree.verify(proof, leaf, root);
  if (!isValid) throw Error('invalid proof');
  return { proof, root };
};

export const parseJsonLeaf = (
  leaf: CollectionInsidePayload | CollateralInsidePayload | UniV3CollateralInsidePayload
): Collateral | Collection | UniV3Collateral => {
  switch (leaf.type) {
    case StrategyLeafType.UniV3Collateral:
      return {
        amount0Min: BigNumber.from(`${leaf.amount0Min.hex}`),
        amount1Min: BigNumber.from(`${leaf.amount1Min.hex}`),
        borrower: getAddress(`${leaf.borrower}`),
        fee: BigNumber.from(`${leaf.fee.hex}`),
        leaf: `${leaf.leaf}`,
        lien: {
          amount: BigNumber.from(`${leaf.lien.amount.hex}`),
          duration: BigNumber.from(`${leaf.lien.duration.hex}`),
          liquidationInitialAsk: BigNumber.from(`${leaf.lien.liquidationInitialAsk.hex}`),
          maxPotentialDebt: BigNumber.from(`${leaf.lien.maxPotentialDebt.hex}`),
          rate: BigNumber.from(`${leaf.lien.rate.hex}`),
        },
        minLiquidity: BigNumber.from(`${leaf.minLiquidity.hex}`),
        tickLower: BigNumber.from(`${leaf.tickLower.hex}`),
        tickUpper: BigNumber.from(`${leaf.tickUpper.hex}`),
        token: getAddress(`${leaf.token}`),
        token0: getAddress(`${leaf.token0}`),
        token1: getAddress(`${leaf.token1}`),
        type: leaf.type,
      };
    case StrategyLeafType.Collateral:
      return {
        type: leaf.type,
        tokenId: BigNumber.from(`${leaf.tokenId.hex}`),
        borrower: getAddress(`${leaf.borrower}`),
        lien: {
          amount: BigNumber.from(`${leaf.lien.amount.hex}`),
          duration: BigNumber.from(`${leaf.lien.duration.hex}`),
          liquidationInitialAsk: BigNumber.from(`${leaf.lien.liquidationInitialAsk.hex}`),
          maxPotentialDebt: BigNumber.from(`${leaf.lien.maxPotentialDebt.hex}`),
          rate: BigNumber.from(`${leaf.lien.rate.hex}`),
        },
        token: getAddress(`${leaf.token}`),
        leaf: `${leaf.leaf}`,
      };
    case StrategyLeafType.Collection:
      return {
        type: leaf.type,
        borrower: getAddress(`${leaf.borrower}`),
        lien: {
          amount: BigNumber.from(`${leaf.lien.amount.hex}`),
          duration: BigNumber.from(`${leaf.lien.duration.hex}`),
          liquidationInitialAsk: BigNumber.from(`${leaf.lien.liquidationInitialAsk.hex}`),
          maxPotentialDebt: BigNumber.from(`${leaf.lien.maxPotentialDebt.hex}`),
          rate: BigNumber.from(`${leaf.lien.rate.hex}`),
        },
        token: getAddress(`${leaf.token}`),
        leaf: `${leaf.leaf}`,
      };
  }
};

const ingestPayload = (payload: JsonPayload) => {
  // TODO: Ask About Where Leaf Is Coming From
  const parsedLeaves = payload.data.leaves.map(
    (leaf: CollectionInsidePayload | CollateralInsidePayload | UniV3CollateralInsidePayload) => {
      return parseJsonLeaf(leaf);
    }
  );

  const { proof, root } = generateProof(parsedLeaves, '0x0');
  return {
    proof,
    root,
  };
};

const parsedLeaves = mockData.data.leaves.map(
  (leaf: CollectionInsidePayload | CollateralInsidePayload | UniV3CollateralInsidePayload) => {
    return parseJsonLeaf(leaf);
  }
);

if(require.main === module) {
  //@ts-ignore
  const parsedMockData: UniV3Collateral = parseJsonLeaf(mockData.data.leaves[0]);
  const { proof, root } = generateProof(parsedLeaves, hashUniV3Collateral(parsedMockData));
  console.log(proof);
}







//-------------- Stashed -----------------//

// const arrarifyCollection = (collection: Collection) => {
//   return [
//     collection.type,
//     collection.token,
//     collection.borrower,

//     collection.lien.amount,
//     collection.lien.rate,
//     collection.lien.duration,
//     collection.lien.maxPotentialDebt,
//     collection.lien.liquidationInitialAsk,
//   ]
// }

// const arrarifyCollateral = (collateral: Collateral) => {
//   return [
//     collateral.type,
//     collateral.token,
//     collateral.tokenId,
//     collateral.borrower,
//     collateral.lien.amount,
//     collateral.lien.rate,
//     collateral.lien.duration,
//     collateral.lien.maxPotentialDebt,
//     collateral.lien.liquidationInitialAsk,
//   ]
// }

// const arrarifyUniV3Collateral = (collateral: UniV3Collateral) => {
//   return [
//     collateral.type,
//     collateral.token,
//     collateral.borrower,

//     collateral.token0,
//     collateral.token1,
//     collateral.fee,
//     collateral.tickLower,
//     collateral.tickUpper,
//     collateral.minLiquidity,
//     collateral.amount0Min,
//     collateral.amount1Min,

//     collateral.lien.amount,
//     collateral.lien.rate,
//     collateral.lien.duration,
//     collateral.lien.maxPotentialDebt,
//     collateral.lien.liquidationInitialAsk,
//   ]
// }