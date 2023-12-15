"use client";

import React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalToolbar } from "lexical-toolkit";
import { cs } from "@/helpers/classNames";

export const Toolbar = () => {
  const [editor] = useLexicalComposerContext();

  const toolbar = useLexicalToolbar({
    editor: editor,
  });

  return (
    <div className="flex w-full border-b border-gray-200 text-xl text-gray-600">
      <div className="flex w-full border-b border-gray-200 text-xl text-gray-600">
        <button
          className={cs(
            "active: h-10 w-10 border-r border-gray-200 outline-none hover:text-indigo-500 focus:outline-none",
            toolbar.bold.active && "bg-gray-50",
          )}
          onClick={() => toolbar.bold.dispatch()}
        >
          B
        </button>
        <button
          className={cs(
            "active: h-10 w-10 border-r border-gray-200 italic outline-none hover:text-indigo-500 focus:outline-none",
            toolbar.italic.active && "bg-gray-50",
          )}
          onClick={() => toolbar.italic.dispatch()}
        >
          I
        </button>
        <button
          className={cs(
            "active: h-10 w-10 border-r border-gray-200 underline outline-none hover:text-indigo-500 focus:outline-none",
            toolbar.underline.active && "bg-gray-50",
          )}
          onClick={() => toolbar.underline.dispatch()}
        >
          U
        </button>
        <button
          className={cs(
            "active: h-10 w-10 border-r border-gray-200 outline-none hover:text-indigo-500 focus:outline-none",
            toolbar.blockFormatting.paragraph.active && "bg-gray-50",
          )}
          onClick={() => toolbar.blockFormatting.paragraph.dispatch()}
        >
          ¶
        </button>
        <button
          className={cs(
            "active: h-10 w-10 border-r border-gray-200 outline-none hover:text-indigo-500 focus:outline-none",
            toolbar.blockFormatting.h1.active && "bg-gray-50",
          )}
          onClick={() => toolbar.blockFormatting.h1.dispatch()}
        >
          H<sub>1</sub>
        </button>
        <button
          className={cs(
            "active: h-10 w-10 border-r border-gray-200 outline-none hover:text-indigo-500 focus:outline-none",
            toolbar.blockFormatting.h2.active && "bg-gray-50",
          )}
          onClick={() => toolbar.blockFormatting.h2.dispatch()}
        >
          H<sub>2</sub>
        </button>
        <button
          className={cs(
            "active: h-10 w-10 border-r border-gray-200 outline-none hover:text-indigo-500 focus:outline-none",
            toolbar.blockFormatting.h3.active && "bg-gray-50",
          )}
          onClick={() => toolbar.blockFormatting.h3.dispatch()}
        >
          H<sub>3</sub>
        </button>
        <button
          className={cs(
            "active: h-10 w-10 border-r border-gray-200 outline-none hover:text-indigo-500 focus:outline-none",
            toolbar.blockFormatting.bulletList.active && "bg-gray-50",
          )}
          onClick={() => toolbar.blockFormatting.bulletList.dispatch()}
        >
          ⋮
        </button>
        <button
          className={cs(
            "active: h-10 w-10 border-r border-gray-200 outline-none hover:text-indigo-500 focus:outline-none",
            toolbar.blockFormatting.numberList.active && "bg-gray-50",
          )}
          onClick={() => toolbar.blockFormatting.numberList.dispatch()}
        >
          ≡
        </button>
        <button
          className={cs(
            "active: h-10 w-10 border-r border-gray-200 outline-none hover:text-indigo-500 focus:outline-none",
            toolbar.elementFormatting.leftAlign.active && "bg-gray-50",
          )}
          onClick={() => toolbar.elementFormatting.leftAlign.dispatch()}
        >
          ⇤
        </button>
        <button
          className={cs(
            "active: h-10 w-10 border-r border-gray-200 outline-none hover:text-indigo-500 focus:outline-none",
            toolbar.elementFormatting.centerAlign.active && "bg-gray-50",
          )}
          onClick={() => toolbar.elementFormatting.centerAlign.dispatch()}
        >
          ⇔
        </button>
        <button
          className={cs(
            "active: h-10 w-10 border-r border-gray-200 outline-none hover:text-indigo-500 focus:outline-none",
            toolbar.elementFormatting.rightAlign.active && "bg-gray-50",
          )}
          onClick={() => toolbar.elementFormatting.rightAlign.dispatch()}
        >
          ⇥
        </button>
      </div>
    </div>
  );
};
