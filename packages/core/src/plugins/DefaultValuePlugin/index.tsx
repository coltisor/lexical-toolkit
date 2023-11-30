import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $insertNodes } from "lexical";
import { convertHtmlToNodes } from "../../utils/convertHtmlToNodes";

export type DefaultValuePluginProps = {
  defaultValue: string;
};

export function DefaultValuePlugin(props: DefaultValuePluginProps) {
  const { defaultValue } = props;

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const editorState = editor.getEditorState();

    editorState.read(() => {
      editor.update(() => {
        const newNodes = convertHtmlToNodes(defaultValue, editor);

        const currentNodes = $getRoot();
        currentNodes.clear();

        $insertNodes(newNodes);
      });
    });
  }, []);

  return null;
}
