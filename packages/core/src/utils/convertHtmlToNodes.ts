import { LexicalEditor } from "lexical/LexicalEditor";
import { $generateNodesFromDOM } from "@lexical/html";

export function convertHtmlToNodes(html: string, editor: LexicalEditor) {
  // Use the native DOMParser API to parse the HTML string
  const parser = new DOMParser();
  const newDOM = parser.parseFromString(html, "text/html");

  // Generate LexicalNodes based on the DOM instance
  return $generateNodesFromDOM(editor, newDOM);
}
