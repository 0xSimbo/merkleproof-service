import type { BigNumber } from "ethers"
import { Bytes } from "ethers/lib/utils"
import { createTree } from "./merkle"
/*
leaves are types
address, borrower
bytes32, leaf
uint256, amount
uint256, duration
uint256, liquidationInitialAsk
uint256, maxPotentialDebt
uint256, rate
address, token
uint256, tokenId
uint8    type
*/
type JsonPayload = {
    data:{
        leaves:{
            borrower:string,
            leaf:string,
            lien:{
                amount: BigNumber,
                duration:BigNumber,
                liquidationInitialAsk:BigNumber,
                maxPotentialDebt:BigNumber,
                rate:BigNumber,
            },
            token:string,
            tokenId:BigNumber,
            type:number
    },
    signature:{
        _vs:string,
        compact:string,
        r:string,
        recoveryParam:number,
        s:string,
        v:number,
        yParityAndS:string
    },
    typedData:{
        domain:{
            chainId:number,
            verifyingContract:string,
            version:string
        },
        message:{

        },
        primaryType:string,
        types:{
            EIP712Domain:[{
                name:string,
                type:string
            }],
            StrategyDetails:[{
                name:string,
                type:string
            }]
        }
    },
}
}



type ParsedLeaves = {
    borrower:string,
    leaf:string,
    amount:BigNumber,
    duration:BigNumber,
    liquidationInitialAsk:BigNumber,
    maxPotentialDebt:BigNumber,
    rate:BigNumber,
    token:string,
    tokenId:BigNumber,
    type:number

}
export const parseJsonPayload = (json:JsonPayload):ParsedLeaves => {
     const leaves = json.data.leaves
        const parsedLeaves = {
            borrower:leaves.borrower,
            leaf:leaves.leaf,
            amount:leaves.lien.amount,
            duration:leaves.lien.duration,
            liquidationInitialAsk:leaves.lien.liquidationInitialAsk,
            maxPotentialDebt:leaves.lien.maxPotentialDebt,
            rate:leaves.lien.rate,
            token:leaves.token,
            tokenId:leaves.tokenId,
            type:leaves.type

        }
        return parsedLeaves
}



export const generateProof = (leaves:JsonPayload,hashedLeaf:any)=> {
   const unhashedLeaves = [
        leaves.data.leaves.borrower,
        leaves.data.leaves.leaf,
        leaves.data.leaves.lien.amount,
        leaves.data.leaves.lien.duration,
        leaves.data.leaves.lien.liquidationInitialAsk,
        leaves.data.leaves.lien.maxPotentialDebt,
        leaves.data.leaves.lien.rate,
        leaves.data.leaves.token,
        leaves.data.leaves.tokenId,
        leaves.data.leaves.type
   ]
    const tree = createTree({unhashedLeaves})
    const root = tree?.getHexRoot()
    const proof = tree?.getHexProof(hashedLeaf)
    return {
        root,
        proof
    }


}



