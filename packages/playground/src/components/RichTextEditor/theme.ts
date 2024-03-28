import type { EditorThemeClasses } from "lexical";

const theme: EditorThemeClasses = {
  blockCursor: "RTE_blockCursor",
  characterLimit: "RTE_characterLimit",
  embedBlock: {
    base: "RTE_embedBlock",
    focus: "RTE_embedBlockFocus",
  },
  hashtag: "RTE_hashtag",
  heading: {
    h1: "text-2xl",
    h2: "text-xl",
    h3: "text-lg",
    h4: "text-base font-bold",
    h5: "text-sm font-bold",
    h6: "text-xs font-bold",
  },
  image: "editor-image",
  indent: "RTE_indent",
  inlineImage: "inline-editor-image",
  layoutContainer: "RTE_layoutContaner",
  layoutItem: "RTE_layoutItem",
  link: "RTE_link",
  list: {
    listitem: "RTE_listItem",
    listitemChecked: "RTE_listItemChecked",
    listitemUnchecked: "RTE_listItemUnchecked",
    nested: {
      listitem: "RTE_nestedListItem",
    },
    olDepth: [
      "list-decimal RTE_ol1",
      "list-decimal RTE_ol2",
      "list-decimal RTE_ol3",
      "list-decimal RTE_ol4",
      "list-decimal RTE_ol5",
    ],
    ul: "list-disc RTE_ul",
  },
  ltr: "RTE_ltr",
  mark: "RTE_mark",
  markOverlap: "RTE_markOverlap",
  paragraph: "RTE_paragraph",
  quote: "RTE_quote",
  rtl: "RTE_rtl",
  table: "RTE_table",
  tableAddColumns: "RTE_tableAddColumns",
  tableAddRows: "RTE_tableAddRows",
  tableCell: "RTE_tableCell",
  tableCellActionButton: "RTE_tableCellActionButton",
  tableCellActionButtonContainer: "RTE_tableCellActionButtonContainer",
  tableCellEditing: "RTE_tableCellEditing",
  tableCellHeader: "RTE_tableCellHeader",
  tableCellPrimarySelected: "RTE_tableCellPrimarySelected",
  tableCellResizer: "RTE_tableCellResizer",
  tableCellSelected: "RTE_tableCellSelected",
  tableCellSortedIndicator: "RTE_tableCellSortedIndicator",
  tableResizeRuler: "RTE_tableCellResizeRuler",
  tableSelected: "RTE_tableSelected",
  tableSelection: "RTE_tableSelection",
  text: {
    bold: "font-bold",
    code: "RTE_textCode",
    italic: "italic",
    strikethrough: "line-through",
    subscript: "RTE_textSubscript",
    superscript: "RTE_textSuperscript",
    underline: "underline",
    underlineStrikethrough: "RTE_textUnderlineStrikethrough",
  },
  keyword: "text-blue-600",
};

export default theme;