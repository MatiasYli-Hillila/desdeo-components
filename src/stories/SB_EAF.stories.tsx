import React, { ComponentProps } from "react";
import { Story } from "@storybook/react";
import SB_EAF from "../components/SB_EAF";
import {
    exampleData2Objectives2Scenarios2Solutions,
    exampleData3Objectives3Scenarios3Solutions,
    readFileTestExampleData
 } from "../data/SB_EAFExampleData";



export default {
    title: "Scenario based/SB-EAF",
    component: SB_EAF,
};

const Template: Story<ComponentProps<typeof SB_EAF>> = args => {
    return <SB_EAF{...args}/>
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