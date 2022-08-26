import React, { FC } from "react";

import ColorBaseButton, { Props as ColorBaseButtonProps } from "./Base";

const ColorButton: FC<Props> = (props) => {
  return <ColorBaseButton {...props}></ColorBaseButton>;
};

export interface Props extends ColorBaseButtonProps {}

export default ColorButton;
