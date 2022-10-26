import React, { ComponentProps } from "react";
import { Story } from "@storybook/react";
import SB_EAF from "../components/SB_EAF";
import {
    eighteenSolThreeScenariosTwoObjectivesExampleData,
    oneSolTwentyScenariosTwoObjectivesExampleData
} from "../data/SB_EAFExampleData";



export default {
    /*
    * asdf
    */
    title: "Scenario based/SB-EAF",
    component: SB_EAF
};

const Template: Story<ComponentProps<typeof SB_EAF>> = args => {
    return <SB_EAF{...args}/>
};

/*
export const Controls = Template.bind({});
Controls.args = {
    showScenarioNames: true,
    scenarioCountColors:
    solutionDimensions:
    solutionCollection: eighteenSolThreeScenariosTwoObjectivesExampleData
};
*/

export const EighteenSolutionsThreeScenariosTwoObjectives = Template.bind({});
EighteenSolutionsThreeScenariosTwoObjectives.args = {
    solutionCollection: eighteenSolThreeScenariosTwoObjectivesExampleData
};


export const OneSolutionTwentyScenariosTwoObjectivesCustomColors = Template.bind({});
OneSolutionTwentyScenariosTwoObjectivesCustomColors.args = {
    showScenarioNames: true,
    solutionCollection: oneSolTwentyScenariosTwoObjectivesExampleData,
    scenarioCountColors: [
        '#0000AA',
        '#0000BB',
        '#0000CC',
        '#0000DD',
        '#0000EE',
        '#0000FF',
        '#00AA00',
        '#00BB00',
        '#00CC00',
        '#00DD00',
        '#00EE00',
        '#00FF00',
        '#AA0000',
        '#BB0000',
        '#CC0000',
        '#DD0000',
        '#EE0000',
        '#FF0000',
        '#BBBBBB',
        '#DDDDDD',
    ]
};