import React, { ComponentProps } from "react";
import { Story } from "@storybook/react";
import HeatMap from "../components/HeatMap";
import { 
  exampleData2Objectives2Scenarios2Solutions, 
  exampleData3Objectives3Scenarios3Solutions 
} from "../data/ExampleData";

export default {
  title: "HeatMap",
  component: HeatMap,
};

const Template: Story<ComponentProps<typeof HeatMap>> = (args) => {
  return (
    <div>
      <HeatMap {...args}/>
    </div>
  );
};

export const TwoObjectivesTwoScenariosTwoSolutions = Template.bind({});
TwoObjectivesTwoScenariosTwoSolutions.args = {
  solutionCollection: exampleData2Objectives2Scenarios2Solutions
}

export const ThreeObjectivesThreeScenariosThreeSolutions = Template.bind({});
ThreeObjectivesThreeScenariosThreeSolutions.args = {
  solutionCollection: exampleData3Objectives3Scenarios3Solutions
}