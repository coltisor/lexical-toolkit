import { $patchStyleText } from "@lexical/selection";
import {
  $getSelection,
  LexicalEditor,
} from "lexical";
import { useCallback } from "react";

const FONT_FAMILY_OPTIONS: [string, string][] = [
  ["Arial", "Arial"],
  ["Courier New", "Courier New"],
  ["Georgia", "Georgia"],
  ["Times New Roman", "Times New Roman"],
  ["Trebuchet MS", "Trebuchet MS"],
  ["Verdana", "Verdana"],
];

const FONT_SIZE_OPTIONS: [string, string][] = [
  ["10px", "10px"],
  ["11px", "11px"],
  ["12px", "12px"],
  ["13px", "13px"],
  ["14px", "14px"],
  ["15px", "15px"],
  ["16px", "16px"],
  ["17px", "17px"],
  ["18px", "18px"],
  ["19px", "19px"],
  ["20px", "20px"],
];

type UseFontFormatOptionsParams = {
  editor: LexicalEditor;
  value: string;
  style: string;
};

export const useFontFormatOptions = (params: UseFontFormatOptionsParams) => {
  const { editor, value, style } = params;

  const handleClick = useCallback(
    (option: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if (selection !== null) {
          $patchStyleText(selection, {
            [style]: option,
          });
        }
      });
    },
    [editor, style],
  );

  return (
    style === "font-family" ? FONT_FAMILY_OPTIONS : FONT_SIZE_OPTIONS
  ).map(([option, text]) => {
    return {
      title: text,
      value: option,
      active: value === option,
      dispatch: () => handleClick(option),
    };
  });
};
