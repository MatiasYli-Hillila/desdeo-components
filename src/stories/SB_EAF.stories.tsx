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
    showScenarioNames: true,
    solutionCollection: eighteenSolThreeScenariosTwoObjectivesExampleData
};


export const OneSolutionTwentyScenariosTwoObjectivesCustomColors = Template.bind({});
OneSolutionTwentyScenariosTwoObjectivesCustomColors.args = {
    showScenarioNames: true,
    solutionCollection: oneSolTwentyScenariosTwoObjectivesExampleData,
    scenarioCountColors: [
        '#0000AA',
        '#0000CC',
        '#0000EE',
        '#0022FF',
        '#0044DD',
        '#0066BB',
        '#008800',
        '#00AA00',
        '#00CC00',
        '#00EE00',
        '#22FF00',
        '#44DD00',
        '#66BB00',
        '#880000',
        '#AA0000',
        '#CC0000',
        '#EE0000',
        '#FF0022',
        '#DD0044',
        '#BB0066',
    ]
};