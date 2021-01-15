import {ScenarioEnum} from "./enum/scenario.enum";
import {Scenarios_1} from "./scenarios/scenarios_1";
import {Scenarios_2} from "./scenarios/scenarios_2";
import {Scenarios_3} from "./scenarios/scenarios_3";

(async () => {
  const scenario = process.argv[2] as ScenarioEnum;

  switch (scenario) {
    case ScenarioEnum.SCENARIO_1: {
      const scenario = new Scenarios_1();
      await scenario.run();
      break;
    }
    case ScenarioEnum.SCENARIO_2: {
      const scenario = new Scenarios_2();
      await scenario.run();
      break;
    }
    case ScenarioEnum.SCENARIO_3: {
      const scenario = new Scenarios_3();
      await scenario.run();
      break;
    }

    default:
      throw new Error(`Unknown scenario: ${scenario}`);
  }

  process.exit();
})();
