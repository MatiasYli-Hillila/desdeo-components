import React, { ComponentProps } from "react";
import { Story } from "@storybook/react";
import HeatMap from "../components/HeatMap";

export default {
  title: "HeatMap",
  component: HeatMap,
};

const Template: Story<ComponentProps<typeof HeatMap>> = (args) => {
  return (
    <div>
      <HeatMap/>
    </div>
  );
};

export const TwoObjectivesTwoScenariosTwoSolutions = Template.bind({});