import {
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  LexicalEditor,
  OUTDENT_CONTENT_COMMAND,
} from "lexical";

const ELEMENT_FORMAT_OPTIONS: {
  [key in Exclude<ElementFormatType, "">]: {
    icon: string;
    iconRTL: string;
    name: string;
  };
} = {
  center: {
    icon: "center-align",
    iconRTL: "right-align",
    name: "Center Align",
  },
  end: {
    icon: "right-align",
    iconRTL: "left-align",
    name: "End Align",
  },
  justify: {
    icon: "justify-align",
    iconRTL: "justify-align",
    name: "Justify Align",
  },
  left: {
    icon: "left-align",
    iconRTL: "left-align",
    name: "Left Align",
  },
  right: {
    icon: "right-align",
    iconRTL: "left-align",
    name: "Right Align",
  },
  start: {
    icon: "left-align",
    iconRTL: "right-align",
    name: "Start Align",
  },
};

export const useElementFormat = ({
  editor,
  value,
}: {
  editor: LexicalEditor;
  value: ElementFormatType;
}) => {
  const formatOption = ELEMENT_FORMAT_OPTIONS[value || "left"];
  return {
    label: formatOption.name,
    leftAlign: {
      active: value === "left",
      title: "Left Align",
      dispatch: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left"),
    },
    centerAlign: {
      active: value === "center",
      title: "Center Align",
      dispatch: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center"),
    },
    rightAlign: {
      active: value === "right",
      title: "Right Align",
      dispatch: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right"),
    },
    justifyAlign: {
      active: value === "justify",
      title: "Justify Align",
      dispatch: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify"),
    },
    startAlign: {
      active: value === "start",
      title: "Start Align",
      dispatch: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "start"),
    },
    endAlign: {
      active: value === "end",
      title: "End Align",
      dispatch: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "end"),
    },
    indent: {
      title: "Indent",
      dispatch: () => editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined),
    },
    outdent: {
      title: "Outdent",
      dispatch: () =>
        editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined),
    },
  };
};
