import React from "react";
import { ReactNode } from "react";
import classes from "./Button.module.scss";
import { CSSProperties } from "styled-components";

type ButtonProps = {
  children: ReactNode;
  onClick?: any;
  disabled?: boolean;
  variant?: string;
  style?: CSSProperties;
  type?: "submit" | "button" | "reset";
  color?: string;
};

function Button({ children, onClick, disabled, variant, style, type }:ButtonProps) {
  return (
    <button
      type={type}
      className={`
        ${classes.button}
        ${variant ? classes[variant]: ""}
        `}
      onClick={onClick}
      style={style}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
