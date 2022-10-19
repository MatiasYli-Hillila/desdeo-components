import React, { ComponentProps } from "react";
import { Story } from "@storybook/react";
import SB_EAF from "../components/SB_EAF";
import {
    readFileTestExampleData
 } from "../data/SB_EAFExampleData";



export default {
    title: "Scenario based/SB-EAF",
    component: SB_EAF,
};

const Template: Story<ComponentProps<typeof SB_EAF>> = args => {
    return <SB_EAF{...args}/>
};

export const readFileDataTest = Template.bind({});
readFileDataTest.args = {
    solutionCollection: readFileTestExampleData
};