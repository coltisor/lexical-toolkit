import React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $generateHtmlFromNodes } from "@lexical/html";
import { EditorState } from "lexical";

let PREV_HTML: string | undefined;
let PREV_TEXT: string | undefined;

type OnChangeContentPlugin = {
  onHtmlChange?: (newValue: string, editorState: EditorState) => void;
  onTextChange?: (newValue: string, editorState: EditorState) => void;
};

export default function OnChangeContentPlugin(props: OnChangeContentPlugin) {
  const { onHtmlChange, onTextChange } = props;

  const [editor] = useLexicalComposerContext();

  return (
    <OnChangePlugin
      onChange={(editorState) => {
        editorState.read(() => {
          let html = $generateHtmlFromNodes(editor);
          const text = editor.getRootElement()?.textContent || "";

          if (html !== PREV_HTML) {
            onHtmlChange && onHtmlChange(html, editorState);
            PREV_HTML = html;
          }

          if (text !== PREV_TEXT) {
            onTextChange && onTextChange(text, editorState);
            PREV_TEXT = text;
          }
        });
      }}
    />
  );
}
