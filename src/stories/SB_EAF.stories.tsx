import React, { ComponentProps } from "react";
import { Story } from "@storybook/react";
import SB_EAF from "../components/SB_EAF";
import {
    eighteenSolThreeScenariosTwoObjectivesExampleData,
    oneSolTwentyScenariosTwoObjectivesExampleData,
    forest2D
} from "../data/SB_EAFExampleData";
import { interpolateBlues, interpolateViridis } from "d3-scale-chromatic";



export default {
    /*
    * asdf
    */
    title: "Scenario based/SB-EAF",
    component: SB_EAF,
    argTypes: {
        showScenarioNames: {
            defaultValue: true,
            control: 'boolean'
        }/*,
        scenarioCountColorFunction: {
            options: ['interpolateBlues', 'interpolateViridis'],
            //mapping: [interpolateBlues, interpolateViridis],
            //defaultValue: 'interpolateViridis',
            control:  { type: 'select' }
        }
        */
    }
};

/*
* Failed attempt to add the color function as a control to the storybook

const testiFunktio = (valueScenarioCountColorFunction: string): ((t: number) => string) => {
    return interpolateBlues;
}


const Template: Story<ComponentProps<typeof SB_EAF>> = {(colorFunctionString: string, args)} => {
    const testiTulos = testiFunktio(colorFunctionString);
    return <SB_EAF scenarioCountColorFunction={testiTulos} {...args}/>
};
*/

const Template: Story<ComponentProps<typeof SB_EAF>> = args => {
    return <SB_EAF {...args} />
}

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
    //showScenarioNames: true,
    solutionCollection: eighteenSolThreeScenariosTwoObjectivesExampleData
};


export const OneSolutionTwentyScenariosTwoObjectivesCustomColors = Template.bind({});
OneSolutionTwentyScenariosTwoObjectivesCustomColors.args = {
    //showScenarioNames: true,
    solutionCollection: oneSolTwentyScenariosTwoObjectivesExampleData
    //scenarioCountColorFunction: interpolateBlues
};

export const ForestOptimization2D = Template.bind({});
ForestOptimization2D.args = {
    solutionCollection: forest2D
}