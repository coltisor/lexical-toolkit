import {
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getLanguageFriendlyName,
} from "@lexical/code";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $isListNode, ListNode } from "@lexical/list";
import { $isDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { $isHeadingNode, $isQuoteNode } from "@lexical/rich-text";
import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $patchStyleText,
} from "@lexical/selection";
import { $isTableNode } from "@lexical/table";
import {
  $findMatchingParent,
  $getNearestBlockElementAncestorOrThrow,
  $getNearestNodeOfType,
  mergeRegister,
} from "@lexical/utils";
import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_NORMAL,
  DEPRECATED_$isGridSelection,
  ElementFormatType,
  FORMAT_TEXT_COMMAND,
  KEY_MODIFIER_COMMAND,
  LexicalEditor,
  NodeKey,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useCallback, useEffect, useState } from "react";
import { useFontFormatOptions } from "./useFontFormatOptions";
import { useElementFormat } from "./useElementFormat";
import { useBlockFormat } from "./useBlockFormat";
import { getSelectedNode } from "../../utils/getSelectedNode";

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

function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = [];

  for (const [lang, friendlyName] of Object.entries(
    CODE_LANGUAGE_FRIENDLY_NAME_MAP
  )) {
    options.push([lang, friendlyName]);
  }

  return options;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

export type UseLexicalToolbarParams = {
  editor: LexicalEditor;
  urlInitialValue?: string;
};

export function useLexicalToolbar(params: UseLexicalToolbarParams) {
  const { editor, urlInitialValue = "" } = params;

  const [activeEditor, setActiveEditor] = useState(editor);

  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>("paragraph");
  const [rootType, setRootType] =
    useState<keyof typeof rootTypeToRootName>("root");
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null
  );

  const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [fontSize, setFontSize] = useState<string>("15px");
  const [fontColor, setFontColor] = useState<string>("var(--n700)");
  const [bgColor, setBgColor] = useState<string>("var(--n000)");
  const [elementFormat, setElementFormat] = useState<ElementFormatType>("left");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<string>("");

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsSubscript(selection.hasFormat("subscript"));
      setIsSuperscript(selection.hasFormat("superscript"));
      setIsCode(selection.hasFormat("code"));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      const tableNode = $findMatchingParent(node, $isTableNode);
      if ($isTableNode(tableNode)) {
        setRootType("table");
      } else {
        setRootType("root");
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
          if ($isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            setCodeLanguage(
              language ? CODE_LANGUAGE_MAP[language] || language : ""
            );
            return;
          }
        }
      }
      // Handle buttons
      setFontSize(
        $getSelectionStyleValueForProperty(selection, "font-size", "15px")
      );
      setFontColor(
        $getSelectionStyleValueForProperty(selection, "color", "var(--n700)")
      );
      setBgColor(
        $getSelectionStyleValueForProperty(
          selection,
          "background-color",
          "var(--n000)"
        )
      );
      setFontFamily(
        $getSelectionStyleValueForProperty(selection, "font-family", "Arial")
      );
      setElementFormat(
        ($isElementNode(node)
          ? node.getFormatType()
          : parent?.getFormatType()) || "left"
      );
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        $updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [$updateToolbar, activeEditor, editor]);

  useEffect(() => {
    return activeEditor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload;
        const { code, ctrlKey, metaKey } = event;

        if (code === "KeyK" && (ctrlKey || metaKey)) {
          event.preventDefault();

          return activeEditor.dispatchCommand(
            TOGGLE_LINK_COMMAND,
            urlInitialValue
          );
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL
    );
  }, [activeEditor, isLink]);

  const applyStyleText = useCallback(
    (styles: Record<string, string>) => {
      activeEditor.update(() => {
        const selection = $getSelection();
        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          $patchStyleText(selection, styles);
        }
      });
    },
    [activeEditor]
  );

  const clearFormatting = useCallback(() => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor;
        const focus = selection.focus;
        const nodes = selection.getNodes();

        if (anchor.key === focus.key && anchor.offset === focus.offset) {
          return;
        }

        nodes.forEach((node, idx) => {
          // We split the first and last node by the selection
          // So that we don't format unselected text inside those nodes
          if ($isTextNode(node)) {
            if (idx === 0 && anchor.offset !== 0) {
              node = node.splitText(anchor.offset)[1] || node;
            }
            if (idx === nodes.length - 1) {
              node = node.splitText(focus.offset)[0] || node;
            }

            if (node.__style !== "") {
              node.setStyle("");
            }
            if (node.__format !== 0) {
              node.setFormat(0);
              $getNearestBlockElementAncestorOrThrow(node).setFormat("");
            }
          } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
            node.replace($createParagraphNode(), true);
          } else if ($isDecoratorBlockNode(node)) {
            node.setFormat("");
          }
        });
      }
    });
  }, [activeEditor]);

  const onFontColorSelect = useCallback(
    (value: string) => {
      applyStyleText({ color: value });
    },
    [applyStyleText]
  );

  const onBgColorSelect = useCallback(
    (value: string) => {
      applyStyleText({ "background-color": value });
    },
    [applyStyleText]
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, urlInitialValue);
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey]
  );

  return {
    isRTL: isRTL,
    blockType: blockType,
    isEditable: isEditable,
    undo: {
      dispatch: () => activeEditor.dispatchCommand(UNDO_COMMAND, undefined),
      disabled: !canUndo || !isEditable,
      title: "Undo (Ctrl+Z or ⌘Z)",
    },
    redo: {
      dispatch: () => activeEditor.dispatchCommand(REDO_COMMAND, undefined),
      disabled: !canRedo || !isEditable,
      title: "Redo (Ctrl+Y or ⌘Y)",
    },
    bold: {
      show: blockType !== "code",
      disabled: !isEditable,
      active: isBold,
      title: "Bold (Ctrl+B or ⌘B)",
      dispatch: () => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold"),
    },
    italic: {
      show: blockType !== "code",
      disabled: !isEditable,
      active: isItalic,
      title: "Italic (Ctrl+I or ⌘I)",
      dispatch: () =>
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic"),
    },
    underline: {
      show: blockType !== "code",
      disabled: !isEditable,
      active: isUnderline,
      title: "Underline (Ctrl+U or ⌘U)",
      dispatch: () =>
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline"),
    },
    strikethrough: {
      show: blockType !== "code",
      disabled: !isEditable,
      active: isStrikethrough,
      title: "Strikethrough",
      dispatch: () =>
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough"),
    },
    subscript: {
      show: blockType !== "code",
      disabled: !isEditable,
      active: isSubscript,
      title: "Subscript",
      dispatch: () =>
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript"),
    },
    superscript: {
      show: blockType !== "code",
      disabled: !isEditable,
      active: isSuperscript,
      title: "Superscript",
      dispatch: () =>
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript"),
    },
    clearFormatting: {
      show: blockType !== "code",
      disabled: !isEditable,
      title: "Clear formatting",
      dispatch: () => clearFormatting(),
    },
    link: {
      show: blockType !== "code",
      disabled: !isEditable,
      active: isLink,
      title: "Insert link",
      dispatch: () => insertLink(),
    },
    fontFamily: {
      show: blockType !== "code",
      disabled: !isEditable,
      title: "Font family",
      value: fontFamily,
      options: useFontFormatOptions({
        editor: activeEditor,
        value: fontFamily,
        style: "font-family",
      }),
    },
    fontSize: {
      show: blockType !== "code",
      disabled: !isEditable,
      title: "Font size",
      value: fontSize,
      options: useFontFormatOptions({
        editor: activeEditor,
        value: fontColor,
        style: "size",
      }),
    },
    fontColor: {
      show: blockType !== "code",
      disabled: !isEditable,
      title: "Text color",
      value: fontColor,
      dispatch: onFontColorSelect,
    },
    backgroundColor: {
      show: blockType !== "code",
      disabled: !isEditable,
      title: "Background color",
      value: bgColor,
      dispatch: onBgColorSelect,
    },
    hr: {
      show: blockType !== "code",
      disabled: !isEditable,
      title: "Insert horizontal rule",
      dispatch: () =>
        activeEditor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined),
    },
    blockFormatting: {
      show: blockType in blockTypeToBlockName && activeEditor === editor,
      disabled: !isEditable,
      value: blockType,
      ...useBlockFormat({
        editor: activeEditor,
        blockType,
        rootType,
      }),
    },
    elementFormatting: {
      disabled: !isEditable,
      value: elementFormat,
      ...useElementFormat({
        editor: activeEditor,
        value: elementFormat,
      }),
    },
    code: {
      disabled: !isEditable,
      active: isCode,
      insert: {
        show: blockType !== "code",
        title: "Insert code block",
        dispatch: () =>
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "code"),
      },
      edit: {
        show: blockType === "code",
        title: "Select language",
        value: codeLanguage,
        label: getLanguageFriendlyName(codeLanguage),
        options: CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
          return {
            title: name,
            value: value,
            active: value === codeLanguage,
            dispatch: () => onCodeLanguageSelect(value),
          };
        }),
      },
    },
  };
}
