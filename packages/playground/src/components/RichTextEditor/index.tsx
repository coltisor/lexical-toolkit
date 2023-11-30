"use client";

import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RTE_INITIAL_CONFIG } from "./config";
import { Toolbar } from "./Toolbar";

export type RichTextEditorProps = {
  placeholder?: string;
};

export const RichTextEditor = (props: RichTextEditorProps) => {
  const { placeholder } = props;
  return (
    <LexicalComposer initialConfig={RTE_INITIAL_CONFIG}>
      <div>
        <Toolbar />
        <div>
          <RichTextPlugin
            ErrorBoundary={LexicalErrorBoundary as any}
            contentEditable={
              <div>
                <div>
                  <ContentEditable />
                </div>
              </div>
            }
            placeholder={placeholder ? <p>{placeholder}</p> : null}
          />
        </div>
      </div>
    </LexicalComposer>
  );
};
