import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { BLUR_COMMAND, FOCUS_COMMAND, COMMAND_PRIORITY_LOW } from "lexical";
import { mergeRegister } from "@lexical/utils";

type OnFocusOnBlurPluginProps = {
  onFocus?: () => void;
  onBlur?: () => void;
};

export default function OnFocusOnBlurPlugin(props: OnFocusOnBlurPluginProps) {
  const { onFocus, onBlur } = props;

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        BLUR_COMMAND,
        () => {
          onBlur && onBlur();
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        FOCUS_COMMAND,
        () => {
          onFocus && onFocus();
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor]);

  return null;
}
