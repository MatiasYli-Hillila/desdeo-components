import React, { ComponentProps } from "react";
import { Story } from "@storybook/react";
import SB_EAF from "../components/SB_EAF";
import { exampleData2Objectives2Scenarios2Solutions } from "../data/SB_EAFExampleData";



export default {
    title: "Scenario based/SB-EAF",
    component: SB_EAF,
};

const Template: Story<ComponentProps<typeof SB_EAF>> = args => {
    return <SB_EAF{...args}/>
};

export const RenameThisExample = Template.bind({});
RenameThisExample.args = {
    solutionCollection: exampleData2Objectives2Scenarios2Solutions
};