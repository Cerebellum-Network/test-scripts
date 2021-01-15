# Script for testing Cere Turnkey Private Network

This repository supposed to be used for testing Cere Turnkey Private Network. It also consist of some other helpful tools.

#### 1. Up and run Private Node
In order to start testing Private Network, you need to up and run node locally using command:
```bash
docker-compose up -d node
```

#### 2. Create application wallet/account 

In order to run script you need to have application wallet/account with some funded amount of native tokens to process transactions. Use [Create a new account guide](https://github.com/Cerebellum-Network/validator-instructions/blob/master/docs/staking_accounts.md#step-1-create-a-stash-account) for this purpose.

#### 3. Deploy Smart Contract

Now you need to deploy Smart Contract using just created application wallet to the network using [How to deploy Smart Contract guide](https://github.com/Cerebellum-Network/private-standalone-network-node/blob/dev/docs/derivative_assets.md#how-to-deploy-enterprise-derivative-assets-via-smart-contract).


#### 4. Configure script environment variables

Update environment variables in `./docker-compose.yaml` file in this repo. You need to update the following parameters:
```bash
SMART_CONTRACT_ADDRESS
APP_WALLET_JSON
APP_WALLET_PASSPHRASE
```
#### 5. Run tests
Now run scripts using command:
```bash
docker-compose up -d test_scripts
```
