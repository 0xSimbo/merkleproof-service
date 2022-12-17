import MerkleTree from 'merkletreejs';
import keccak256 from 'keccak256';





/// @param unhashedLeaves - array of unhashed leaves
/// @return tree - returns merkle tree based on the keccak256 hash function
export const createTree = ({hashedLeaves,
unhashedLeaves}:{
    hashedLeaves?:any[],
    unhashedLeaves?:any[]
}) => {
    if(!hashedLeaves && !unhashedLeaves) {
        throw new Error('Must provide either hashedLeaves or unhashedLeaves')
    }
    if(hashedLeaves) {
        const tree = new MerkleTree(hashedLeaves, keccak256, { sortPairs: true });
        return tree;
    } 
    if(unhashedLeaves) {
        const hashedLeaves = unhashedLeaves.map((leaf:any) => keccak256(leaf))
        const tree = new MerkleTree(hashedLeaves, keccak256, { sortPairs: true })
        return tree;
    }

  }

/// @param tree - merkle tree
/// @return root - returns the root of the merkle tree
export const createRoot = (tree:MerkleTree):string => {
    const root = tree.getHexRoot()
    return root
}

/// @param tree - merkle tree
/// @param unhashedLeaf - unhashed leaf to create proof for
/// @return proof - returns proof of the leaf
export const createProof = ({
    tree,
    hashedLeaf
}:{
    tree:MerkleTree,
    hashedLeaf:string
}) => {
    const proof = tree.getHexProof(hashedLeaf);
    return proof
}

/// @param tree - merkle tree
/// @param root - root of the merkle tree
/// @param hashedLeaf - hashed leaf to verify
/// @param proof - proof of the leaf
/// @return isValid - returns true if the proof is valid
export const verifyProof = (tree:MerkleTree, proof:any[], hashedLeaf:string | Buffer, root:string | Buffer) => {
    const isValid = tree.verify(proof, hashedLeaf, root)
    return isValid
}
