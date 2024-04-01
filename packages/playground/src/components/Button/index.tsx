import { cs } from "@/helpers/classNames";
import React from "react";

export type ButtonProps = {
  active?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = (props: ButtonProps) => {
  const { children, active, onClick, className } = props;

  return (
    <button
      className={cs(
        "flex h-10 w-10 items-center justify-center border-r border-gray-200 outline-none hover:text-indigo-500 focus:outline-none",
        active && "text-indigo-600",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
