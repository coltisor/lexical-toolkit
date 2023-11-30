import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $insertNodes } from "lexical";
import convertHtmlToNodes from "../../utils/convertHtmlToNodes";

type ControlledValuePluginProps = {
  value: string;
};

export default function ControlledValuePlugin(
  props: ControlledValuePluginProps
) {
  const { value } = props;

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const editorState = editor.getEditorState();

    editorState.read(() => {
      editor.update(() => {
        const newNodes = convertHtmlToNodes(value, editor);

        const currentNodes = $getRoot();
        currentNodes.clear();

        $insertNodes(newNodes);
      });
    });
  }, [value]);

  return null;
}
