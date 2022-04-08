import {ScenarioEnum} from "./enum/scenario.enum";
import {Scenarios_1} from "./scenarios/scenarios_1";
import {Scenarios_2} from "./scenarios/scenarios_2";
import {Scenarios_3} from "./scenarios/scenarios_3";
import {Scenarios_4} from "./scenarios/scenarios_4";
import {Scenarios_5} from "./scenarios/scenarios_5";
import {Scenarios_6} from "./scenarios/scenarios_6";
import {Scenarios_7} from "./scenarios/scenarios_7";
import {Scenarios_8} from "./scenarios/scenarios_8";
import dotenv from "dotenv";

dotenv.config();

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

    case ScenarioEnum.SCENARIO_4: {
      const scenario = new Scenarios_4();
      await scenario.run();
      break;
    }

    case ScenarioEnum.SCENARIO_5: {
      const scenario = new Scenarios_5();
      await scenario.run();
      break;
    }

    case ScenarioEnum.SCENARIO_6: {
      const scenario = new Scenarios_6();
      await scenario.run();
      break;
    }

    case ScenarioEnum.SCENARIO_7: {
      const scenario = new Scenarios_7();
      await scenario.run();
      break;
    }

    case ScenarioEnum.SCENARIO_8: {
      const scenario = new Scenarios_8();
      await scenario.run();
      break;
    }

    default:
      throw new Error(`Unknown scenario: ${scenario}`);
  }

  process.exit();
})();
