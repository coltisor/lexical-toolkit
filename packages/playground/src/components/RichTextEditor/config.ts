import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { HashtagNode } from "@lexical/hashtag";
import { InitialConfigType } from "@lexical/react/LexicalComposer";
// import { LexicalTheme } from "./LexicalTheme/LexicalTheme";
// import { KeywordNode } from "./LexicalToolkit/LexicalKeywordsPlugin/LexicalKeywordNode";

export const RTE_INITIAL_CONFIG: InitialConfigType = {
  namespace: "vanguard-rich-text-editor",
  onError: (error) => console.error(error),
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    HashtagNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
    // KeywordNode,
  ],
  // theme: LexicalTheme,
};
