# Scripts for testing Substrate-based Cere Turnkey Private Network

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

Update environment variables in `./env` file in this repo. You need to update the following parameters:
```bash
SMART_CONTRACT_ADDRESS
APP_WALLET_JSON
APP_WALLET_PASSPHRASE
```
#### 5. Run tests

**Scenario 1: Generate user's wallet and send assets to it.**

Scenario 1 contains implementation of basic asset transfer.

Run first scenario using command:
```bash
docker-compose up scenario_1
```
**Scenario 2: Fee Abstraction for user's wallet.**

Scenario 2 contains implementation of fee abstraction.

Run second scenario using command:
```bash
docker-compose up scenario_2
```
**Scenario 3: Batch transactions for transfer assets.**

Scenario 3 contains implementation of batch tx call.

Run third scenario using command:
```bash
docker-compose up scenario_3
```
**Scenario 4: Issue Restricted Assets.**

Scenario 4 contains implementation of issuing of Restricted Assets.

Run fourth scenario using command:
```bash
docker-compose up scenario_4
```
**Scenario 5: Data transaction.**

Scenario 5 contains implementation of submitting of data transaction.

Run fifth scenario using command:
```bash
docker-compose up scenario_5
```
