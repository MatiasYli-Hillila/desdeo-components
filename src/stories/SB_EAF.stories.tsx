import React, { ComponentProps } from "react";
import { Story } from "@storybook/react";
import SB_EAF from "../components/SB_EAF";

import {  } from "../data/ExampleData";



export default {
  title: "SB-EAF",
  component: SB_EAF,
};

const Template: Story<ComponentProps<typeof SB_EAF>> = () => {
  return (
      <SB_EAF/>
  );
};

export const RenameThisExample = Template.bind({});
RenameThisExample.args = {};