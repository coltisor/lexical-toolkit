import { $createCodeNode } from "@lexical/code";
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingTagType,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
} from "lexical";

const blockTypeToBlockName = {
  bullet: "Bulleted List",
  check: "Check List",
  code: "Code Block",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
  number: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
};

const rootTypeToRootName = {
  root: "Root",
  table: "Table",
};

type UseBlockFormatParams = {
  blockType: keyof typeof blockTypeToBlockName;
  rootType: keyof typeof rootTypeToRootName;
  editor: LexicalEditor;
  disabled?: boolean;
};

export const useBlockFormat = (params: UseBlockFormatParams) => {
  const { blockType, editor } = params;

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatCheckList = () => {
    if (blockType !== "check") {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createQuoteNode());
      });
    }
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.update(() => {
        let selection = $getSelection();

        if (selection !== null) {
          if (selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.insertRawText(textContent);
            }
          }
        }
      });
    }
  };

  return {
    label: blockTypeToBlockName[blockType],
    paragraph: {
      title: "Normal",
      active: blockType === "paragraph",
      dispatch: () => formatParagraph(),
    },
    h1: {
      title: "Heading 1",
      active: blockType === "h1",
      dispatch: () => formatHeading("h1"),
    },
    h2: {
      title: "Heading 2",
      active: blockType === "h2",
      dispatch: () => formatHeading("h2"),
    },
    h3: {
      title: "Heading 3",
      active: blockType === "h3",
      dispatch: () => formatHeading("h3"),
    },
    h4: {
      title: "Heading 4",
      active: blockType === "h4",
      dispatch: () => formatHeading("h4"),
    },
    h5: {
      title: "Heading 5",
      active: blockType === "h5",
      dispatch: () => formatHeading("h5"),
    },
    h6: {
      title: "Heading 6",
      active: blockType === "h6",
      dispatch: () => formatHeading("h6"),
    },
    bulletList: {
      title: "Bullet List",
      active: blockType === "bullet",
      dispatch: () => formatBulletList(),
    },
    checkList: {
      title: "Check List",
      active: blockType === "check",
      dispatch: () => formatCheckList(),
    },
    numberList: {
      title: "Numbered List",
      active: blockType === "number",
      dispatch: () => formatNumberedList(),
    },
    quote: {
      title: "Quote",
      active: blockType === "quote",
      dispatch: () => formatQuote(),
    },
    code: {
      title: "Code Block",
      active: blockType === "code",
      dispatch: () => formatCode(),
    },
  };
};
