"use client";
import React, { useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RTE_INITIAL_CONFIG } from "./config";
import { Toolbar } from "./Toolbar";
import "./theme.css";
import { HyperlinkPlugin, KeywordPlugin } from "lexical-toolkit";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkEditor } from "./LinkEditor";

export type RichTextEditorProps = {
  placeholder?: string;
};

export const RichTextEditor = (props: RichTextEditorProps) => {
  const { placeholder } = props;

  const [isLinkEditMode, setIsLinkEditMode] = useState(false);
  const [floatingAnchor, setFloatingAnchor] = useState<HTMLElement>();

  return (
    <LexicalComposer initialConfig={RTE_INITIAL_CONFIG}>
      <div className="mx-auto w-full max-w-6xl rounded-xl bg-white p-5 text-black shadow-lg">
        <div className="relative overflow-hidden rounded-md border border-gray-200">
          <Toolbar
            isLinkEditMode={isLinkEditMode}
            setIsLinkEditMode={setIsLinkEditMode}
          />

          <div
            className="relative"
            ref={(el) =>
              (!floatingAnchor && el && setFloatingAnchor(el)) || undefined
            }
          >
            <RichTextPlugin
              ErrorBoundary={LexicalErrorBoundary as any}
              contentEditable={
                <div className="h-96 w-full overflow-y-auto">
                  <div className="h-full p-2">
                    <ContentEditable className="h-full [&[contenteditable]]:focus:border-none [&[contenteditable]]:focus:outline-none [&[contenteditable]]:active:border-none [&[contenteditable]]:active:outline-none" />
                  </div>
                </div>
              }
              placeholder={
                placeholder ? (
                  <div className="pointer-events-none absolute left-0 top-0 p-2 opacity-50">
                    {placeholder}
                  </div>
                ) : null
              }
            />
          </div>

          <HyperlinkPlugin />
          {floatingAnchor && (
            <LinkEditor
              anchorElem={floatingAnchor}
              isLinkEditMode={isLinkEditMode}
              setIsLinkEditMode={setIsLinkEditMode}
            />
          )}

          <KeywordPlugin
            phrases={[
              "Congratulations",
              "Congrats",
              "Happy new year",
              "Happy birthday",
            ]}
          />

          <TabIndentationPlugin />
          <HistoryPlugin />
          <ListPlugin />
          <TablePlugin />
          <HashtagPlugin />
          <AutoFocusPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
};
