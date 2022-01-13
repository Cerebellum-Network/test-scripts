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
  validatorPoolEarning?: number;
  earnedTokenPerStakedToken?: number;
  totalStake?: number;
  validatorEarning?: number;
};
export class Scenarios_7 implements ScenarioInterface {
  logger = new Logger(Scenarios_7.name);

  public entity: EntityObject[] = [];
  public totalEraRewardPoints: number;
  public validatorReward: number;
  public treasuryReward: number;
  public tokenPerPoint: number;
  public eraIndex = +process.env.ERA_INDEX
  public blockNumber = +process.env.BLOCK_NUMBER

  public async run() {
    this.logger.log(`Starting scenario 7...`);

    this.logger.log(`Initializing the blockchain`);
    const service = new SubstrateService();
    await service.initialize(cereTypes);

    await this.fetchValidatorAndNominator(service);
    await this.eraRewards(service, this.eraIndex);
    await this.fetchRewards(service);

    this.tokenPerPoint = this.validatorReward / 10 ** CERE_DECIMAL / Number(this.totalEraRewardPoints);
    await this.calculate();

    this.logger.log(`Report ${JSON.stringify(this.entity)}`);
  }

  private async fetchValidatorAndNominator(service): Promise<any> {
    const electedInfo = await service.fetchElectedInfo();
    electedInfo.info.forEach((element) => {
      const validator = element.accountId.toString();
      const vs = Number(element.exposure.own) / 10 ** CERE_DECIMAL;
      const totalStake = Number(element.exposure.total) / 10 ** CERE_DECIMAL;
      const nominators = element.exposure.others.map((e) => {
        return {
          who: e.who.toString(),
          value: e.value.toNumber() / 10 ** CERE_DECIMAL,
        };
      });
      this.entity.push({
        validator,
        nominators: nominators,
        validatorStake: vs,
        totalStake: totalStake,
      });
    });
  }

  private async eraRewards(service, eraIndex): Promise<any> {
    const eraPoints = await service.fetchEraPoints(eraIndex);
    this.totalEraRewardPoints = eraPoints.get('total');
    const validatorEraPoints = eraPoints.get('individual');

    let obj = {}
    validatorEraPoints.forEach((value, key) => {
      const validator = key.toString()
      obj[validator] = Number(value)
    })

    this.entity.map((e) => {
      e.eraRewardPoint = obj[e.validator]
    });
  }

  private async fetchRewards(service): Promise<any> {
    const rewardsInfo = await service.fetchRewards(this.blockNumber);
    const blockData = await service.fetchBlockData(rewardsInfo.toString());

    const {events} = blockData.onInitialize;

    events.forEach((event) => {
      if (event.method == 'staking.EraPayout') {
        this.validatorReward = event.data[1];
        this.treasuryReward = event.data[2];
      }
    });
  }

  private async calculate() {
    this.entity.map((e) => {
      const validatorPoolEarning = this.tokenPerPoint * e.eraRewardPoint;
      e.validatorPoolEarning = validatorPoolEarning;
      const earnedTokenPerStakedToken = validatorPoolEarning / e.totalStake;
      e.earnedTokenPerStakedToken = earnedTokenPerStakedToken;
      const validatorEarning = e.validatorStake * e.earnedTokenPerStakedToken;
      e.validatorEarning = validatorEarning;

      e.nominators.map((nominator) => {
        const earned = nominator.value * e.earnedTokenPerStakedToken;
        nominator.earned = earned;
      });
    });
  }
}
