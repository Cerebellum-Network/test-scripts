import {ScenarioInterface} from './scenario-interface';
import Logger from '../services/logger';
import {SubstrateService} from '../services/substrate-service';
import cereTypes from './cere-network-type.json';
const CERE_DECIMAL = 10;

type EntityObject = {
  validator?: string;
  validatorStake?: number;
  nominators?: {who: string; value: number; earned: number}[];
  eraRewardPoint?: number;
  validatorTotalPoolEarning?: number;
  validatorCommissionEarning?: number;
  validatorPoolEarningWithoutCommission?: number;
  earnedTokenPerStakedToken?: number;
  totalStake?: number;
  validatorEarning?: number;
  commission?: number;
};

export class Scenarios_7 implements ScenarioInterface {
  logger = new Logger(Scenarios_7.name);

  public entity: EntityObject[] = [];
  public totalEraRewardPoints: number;
  public validatorReward: number;
  public treasuryReward: number;
  public tokenPerPoint: number;
  public eraIndex = +process.env.ERA_INDEX;
  public blockNumber = +process.env.BLOCK_NUMBER;

  public async run() {
    this.logger.log(`Starting scenario 7...`);

    this.logger.log(`Initializing the blockchain`);
    const service = new SubstrateService();
    await service.initialize(cereTypes);

    await this.fetchValidatorsAndNominatorsInfo(service, this.eraIndex);
    await this.fetchEraRewards(service, this.eraIndex);
    await this.fetchInflationRewards(service);

    this.tokenPerPoint = this.validatorReward / 10 ** CERE_DECIMAL / Number(this.totalEraRewardPoints);
    await this.calculateEarnings();

    this.logger.log(`Report ${JSON.stringify(this.entity)}`);
  }

  private async fetchValidatorsAndNominatorsInfo(service, eraIndex): Promise<any> {
    const {validators} = await service.fetchValidatorsAndNominatorsInfo(eraIndex);
    for (const validator in validators) {
      const validatorStake = Number(validators[validator].own) / 10 ** CERE_DECIMAL;
      const totalStake = Number(validators[validator].total) / 10 ** CERE_DECIMAL;
      const commission = await service.fetchValidatorsCommission(this.eraIndex, validator);
      const nominators = validators[validator].others.map((e) => {
        return {
          who: e.who.toString(),
          value: e.value.toNumber() / 10 ** CERE_DECIMAL,
        };
      });
      this.entity.push({
        validator,
        nominators: nominators,
        validatorStake: validatorStake,
        totalStake: totalStake,
        commission: commission,
      });
    }
  }

  private async fetchEraRewards(service, eraIndex): Promise<any> {
    const eraPoints = await service.fetchEraPoints(eraIndex);
    this.totalEraRewardPoints = eraPoints.get('total');
    const validatorEraPoints = eraPoints.get('individual');

    let validatorEraRewardObj = {};
    validatorEraPoints.forEach((value, key) => {
      const validator = key.toString();
      validatorEraRewardObj[validator] = Number(value);
    });

    this.entity.map((e) => {
      e.eraRewardPoint = validatorEraRewardObj[e.validator];
    });
  }

  private async fetchInflationRewards(service): Promise<any> {
    const rewardsInfo = await service.fetchBlockHash(this.blockNumber);
    const blockData = await service.fetchBlockData(rewardsInfo.toString());

    const {events} = blockData.onInitialize;

    events.forEach((event) => {
      if (event.method == 'staking.EraPayout') {
        this.validatorReward = event.data[1];
        this.treasuryReward = event.data[2];
      }
    });
  }

  private async calculateEarnings() {
    this.entity.map((e) => {
      const validatorPoolEarning = this.tokenPerPoint * e.eraRewardPoint;
      e.validatorTotalPoolEarning = validatorPoolEarning;

      if (e.commission > 0) {
        e.validatorCommissionEarning = validatorPoolEarning * (e.commission / 100);
        e.validatorPoolEarningWithoutCommission = e.validatorTotalPoolEarning - e.validatorCommissionEarning;
      } else {
        e.validatorCommissionEarning = 0;
        e.validatorPoolEarningWithoutCommission = e.validatorTotalPoolEarning;
      }

      const earnedTokenPerStakedToken = e.validatorPoolEarningWithoutCommission / e.totalStake;
      e.earnedTokenPerStakedToken = earnedTokenPerStakedToken;
      const validatorEarning = e.validatorStake * e.earnedTokenPerStakedToken;
      e.validatorEarning = validatorEarning + e.validatorCommissionEarning

      e.nominators.map((nominator) => {
        const earned = nominator.value * e.earnedTokenPerStakedToken;
        nominator.earned = earned;
      });
    });
  }
}
