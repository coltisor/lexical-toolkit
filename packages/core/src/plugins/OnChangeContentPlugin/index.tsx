import React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $generateHtmlFromNodes } from "@lexical/html";
import { EditorState } from "lexical";

let PREV_HTML: string | undefined;
let PREV_TEXT: string | undefined;

export type OnChangeContentPluginProps = {
  onHtmlChange?: (
    newHtml: string,
    newPlainText: string,
    editorState: EditorState
  ) => void;
  onTextChange?: (
    newPlain: string,
    newHtml: string,
    editorState: EditorState
  ) => void;
};

export function OnChangeContentPlugin(props: OnChangeContentPluginProps) {
  const { onHtmlChange, onTextChange } = props;

  const [editor] = useLexicalComposerContext();

  return (
    <OnChangePlugin
      onChange={(editorState) => {
        editorState.read(() => {
          let html = $generateHtmlFromNodes(editor);
          const text = editor.getRootElement()?.textContent || "";

          if (html !== PREV_HTML) {
            onHtmlChange && onHtmlChange(html, text, editorState);
            PREV_HTML = html;
          }

          if (text !== PREV_TEXT) {
            onTextChange && onTextChange(text, text, editorState);
            PREV_TEXT = text;
          }
        });
      }}
    />
  );
}
