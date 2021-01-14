# test-scripts

1. Up node locally with `docker-compose up -d node`

2. Deploy assets
    
    2.1. [Create Smart Contract artifacts](https://github.com/Cerebellum-Network/private-standalone-network-node/blob/dev/docs/derivative_assets.md#1-create-smart-contract-artifacts)

    2.2. [Upload artifacts to the Network](https://github.com/Cerebellum-Network/private-standalone-network-node/blob/dev/docs/derivative_assets.md#2-upload-artifacts-wasm-and-metadata-files-first)
    
    2.3. [Deploy Smart Contract to the Network](https://github.com/Cerebellum-Network/private-standalone-network-node/blob/dev/docs/derivative_assets.md#2-upload-artifacts-wasm-and-metadata-files-first)

3. [Create a new account in the network](https://github.com/Cerebellum-Network/validator-instructions/blob/master/docs/staking_accounts.md#step-1-create-a-stash-account)

4. Update environment variables in `docker-compose.yml` from 2 and 3

5. Run test scripts with `docker-compose up -d test_scripts`
    
