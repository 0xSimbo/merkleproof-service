# Merkle Proof Service


Kafka Broker

Services can be consumers

Leaf Hash Object has a -> pointer the s3 object

send a bundle of leaf hash objects for proofs


cache the s3 object (could be big savings)
load the s3 object (TTL strategy.deadline)

iterate the object
convert to csv

validte the tree

// cache the proof
get the proof for the leaf requested ttl to 5 minutes

return the proof


api 

- accepts an array of leaf hash object ids
- issue kafka messages for fetching the s3 object and computing proof
- wait for responses
- returns all the proofs for those leaf hashes