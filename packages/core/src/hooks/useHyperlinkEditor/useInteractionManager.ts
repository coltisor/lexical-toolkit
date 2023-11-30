import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  GridSelection,
  KEY_ESCAPE_COMMAND,
  LexicalEditor,
  NodeSelection,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { Dispatch, useCallback, useEffect, useState } from "react";
import { getSelectedNode } from "../../utils/getSelectedNode";

type UseInteractionManagerParams = {
  editor: LexicalEditor;
  isLink: boolean;
  setIsLink: Dispatch<boolean>;
  anchorElem: HTMLElement;
  isLinkEditMode: boolean;
  setIsLinkEditMode: Dispatch<boolean>;
};

export function useInteractionManager(params: UseInteractionManagerParams) {
  const {
    editor,
    isLink,
    anchorElem,
    setIsLink,
    isLinkEditMode,
    setIsLinkEditMode,
  } = params;

  const [linkUrl, setLinkUrl] = useState("");
  const [linkRect, setLinkRect] = useState<DOMRect | undefined>();
  const [lastSelection, setLastSelection] = useState<
    RangeSelection | GridSelection | NodeSelection | null
  >(null);

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const linkParent = $findMatchingParent(node, $isLinkNode);

      if (linkParent) {
        setLinkUrl(linkParent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl("");
      }
    }

    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;
    const rootElement = editor.getRootElement();

    if (
      selection !== null &&
      nativeSelection !== null &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode) &&
      editor.isEditable()
    ) {
      console.log("set to block");
      const domRect: DOMRect | undefined =
        nativeSelection.focusNode?.parentElement?.getBoundingClientRect();
      console.log(domRect);
      if (domRect) {
        setLinkRect(domRect);
      }
      setLastSelection(selection);
    } else if (!activeElement) {
      console.log("else no block");
      if (rootElement !== null) {
        setLinkRect(undefined);
        console.log("set to undefined");
      }
      setLastSelection(null);
      setIsLinkEditMode(false);
      setLinkUrl("");
    }

    return true;
  }, [anchorElem, editor, setIsLinkEditMode]);

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        updateLinkEditor();
      });
    };

    window.addEventListener("resize", update);

    if (scrollerElem) {
      scrollerElem.addEventListener("scroll", update);
    }

    return () => {
      window.removeEventListener("resize", update);

      if (scrollerElem) {
        scrollerElem.removeEventListener("scroll", update);
      }
    };
  }, [anchorElem.parentElement, editor, updateLinkEditor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          if (isLink) {
            setIsLink(false);
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_HIGH
      )
    );
  }, [editor, updateLinkEditor, setIsLink, isLink]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);

  return {
    currentNodeIsLink: isLink,
    linkNodeRect: linkRect,
    linkUrl: linkUrl,
    isLinkEditMode: isLinkEditMode,
    setIsLinkEditMode: setIsLinkEditMode,
    dispatchLinkSubmission: ({ url }: { url: string }) => {
      if (lastSelection !== null) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        setIsLinkEditMode(false);
      }
    },
    dispatchLinkRemoval: () => {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    },
  };
}
