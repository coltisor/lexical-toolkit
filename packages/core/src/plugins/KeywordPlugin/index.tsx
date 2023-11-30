import type { TextNode } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalTextEntity } from "@lexical/react/useLexicalTextEntity";
import { useCallback, useEffect } from "react";
import { $createKeywordNode, KeywordNode } from "../../nodes/KeywordNode";

function createRegexForPhrases(phrases: string[]): RegExp {
  const regexPattern = phrases.join("|");
  return new RegExp(`(\b|^|$)(${regexPattern})(\b|^|$)`, "i");
}

export type KeywordPluginProps = {
  regex?: RegExp;
  phrases?: string[];
};

export function KeywordPlugin(props: KeywordPluginProps) {
  const { regex, phrases } = props;

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([KeywordNode])) {
      throw new Error("KeywordsPlugin: KeywordNode not registered on editor");
    }
  }, [editor]);

  const createKeywordNode = useCallback((textNode: TextNode): KeywordNode => {
    return $createKeywordNode(textNode.getTextContent());
  }, []);

  const getKeywordMatch = useCallback(
    (text: string) => {
      const matchText = (regExp: RegExp) => {
        const matchArr = regExp.exec(text);
        if (matchArr === null) {
          return null;
        }

        const keywordLength = matchArr[2].length;
        const startOffset = matchArr.index + matchArr[1].length;
        const endOffset = startOffset + keywordLength;

        return {
          end: endOffset,
          start: startOffset,
        };
      };

      if (regex) {
        return matchText(regex);
      }

      if (phrases) {
        const dynamicRegex = createRegexForPhrases(phrases);
        return matchText(dynamicRegex);
      }

      return null;
    },
    [regex, phrases]
  );

  useLexicalTextEntity<KeywordNode>(
    getKeywordMatch,
    KeywordNode,
    createKeywordNode
  );

  return null;
}
