import React, { ComponentProps } from "react";
import { Story } from "@storybook/react";
import HeatMap from "../components/HeatMap";
import {
    exampleData2Objectives2Scenarios2Solutions,
    exampleData3Objectives3Scenarios3Solutions,
    readFileTestExampleData,
    forest2D
} from "../data/HeatMapExampleData";


export default {
    title: "Scenario based/HeatMap",
    component: HeatMap,
};

const Template: Story<ComponentProps<typeof HeatMap>> = args => {
    return <HeatMap {...args}/>
};

export const TwoObjectivesTwoScenariosTwoSolutions = Template.bind({});
TwoObjectivesTwoScenariosTwoSolutions.args = {
    solutionCollection: exampleData2Objectives2Scenarios2Solutions
};

export const ThreeObjectivesThreeScenariosThreeSolutions = Template.bind({});
ThreeObjectivesThreeScenariosThreeSolutions.args = {
    solutionCollection: exampleData3Objectives3Scenarios3Solutions
};

export const readFileDataTest = Template.bind({});
readFileDataTest.args = {
    solutionCollection: readFileTestExampleData
};

export const ForestOptimization2D = Template.bind({});
ForestOptimization2D.args = {
    solutionDimensions: {
        width: 800,
        height: 200,
        margin: {
            left: 120,
            right: 80,
            top: 80,
            bottom: 80
        }
    },
    solutionCollection: forest2D
}