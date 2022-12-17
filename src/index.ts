

type StrategyDTO = {};
//The request object for a single leaf
type LeafRequestObject = {
    leafId: string,
    leaf: string, //will already be hashed
    s3Url: string
}
type RequestDTO =  LeafRequestObject[]


const parseRequestDTO = (request:RequestDTO):RequestDTO => {
    let parsedRequest = request
    // parse request
    return parsedRequest
};

const parseStrategyDTO = (strategy:StrategyDTO):StrategyDTO => {
    let parsedStrategy = strategy
    // parse strategy
    return parsedStrategy
};


type ProofObject = {
    leaf: string,
    proof: string[],
}
type ResponsePayload = ProofObject[];

/*
Step 1. Check if proof is in cache
Step 2. If it is then return the proof and set TTL to 5 minutes from now
Step 3. If it is not, then check if the s3 object is in cache
Step 4. If it is then fetch the s3 object from cache and set TTL to the strategy.deadline
Step 5. If it is not then fetch the s3 object from s3 and store it in cache
Step 6. Use the s3 object to generate the tree
Step 7. Use the tree to generate the proof
Step 8. Store the proof in cache and set TTL to 5 minutes from now
Step 9. Return the proof
*/


const generateProofAndHandleCache = async (leaf:string):Promise<ProofObject | null> => {
    let proof:ProofObject | null = null
    //Check if proof is in cache
    //If it is then return the proof

    //`If it is not, then check if the s3 object is in cache
    //If it is then fetch the s3 object from cache and set TTL to the strategy.deadline
    
    return proof
}


const merkleProofServiceController = async (RequestDTO:RequestDTO):Promise<ProofObject[]> => {

    let proofs:ResponsePayload = []
    const parsedRequest = parseRequestDTO(RequestDTO)
    //First Step Is To Check If The Proof Is In The Cache
    //If It Is Then Return The Proof
    for(const leaf of parsedRequest) {
        const proof = await generateProofAndHandleCache(leaf.leaf)
        if(proof) {
            proofs.push(proof)
        }
    }
    return proofs;
}
