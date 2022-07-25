import React, { ComponentProps } from "react";
import { Story } from "@storybook/react";
import HeatMap from "../components/HeatMap";
import { exampleData2Objectives2Scenarios2Solutions } from "../data/ExampleData";

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
  solutions: exampleData2Objectives2Scenarios2Solutions
}