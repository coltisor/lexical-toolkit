import { $isAutoLinkNode, $isLinkNode } from "@lexical/link";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_LOW,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { Dispatch, useEffect, useState } from "react";
import { getSelectedNode } from "../../utils/getSelectedNode";
import useInteractionManager from "./useInteractionManager";

type UseHyperlinkEditorProps = {
  editor: LexicalEditor;
  anchorElem: HTMLElement;
  isLinkEditMode: boolean;
  setIsLinkEditMode: Dispatch<boolean>;
  canEditAutoLinks?: boolean;
};

export default function useHyperlinkEditor(props: UseHyperlinkEditorProps) {
  const {
    editor,
    anchorElem,
    isLinkEditMode,
    setIsLinkEditMode,
    canEditAutoLinks = true,
  } = props;

  const [activeEditor, setActiveEditor] = useState(editor);
  const [isLink, setIsLink] = useState(false);

  useEffect(() => {
    function updateToolbar() {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const node = getSelectedNode(selection);
        const linkParent = $findMatchingParent(node, $isLinkNode);
        const autoLinkParent = $findMatchingParent(node, $isAutoLinkNode);
        const parentIsLink = canEditAutoLinks
          ? linkParent !== null || autoLinkParent !== null
          : linkParent !== null && autoLinkParent === null;
        setIsLink(parentIsLink);
      }
    }

    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          setActiveEditor(newEditor);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerCommand(
        CLICK_COMMAND,
        (payload) => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const node = getSelectedNode(selection);
            const linkNode = $findMatchingParent(node, $isLinkNode);

            if ($isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey)) {
              window.open(linkNode.getURL(), "_blank");
              return true;
            }
          }

          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor]);

  return useInteractionManager({
    editor: activeEditor,
    isLink,
    anchorElem,
    setIsLink,
    isLinkEditMode,
    setIsLinkEditMode,
  });
}
