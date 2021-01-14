import {SubstrateService} from './substrate-service';

(async () => {
  console.log('Creating SubstrateService instance...');

  const service = new SubstrateService();
  await service.initialize();
  console.log(`SubstrateService instance has been created and initialized successfully`);

  console.log('Generating wallet...');
  const wallet = service.generateWallet();
  console.log(`Wallet has been generated successfully. Value is ${JSON.stringify(wallet)}`);

  console.log(`Issuing assets to user...`);
  const result = await service.issueAssetToUser(
    process.env.DESTINATION_PUBLIC_KEY,
    process.env.AMOUNT,
    process.env.FEE,
  );
  console.log(`Issuing assets to user has been completed successfully. Result is ${JSON.stringify(result)}`);
})();
